from pydantic import BaseModel
from typing import List, Optional


class PredictionItem(BaseModel):
    condition: str
    label: str
    confidence: float


class FAQItem(BaseModel):
    question: str
    answer: str


class HydrationMetrics(BaseModel):
    hydrationLevel: float
    oiliness: float
    textureScore: float
    rednessScore: float
    drynessScore: float
    recommendation: str


class PredictionResponse(BaseModel):
    predictions: List[PredictionItem]
    topCondition: str
    topLabel: str
    topConfidence: float
    severity: str
    explanation: str
    possibleCauses: List[str]
    symptoms: List[str]
    precautions: List[str]
    recommendedRoutine: List[str]
    dos: List[str]
    donts: List[str]
    consultationUrgency: str
    faqs: List[FAQItem]
    hydrationAnalysis: HydrationMetrics
    modelVersion: str
    inferenceTimeMs: float
    mockMode: bool
    grayscaleImage: str
    highlightedImage: str
    keyIndicators: List[str]


class HealthResponse(BaseModel):
    status: str
    mockMode: bool
    labels: List[str]
