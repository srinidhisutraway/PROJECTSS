import time
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.core import model_loader
from app.core.config import settings
from app.core.knowledge_base import CONDITIONS
from app.core.preprocessing import (
    preprocess_for_inference,
    estimate_hydration_metrics,
    image_to_grayscale_base64,
    generate_highlighted_regions_image,
)
from app.core.severity import estimate_severity, estimate_consultation_urgency
from app.schemas.prediction import PredictionResponse, HealthResponse

router = APIRouter()

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        mockMode=model_loader.is_mock_mode(),
        labels=model_loader.get_labels(),
    )


@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Please upload a JPEG, PNG, or WEBP image.")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image is too large (max 10MB).")

    start = time.time()

    try:
        batch = preprocess_for_inference(image_bytes, target_size=settings.image_size)
        probabilities = model_loader.predict(batch)[0]
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Could not process image: {exc}") from exc

    labels = model_loader.get_labels()
    ranked = sorted(zip(labels, probabilities), key=lambda x: x[1], reverse=True)

    predictions = [
        {
            "condition": cond,
            "label": CONDITIONS.get(cond, {}).get("label", cond.replace("_", " ").title()),
            "confidence": round(float(conf), 4),
        }
        for cond, conf in ranked
        if conf >= settings.confidence_threshold
    ]
    if not predictions:
        # Always surface at least the top prediction even below threshold
        top_cond, top_conf = ranked[0]
        predictions = [
            {
                "condition": top_cond,
                "label": CONDITIONS.get(top_cond, {}).get("label", top_cond),
                "confidence": round(float(top_conf), 4),
            }
        ]

    top = predictions[0]
    top_condition = top["condition"]
    kb_entry = CONDITIONS.get(top_condition, CONDITIONS["healthy"])

    hydration = estimate_hydration_metrics(image_bytes)
    severity = estimate_severity(top["confidence"], hydration["rednessScore"], top_condition)
    urgency = estimate_consultation_urgency(severity, top_condition)

    grayscale_image = image_to_grayscale_base64(image_bytes)
    highlighted_image, key_indicators = generate_highlighted_regions_image(image_bytes)

    inference_time_ms = (time.time() - start) * 1000

    return PredictionResponse(
        predictions=predictions,
        topCondition=top_condition,
        topLabel=kb_entry["label"],
        topConfidence=top["confidence"],
        severity=severity,
        explanation=kb_entry["explanation"],
        possibleCauses=kb_entry["possible_causes"],
        symptoms=kb_entry["symptoms"],
        precautions=kb_entry["precautions"],
        recommendedRoutine=kb_entry["recommended_routine"],
        dos=kb_entry["dos"],
        donts=kb_entry["donts"],
        consultationUrgency=urgency,
        faqs=kb_entry["faqs"],
        hydrationAnalysis=hydration,
        modelVersion="mock-v0" if model_loader.is_mock_mode() else "v1",
        inferenceTimeMs=round(inference_time_ms, 1),
        mockMode=model_loader.is_mock_mode(),
        grayscaleImage=grayscale_image,
        highlightedImage=highlighted_image,
        keyIndicators=key_indicators,
    )
