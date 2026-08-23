"""
Modular image preprocessing shared by both the training pipeline and the
inference API. Keeping this in one place guarantees train/serve parity —
a common source of silent accuracy bugs in ML projects.
"""
import numpy as np
import cv2
from PIL import Image
import io
import base64


def load_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    """Decode raw uploaded bytes into an RGB numpy array."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return np.array(image)


def resize_and_normalize(image: np.ndarray, target_size: int = 224) -> np.ndarray:
    """Resize to a square target size and scale pixel values to [0, 1]."""
    resized = cv2.resize(image, (target_size, target_size), interpolation=cv2.INTER_AREA)
    normalized = resized.astype(np.float32) / 255.0
    return normalized


def preprocess_for_inference(image_bytes: bytes, target_size: int = 224) -> np.ndarray:
    """Full pipeline: bytes -> batched, normalized tensor ready for model.predict()."""
    image = load_image_from_bytes(image_bytes)
    processed = resize_and_normalize(image, target_size)
    return np.expand_dims(processed, axis=0)  # add batch dimension


def estimate_hydration_metrics(image_bytes: bytes) -> dict:
    """
    Lightweight, non-ML heuristic estimate of skin surface characteristics
    (hydration/oiliness/texture/redness/dryness) from color and texture
    statistics. This is a supplementary estimate, not a clinical
    measurement, and is clearly presented as such to the user.
    """
    image = load_image_from_bytes(image_bytes)
    resized = cv2.resize(image, (256, 256))
    hsv = cv2.cvtColor(resized, cv2.COLOR_RGB2HSV)
    gray = cv2.cvtColor(resized, cv2.COLOR_RGB2GRAY)

    saturation_mean = float(np.mean(hsv[:, :, 1]))
    value_mean = float(np.mean(hsv[:, :, 2]))  # brightness -> proxy for shine/oiliness
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())  # texture roughness

    r_channel = resized[:, :, 0].astype(np.float32)
    g_channel = resized[:, :, 1].astype(np.float32)
    redness_index = float(np.mean(np.clip(r_channel - g_channel, 0, 255)))

    def clamp(value, lo=0, hi=100):
        return max(lo, min(hi, value))

    oiliness = clamp((value_mean / 255.0) * 100)
    dryness = clamp(100 - (saturation_mean / 255.0) * 100)
    hydration_level = clamp(100 - dryness * 0.8)
    texture_score = clamp(100 - min(laplacian_var / 5.0, 100))  # lower variance = smoother
    redness_score = clamp((redness_index / 60.0) * 100)

    if hydration_level < 40:
        recommendation = "Your skin shows signs of dryness — consider a richer, ceramide-based moisturizer and reduce hot water exposure."
    elif oiliness > 65:
        recommendation = "Your skin shows signs of excess oil — a lightweight, oil-free gel moisturizer may help balance shine."
    else:
        recommendation = "Your skin's hydration and oil balance look fairly even — maintain your current routine and stay consistent with SPF."

    return {
        "hydrationLevel": round(hydration_level, 1),
        "oiliness": round(oiliness, 1),
        "textureScore": round(texture_score, 1),
        "rednessScore": round(redness_score, 1),
        "drynessScore": round(dryness, 1),
        "recommendation": recommendation,
    }


def image_to_grayscale_base64(image_bytes: bytes) -> str:
    """
    Converts the uploaded image to grayscale and returns it as a base64
    PNG data URI. Shown to the user as an intermediate preprocessing step
    for transparency into how the model "sees" the image — texture and
    structure analysis relies heavily on grayscale/luminance data.
    """
    image = load_image_from_bytes(image_bytes)
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    gray_rgb = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)
    success, buffer = cv2.imencode(".png", cv2.cvtColor(gray_rgb, cv2.COLOR_RGB2BGR))
    if not success:
        return ""
    return "data:image/png;base64," + base64.b64encode(buffer).decode("utf-8")


def generate_highlighted_regions_image(image_bytes: bytes):
    """
    Draws visual markers over the specific regions that most influenced
    the analysis — small red/dark spots (possible acne/blemishes/pigment)
    and larger irregular patches (possible inflammation/rash/scale) —
    using plain, inspectable OpenCV contour detection. Returns
    (base64_png_data_uri, key_indicators: list[str]) — a transparent,
    checkable basis for "what made this look diseased" rather than an
    opaque black-box claim. This is NOT a Grad-CAM/model-gradient
    explanation (that would require deep coupling to a specific trained
    model's internal layers and is much more fragile to maintain); it is
    a feature-based visual explanation using the same signal categories
    the analysis itself is grounded in.
    """
    image = load_image_from_bytes(image_bytes)  # RGB
    display = image.copy()

    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    img_float = image.astype(np.float32) / 255.0

    redness_map = np.clip(img_float[:, :, 0] - img_float[:, :, 1], 0, 1)
    redness_uint8 = (redness_map * 255).astype(np.uint8)
    _, red_thresh = cv2.threshold(redness_uint8, 35, 255, cv2.THRESH_BINARY)
    red_contours, _ = cv2.findContours(red_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    blurred = cv2.GaussianBlur(gray, (25, 25), 0)
    local_diff = cv2.subtract(blurred, gray)
    _, dark_thresh = cv2.threshold(local_diff, 18, 255, cv2.THRESH_BINARY)
    dark_contours, _ = cv2.findContours(dark_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    key_indicators = []
    redness_mean = float(np.mean(redness_map))
    texture_roughness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    v_channel = hsv[:, :, 2]
    s_channel = hsv[:, :, 1]
    whitish_fraction = float(np.mean((v_channel > 175) & (s_channel < 70)))

    red_spots_drawn = 0
    for c in red_contours:
        area = cv2.contourArea(c)
        if area > 500:
            cv2.drawContours(display, [c], -1, (255, 80, 80), 2)
        elif 4 < area < 500:
            (x, y), radius = cv2.minEnclosingCircle(c)
            cv2.circle(display, (int(x), int(y)), max(int(radius) + 2, 4), (255, 60, 60), 2)
            red_spots_drawn += 1

    dark_spots_drawn = 0
    for c in dark_contours:
        area = cv2.contourArea(c)
        if 3 < area < 250:
            (x, y), radius = cv2.minEnclosingCircle(c)
            cv2.circle(display, (int(x), int(y)), max(int(radius) + 2, 4), (255, 200, 0), 2)
            dark_spots_drawn += 1

    if redness_mean > 0.04:
        key_indicators.append(
            f"Elevated redness detected across the image (redness score {redness_mean * 100:.0f}/100) — "
            "circled in red below, this often points toward inflammation-type conditions."
        )
    if red_spots_drawn > 0:
        key_indicators.append(
            f"{red_spots_drawn} small red spot(s) detected — circled in red, consistent with inflamed "
            "pimples or localized irritation."
        )
    if dark_spots_drawn > 0:
        key_indicators.append(
            f"{dark_spots_drawn} small dark spot(s) detected relative to surrounding skin — circled in "
            "yellow, consistent with blackheads, clogged pores, or pigmented spots."
        )
    if texture_roughness > 15:
        key_indicators.append(
            f"Rough/uneven surface texture detected (roughness score {min(texture_roughness, 100):.0f}/100) "
            "— often associated with scaling, flaking, or raised patches."
        )
    if whitish_fraction > 0.10:
        key_indicators.append(
            f"A notable whitish/light-toned surface area was detected ({whitish_fraction * 100:.0f}% of the "
            "image) — can indicate scale, dryness, or reduced pigmentation depending on context."
        )
    if not key_indicators:
        key_indicators.append(
            "No strong redness, texture, or spot signals were detected — the image appeared relatively "
            "smooth and even-toned."
        )

    success, buffer = cv2.imencode(".png", cv2.cvtColor(display, cv2.COLOR_RGB2BGR))
    overlay_data_uri = "data:image/png;base64," + base64.b64encode(buffer).decode("utf-8") if success else ""
    return overlay_data_uri, key_indicators
