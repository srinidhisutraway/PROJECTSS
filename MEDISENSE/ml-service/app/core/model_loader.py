"""
Loads the trained model at startup. If no trained model file is present
(common for a fresh clone before running scripts/train.py), the service
falls back to a deterministic "mock mode" that returns plausible,
clearly-labeled heuristic predictions derived from simple image
statistics — so the rest of the application (backend + frontend) remains
fully testable end-to-end without requiring a GPU or a trained model.
"""
import os
import json
import numpy as np
import cv2
from app.core.config import settings
from app.core.knowledge_base import CLASS_NAMES

_model = None
_labels = None
_mock_mode = False


def _load_labels():
    if os.path.exists(settings.labels_path):
        with open(settings.labels_path, "r") as f:
            return json.load(f)
    return CLASS_NAMES


def load_model():
    global _model, _labels, _mock_mode
    _labels = _load_labels()

    if not os.path.exists(settings.model_path):
        print(f"[ML] No trained model found at '{settings.model_path}'. Starting in MOCK MODE.")
        print("[ML] Run `python scripts/train.py` after adding a dataset to enable real predictions.")
        _mock_mode = True
        return

    import tensorflow as tf  # imported lazily so mock mode doesn't require TF loaded weights path issues
    print(f"[ML] Loading trained model from '{settings.model_path}'...")
    _model = tf.keras.models.load_model(settings.model_path)
    _mock_mode = False
    print("[ML] Model loaded successfully.")


def is_mock_mode() -> bool:
    return _mock_mode


def get_labels():
    return _labels or CLASS_NAMES


def predict(preprocessed_batch: np.ndarray) -> np.ndarray:
    """
    Returns a (1, num_classes) softmax probability array.
    In mock mode, derives a deterministic-but-varied distribution from
    basic image statistics so results feel realistic without a real model.
    """
    if _mock_mode:
        return _mock_predict(preprocessed_batch)

    return _model.predict(preprocessed_batch, verbose=0)


def _extract_visual_features(img_uint8: np.ndarray) -> dict:
    """
    Extracts interpretable visual features used to disambiguate visually
    similar conditions in mock mode:
    - small_blobs: count of small, discrete RED spots (inflamed pimples).
    - dark_spot_blobs: count of small, discrete DARK spots relative to
      local surroundings (blackheads/whiteheads/pores) — acne very often
      presents this way rather than as red blobs, especially in close-up
      nose/cheek photos, so relying on redness alone missed this case.
    - large_regions: count of larger connected irregular regions — higher
      for eczema/contact dermatitis/rosacea-type diffuse patches.
    - whitish_fraction: proportion of bright, low-saturation pixels —
      correlates with silvery/whitish scale (psoriasis) but also fires on
      ordinary oily-skin shine/glare, so it's only used jointly with other
      signals, never alone.
    - redness_mean / texture_roughness: as before.
    """
    hsv = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2HSV)
    gray = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2GRAY)

    img = img_uint8.astype(np.float32) / 255.0
    redness_map = np.clip(img[:, :, 0] - img[:, :, 1], 0, 1)
    redness_mean = float(np.mean(redness_map))

    redness_uint8 = (redness_map * 255).astype(np.uint8)
    _, thresh = cv2.threshold(redness_uint8, 35, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    areas = [cv2.contourArea(c) for c in contours]
    small_blobs = sum(1 for a in areas if 4 < a < 350)
    large_regions = sum(1 for a in areas if a >= 350)

    # Dark-spot detection (blackheads/whiteheads/pores): compare each pixel
    # to a heavily blurred version of itself so we catch small LOCAL dips
    # in brightness rather than overall skin tone, which varies a lot
    # across people/lighting.
    blurred = cv2.GaussianBlur(gray, (25, 25), 0)
    local_diff = cv2.subtract(blurred, gray)  # positive where pixel is darker than local average
    _, dark_thresh = cv2.threshold(local_diff, 18, 255, cv2.THRESH_BINARY)
    dark_contours, _ = cv2.findContours(dark_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    dark_areas = [cv2.contourArea(c) for c in dark_contours]
    dark_spot_blobs = sum(1 for a in dark_areas if 3 < a < 250)

    v_channel = hsv[:, :, 2]
    s_channel = hsv[:, :, 1]
    whitish_mask = (v_channel > 175) & (s_channel < 70)
    whitish_fraction = float(np.mean(whitish_mask))

    texture_roughness = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    return {
        "redness_mean": redness_mean,
        "small_blobs": small_blobs,
        "dark_spot_blobs": dark_spot_blobs,
        "large_regions": large_regions,
        "whitish_fraction": whitish_fraction,
        "texture_roughness": texture_roughness,
    }


def _mock_predict(batch: np.ndarray) -> np.ndarray:
    """
    Feature-based heuristic used only when no trained model is present.

    IMPORTANT DESIGN RULE: every condition below is gated behind a
    *combined* (AND) set of thresholds of comparable strictness. An
    earlier version gave psoriasis a score from loosely-gated signals
    (any "whitish" pixels, any texture roughness) while every other
    condition required multiple joint conditions — that imbalance made
    psoriasis win almost every prediction regardless of the actual image,
    since ordinary camera glare/highlights routinely satisfy loose
    single-signal checks. Every branch here now requires 2+ specific
    signals together, so no single condition has a structural advantage.
    """
    labels = get_labels()
    n = len(labels)
    img = batch[0]  # shape (H, W, 3), values in [0, 1]
    img_uint8 = (img * 255).astype(np.uint8)

    feat = _extract_visual_features(img_uint8)
    redness = feat["redness_mean"]
    small_blobs = feat["small_blobs"]
    dark_spot_blobs = feat["dark_spot_blobs"]
    large_regions = feat["large_regions"]
    whitish_fraction = feat["whitish_fraction"]
    texture_roughness = feat["texture_roughness"]

    brightness = float(np.mean(img))
    hsv = cv2.cvtColor(img_uint8, cv2.COLOR_RGB2HSV)
    saturation = float(np.mean(hsv[:, :, 1])) / 255.0
    color_std = float(np.std(img))

    seed = int(np.sum(img_uint8) % 100000)
    rng = np.random.default_rng(seed)

    scores = {label: 0.0 for label in labels}
    base_noise = rng.normal(loc=0, scale=0.15, size=n)
    for i, label in enumerate(labels):
        scores[label] = base_noise[i]

    def bump(label, amount):
        if label in scores:
            scores[label] += amount

    # --- Acne: several small discrete blobs — either reddish (inflamed
    #     pimples) or small dark spots relative to local skin (blackheads/
    #     whiteheads/enlarged pores), which is very common in real acne
    #     photos and was previously missed by looking at redness alone ---
    acne_blob_count = small_blobs + dark_spot_blobs
    if acne_blob_count >= 3:
        bump("acne", min(acne_blob_count * 0.35, 3.2) + redness * 2)

    # --- Psoriasis: BOTH a meaningful whitish/silvery scale fraction AND
    #     high texture roughness AND some redness at the base — all three
    #     together, not any single one. Explicitly dampened when the image
    #     instead shows an acne-like blackhead/pore pattern, since oily
    #     close-up skin photos can otherwise trigger the whitish/rough
    #     signals from shine and pore texture alone. ---
    if whitish_fraction > 0.10 and texture_roughness > 15 and redness > 0.015:
        psoriasis_signal = whitish_fraction * 3 + min(texture_roughness / 30, 1.5) + redness * 1.5
        if acne_blob_count >= 3:
            psoriasis_signal *= 0.2  # looks more like acne (pores/blackheads) than scale
        bump("psoriasis", psoriasis_signal)

    # --- Fungal infection: rough texture AND few/no small blobs AND low
    #     whitish scale (distinguishes from psoriasis) ---
    if texture_roughness > 18 and acne_blob_count < 2 and whitish_fraction < 0.06:
        bump("fungal_infection", min(texture_roughness / 25, 2.0))

    # --- Diffuse redness without many small blobs -> eczema / rosacea /
    #     contact dermatitis / urticaria family ---
    if redness > 0.05 and acne_blob_count < 3:
        bump("eczema", redness * 5 + large_regions * 0.3)
        bump("rosacea", redness * 4 + large_regions * 0.2)
        bump("contact_dermatitis", redness * 4 + large_regions * 0.25)
        bump("urticaria", redness * 3 + large_regions * 0.3)

    # --- Seborrheic dermatitis: moderate texture AND oily brightness AND
    #     low whitish scale AND not much redness ---
    if 5 < texture_roughness < 18 and brightness > 0.52 and whitish_fraction < 0.08 and redness < 0.03:
        bump("seborrheic_dermatitis", 1.2)

    # --- Wart: high roughness AND just 1-2 isolated blobs ---
    if texture_roughness > 20 and 0 < acne_blob_count <= 2:
        bump("wart", min(texture_roughness / 20, 2.0))

    # --- Smooth, uniform, low-variance patch AND no blobs -> mole-like ---
    if color_std < 0.10 and texture_roughness < 6 and acne_blob_count == 0 and redness < 0.02:
        bump("melanocytic_nevus", 2.2)

    # --- Pale, low-saturation, unremarkable patch AND no redness -> vitiligo ---
    if saturation < 0.20 and brightness > 0.55 and redness < 0.015 and texture_roughness < 8:
        bump("vitiligo", 1.8)

    # --- Very plain/uniform + bright + no blobs/roughness/redness -> healthy ---
    if brightness > 0.55 and color_std < 0.09 and texture_roughness < 5 and acne_blob_count == 0 and redness < 0.015:
        bump("healthy", 2.0)

    logits = np.array([scores[label] for label in labels])
    exp = np.exp(logits - np.max(logits))
    probs = exp / exp.sum()
    return np.expand_dims(probs, axis=0)
