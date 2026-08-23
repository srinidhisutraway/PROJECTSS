"""
Training script for the MediSense skin condition classifier.

Usage:
    python scripts/train.py --data_dir data --epochs 30 --fine_tune_epochs 10

Expected data layout (standard Keras ImageDataGenerator format):
    data/
      train/
        acne/*.jpg
        eczema/*.jpg
        psoriasis/*.jpg
        melanocytic_nevus/*.jpg
        healthy/*.jpg
      val/
        acne/*.jpg
        ...

Adding a new disease later: create a new folder named after the class
under both train/ and val/, add a matching entry to
app/core/knowledge_base.py, then retrain. No other code changes needed.
"""
import argparse
import json
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import tensorflow as tf
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

from app.core.model_arch import build_model


def build_generators(train_dir, val_dir, image_size, batch_size):
    train_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
        rescale=1.0 / 255,
        rotation_range=20,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.1,
        zoom_range=0.15,
        horizontal_flip=True,
        brightness_range=(0.8, 1.2),
    )
    val_datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1.0 / 255)

    train_gen = train_datagen.flow_from_directory(
        train_dir, target_size=(image_size, image_size), batch_size=batch_size, class_mode="categorical"
    )
    val_gen = val_datagen.flow_from_directory(
        val_dir, target_size=(image_size, image_size), batch_size=batch_size, class_mode="categorical", shuffle=False
    )
    return train_gen, val_gen


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", default="data", help="Root dir containing train/ and val/ subfolders")
    parser.add_argument("--epochs", type=int, default=30)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--image_size", type=int, default=224)
    parser.add_argument("--fine_tune_epochs", type=int, default=10, help="Extra epochs with base model unfrozen")
    parser.add_argument("--output", default="models/skin_classifier.keras")
    parser.add_argument("--labels_output", default="models/labels.json")
    args = parser.parse_args()

    train_dir = os.path.join(args.data_dir, "train")
    val_dir = os.path.join(args.data_dir, "val")

    if not os.path.isdir(train_dir) or not os.path.isdir(val_dir):
        print(f"ERROR: expected '{train_dir}' and '{val_dir}' to exist. See docstring for expected layout.")
        sys.exit(1)

    train_gen, val_gen = build_generators(train_dir, val_dir, args.image_size, args.batch_size)
    class_indices = train_gen.class_indices  # {label: index}
    labels_ordered = [None] * len(class_indices)
    for label, idx in class_indices.items():
        labels_ordered[idx] = label

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.labels_output, "w") as f:
        json.dump(labels_ordered, f, indent=2)
    print(f"Classes discovered: {labels_ordered}")

    # Print per-class image counts so imbalance is visible up front —
    # useful for spotting which classes need more real data (rather than
    # relying purely on loss-weighting to compensate).
    counts = np.bincount(train_gen.classes)
    for label, count in zip(labels_ordered, counts):
        print(f"  {label}: {count} training images")

    class_weights_arr = compute_class_weight(
        class_weight="balanced",
        classes=np.unique(train_gen.classes),
        y=train_gen.classes,
    )
    # Raw "balanced" weights scale inversely with class frequency, which
    # can overcorrect when class sizes differ a lot (a rare class can end
    # up with several times the loss weight of common ones), pushing the
    # model to over-predict that class everywhere at inference time.
    # Taking the square root softens this into a more stable middle
    # ground — still compensates for imbalance, without letting one small
    # class dominate training and cause a low-precision/high-recall
    # blowout on that class (the exact pattern this fixes).
    class_weights_arr = np.sqrt(class_weights_arr)
    class_weights = {i: w for i, w in enumerate(class_weights_arr)}
    print(f"Class weights (sqrt-dampened, handles imbalance without overcorrecting): {class_weights}")

    model = build_model(num_classes=len(labels_ordered), image_size=args.image_size, fine_tune_base=False)

    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor="val_accuracy", patience=6, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3),
        tf.keras.callbacks.ModelCheckpoint(args.output, monitor="val_accuracy", save_best_only=True),
    ]

    print("\n=== Phase 1: Training classifier head (base frozen) ===")
    model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=args.epochs,
        class_weight=class_weights,
        callbacks=callbacks,
    )

    if args.fine_tune_epochs > 0:
        print("\n=== Phase 2: Fine-tuning base model (unfrozen, low LR) ===")
        base_model = model.layers[2]  # MobileNetV2 sub-model within the functional graph
        base_model.trainable = True
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
            loss="categorical_crossentropy",
            metrics=["accuracy"],
        )
        model.fit(
            train_gen,
            validation_data=val_gen,
            epochs=args.fine_tune_epochs,
            class_weight=class_weights,
            callbacks=callbacks,
        )

    model.save(args.output)
    print(f"\nModel saved to {args.output}")
    print(f"Labels saved to {args.labels_output}")

    print("\n=== Final Evaluation ===")
    results = model.evaluate(val_gen)
    for name, value in zip(model.metrics_names, results):
        print(f"{name}: {value:.4f}")


if __name__ == "__main__":
    main()
