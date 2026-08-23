# Model directory

Place your trained model here as `netguard_model.joblib` (produced by
`training/train.py`). The prediction service (`prediction/predict.py`)
automatically loads it if present; otherwise it falls back to a
clearly-labeled rule-based mock so the API keeps working during a demo.

Suggested datasets for a college project:
- NSL-KDD
- CICIDS2017
- UNSW-NB15

`metrics.json` (also written by the training script) holds the real
accuracy/precision/recall/F1 for whatever model you train — use those
values (not the demo defaults) once you have a trained model.
