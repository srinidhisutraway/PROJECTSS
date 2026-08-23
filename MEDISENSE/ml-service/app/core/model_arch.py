"""
CNN architecture for skin condition classification.

Uses transfer learning on top of MobileNetV2 (lightweight, fast to train
and to serve on CPU — well suited for a final-year-project deployment
target). Swap the base model here if you have more compute/data available.
"""
import tensorflow as tf
from tensorflow.keras import layers, models


def build_model(num_classes: int, image_size: int = 224, fine_tune_base: bool = False) -> tf.keras.Model:
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(image_size, image_size, 3),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = fine_tune_base

    inputs = layers.Input(shape=(image_size, image_size, 3))
    # Our preprocessing pipeline (app/core/preprocessing.py) already scales
    # images to [0, 1]. MobileNetV2's expected preprocessing maps [0, 255]
    # images to [-1, 1] via (x / 127.5 - 1), which is equivalent to
    # (x_0to1 * 2 - 1) for already-normalized [0, 1] input. We use a proper
    # Keras `Rescaling` layer for this rather than raw tensor arithmetic —
    # raw ops embedded in the graph (e.g. `inputs * 255.0`) get traced as
    # anonymous TFOpLambda nodes that Keras's legacy .h5 loader cannot
    # always deserialize (`Unknown layer: 'TrueDivide'` etc.). Rescaling
    # is a first-class registered layer, so it saves/loads reliably in
    # both the native .keras format and legacy .h5.
    x = layers.Rescaling(scale=2.0, offset=-1.0)(inputs)
    x = base_model(x, training=fine_tune_base)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs, name="medisense_skin_classifier")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy", tf.keras.metrics.TopKCategoricalAccuracy(k=2, name="top2_accuracy")],
    )
    return model
