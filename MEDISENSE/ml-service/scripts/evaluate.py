"""
Evaluates a trained model against a held-out test set and prints a full
classification report (precision/recall/F1 per class) plus a confusion
matrix. Run after training to sanity-check real-world performance.

Usage:
    python scripts/evaluate.py --data_dir data/test --model models/skin_classifier.h5
"""
import argparse
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", default="data/test")
    parser.add_argument("--model", default="models/skin_classifier.keras")
    parser.add_argument("--image_size", type=int, default=224)
    parser.add_argument("--batch_size", type=int, default=32)
    args = parser.parse_args()

    if not os.path.exists(args.model):
        print(f"ERROR: model not found at {args.model}. Train it first with scripts/train.py.")
        sys.exit(1)

    model = tf.keras.models.load_model(args.model)

    datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1.0 / 255)
    test_gen = datagen.flow_from_directory(
        args.data_dir,
        target_size=(args.image_size, args.image_size),
        batch_size=args.batch_size,
        class_mode="categorical",
        shuffle=False,
    )

    class_names = list(test_gen.class_indices.keys())

    predictions = model.predict(test_gen, verbose=1)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = test_gen.classes

    print("\n=== Classification Report ===")
    print(classification_report(true_classes, predicted_classes, target_names=class_names))

    print("=== Confusion Matrix ===")
    print(confusion_matrix(true_classes, predicted_classes))


if __name__ == "__main__":
    main()
