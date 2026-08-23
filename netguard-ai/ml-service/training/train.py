"""
train.py
------------------------------------------------------------------------------
Reference training script for a real intrusion-detection classifier.

This is intentionally simple and well-commented so it's easy to swap in a
real labeled dataset (e.g. NSL-KDD, CICIDS2017) for a college project.

Usage:
    python training/train.py --data path/to/dataset.csv

Expected CSV columns (rename/adjust to match your dataset):
    protocol, packetSize, duration, sourceBytes, destinationBytes,
    connectionCount, port, label   (label in {NORMAL, SUSPICIOUS, ATTACK})

Produces:
    model/netguard_model.joblib   -- trained sklearn model
    model/metrics.json            -- evaluation metrics on a held-out split
------------------------------------------------------------------------------
"""
import argparse
import json
import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

PROTOCOL_MAP = {"TCP": 0, "UDP": 1, "ICMP": 2, "HTTP": 3, "HTTPS": 4, "DNS": 5, "SSH": 6}
LABEL_MAP = {"NORMAL": 0, "SUSPICIOUS": 1, "ATTACK": 2}

FEATURE_COLUMNS = ["protocol_encoded", "packetSize", "duration", "sourceBytes", "destinationBytes", "connectionCount", "port"]


def load_dataset(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df["protocol_encoded"] = df["protocol"].map(PROTOCOL_MAP).fillna(0)
    df["label_encoded"] = df["label"].map(LABEL_MAP)
    return df


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Path to labeled CSV dataset")
    args = parser.parse_args()

    df = load_dataset(args.data)
    X = df[FEATURE_COLUMNS]
    y = df["label_encoded"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, class_weight="balanced")
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "model": "Random Forest Classifier",
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred, average="macro"), 4),
        "recall": round(recall_score(y_test, y_pred, average="macro"), 4),
        "f1Score": round(f1_score(y_test, y_pred, average="macro"), 4),
        "demo": False,
    }

    out_dir = os.path.join(os.path.dirname(__file__), "..", "model")
    os.makedirs(out_dir, exist_ok=True)
    joblib.dump(model, os.path.join(out_dir, "netguard_model.joblib"))
    with open(os.path.join(out_dir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print("Training complete. Metrics:", metrics)


if __name__ == "__main__":
    main()
