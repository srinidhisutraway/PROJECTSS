"""
Estimates a coarse severity band (mild/moderate/severe) from the model's
confidence and supplementary redness signal. This is a simplified,
transparent heuristic — NOT a clinical severity score — and is always
presented to the user alongside a confidence percentage rather than as a
certain diagnosis.
"""


def estimate_severity(top_confidence: float, redness_score: float, condition: str) -> str:
    if condition == "healthy":
        return "mild"

    # Blend model confidence with the redness heuristic — higher confidence
    # + higher visible redness/inflammation nudges toward higher severity.
    combined = (top_confidence * 100 * 0.7) + (redness_score * 0.3)

    if combined >= 70:
        return "severe"
    if combined >= 40:
        return "moderate"
    return "mild"


def estimate_consultation_urgency(severity: str, condition: str) -> str:
    if condition == "melanocytic_nevus" and severity in ("moderate", "severe"):
        return "urgent"  # changing/irregular moles warrant prompt evaluation
    if severity == "severe":
        return "urgent"
    if severity == "moderate":
        return "soon"
    return "routine"
