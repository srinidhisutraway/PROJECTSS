"""
feature_extractor.py
------------------------------------------------------------------------------
Converts a raw incoming request payload (network flow features from the
backend) into the fixed-order numeric feature vector the model expects.

Expected input keys (all optional -> sensible defaults applied):
  protocol, packetSize, duration, sourceBytes, destinationBytes,
  connectionCount, port
------------------------------------------------------------------------------
"""

PROTOCOL_MAP = {"TCP": 0, "UDP": 1, "ICMP": 2, "HTTP": 3, "HTTPS": 4, "DNS": 5, "SSH": 6}


def extract_features(payload: dict) -> dict:
    protocol = str(payload.get("protocol", "TCP")).upper()
    return {
        "protocol": protocol,
        "protocol_encoded": PROTOCOL_MAP.get(protocol, 0),
        "packetSize": float(payload.get("packetSize", 512)),
        "duration": float(payload.get("duration", 1.0)),
        "sourceBytes": float(payload.get("sourceBytes", 800)),
        "destinationBytes": float(payload.get("destinationBytes", 400)),
        "connectionCount": float(payload.get("connectionCount", 1)),
        "port": int(payload.get("port", payload.get("destinationPort", 443))),
    }


def to_vector(features: dict):
    """Ordered numeric vector for the trained model."""
    return [
        features["protocol_encoded"],
        features["packetSize"],
        features["duration"],
        features["sourceBytes"],
        features["destinationBytes"],
        features["connectionCount"],
        features["port"],
    ]
