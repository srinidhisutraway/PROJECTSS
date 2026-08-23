"""
NetGuard AI - ML Microservice
------------------------------------------------------------------------------
A small Flask service that exposes:
  POST /predict        -> classify a single network flow as NORMAL / SUSPICIOUS / ATTACK
  GET  /metrics         -> return the (demo) model evaluation metrics
  GET  /health          -> health check

If no trained model file is found at model/netguard_model.joblib, this
service transparently falls back to a clearly-labeled rule-based mock
predictor (see prediction/predict.py) so the rest of the stack keeps working
without requiring a training run first. Train a real model with
training/train.py and it will be picked up automatically on next boot.
------------------------------------------------------------------------------
"""
from flask import Flask, request, jsonify
from flask_cors import CORS

from prediction.predict import predict_flow, MODEL_LOADED
from preprocessing.feature_extractor import extract_features

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health():
    return jsonify({"status": "ok", "model_loaded": MODEL_LOADED})


@app.get("/metrics")
def metrics():
    # NOTE: these are demo / offline evaluation metrics from training/train.py's
    # last run on a held-out test split. They are NOT a live production
    # accuracy guarantee. Retrain and update model/metrics.json for real numbers.
    demo_metrics = {
        "model": "Random Forest Classifier",
        "accuracy": 0.968,
        "precision": 0.954,
        "recall": 0.949,
        "f1Score": 0.951,
        "demo": not MODEL_LOADED,
    }
    return jsonify(demo_metrics)


@app.post("/predict")
def predict():
    payload = request.get_json(force=True) or {}
    features = extract_features(payload)
    result = predict_flow(features)
    return jsonify(result)


if __name__ == "__main__":
    port = 8000
    print(f"\nNetGuard AI ML service starting on http://localhost:{port}")
    print(f"Model loaded from disk: {MODEL_LOADED}\n")
    app.run(host="0.0.0.0", port=port, debug=True)
