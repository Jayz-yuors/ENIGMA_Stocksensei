import os
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
import shap

ROOT = Path(__file__).parent
MODEL_PATH = ROOT / "artifacts" / "paysim" / "model.joblib"

_BUNDLE = None
_EXPLAINER = None

def get_paysim_bundle():
    global _BUNDLE, _EXPLAINER
    if _BUNDLE is None:
        _BUNDLE = joblib.load(MODEL_PATH)
        _EXPLAINER = shap.TreeExplainer(_BUNDLE["model"])
    return _BUNDLE, _EXPLAINER

def _finite_number(payload, name, minimum=None):
    if name not in payload:
        raise ValueError(f"Missing required field: {name}")
    try:
        value = float(payload[name])
    except (TypeError, ValueError):
        raise ValueError(f"{name} must be numeric") from None
    if not np.isfinite(value):
        raise ValueError(f"{name} must be finite")
    if minimum is not None and value < minimum:
        raise ValueError(f"{name} must be at least {minimum}")
    return value


def assess_transaction(payload: dict) -> dict:
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(f"PaySim model is missing: {MODEL_PATH.relative_to(ROOT)}")

    required = ["step", "type", "amount", "oldbalanceOrg", "oldbalanceDest"]
    missing = [name for name in required if name not in payload]
    if missing:
        raise ValueError(f"Missing PaySim transaction inputs: {', '.join(missing)}")

    step = int(_finite_number(payload, "step", minimum=1))
    tx_type = str(payload["type"]).strip().upper()
    valid_types = {"CASH_IN", "CASH_OUT", "DEBIT", "PAYMENT", "TRANSFER"}
    if tx_type not in valid_types:
        raise ValueError(f"Invalid transaction type '{tx_type}'. Must be one of: {', '.join(sorted(valid_types))}")

    amount = _finite_number(payload, "amount", minimum=0.0)
    oldbalance_org = _finite_number(payload, "oldbalanceOrg", minimum=0.0)
    oldbalance_dest = _finite_number(payload, "oldbalanceDest", minimum=0.0)

    drain_ratio = (amount / oldbalance_org) if oldbalance_org > 0 else 0.0
    is_dest_zero = 1 if oldbalance_dest == 0 else 0

    features = pd.DataFrame([{
        "step": step,
        "amount": amount,
        "oldbalanceOrg": oldbalance_org,
        "oldbalanceDest": oldbalance_dest,
        "drain_ratio": drain_ratio,
        "is_dest_zero": is_dest_zero,
        f"type_{tx_type}": 1,
    }])

    bundle, explainer = get_paysim_bundle()
    encoded = features.reindex(columns=bundle["feature_columns"], fill_value=0)
    encoded = encoded.replace([np.inf, -np.inf], np.nan).fillna(0)

    raw = float(bundle["model"].predict_proba(encoded)[0, 1])
    if bundle.get("calibrator") is not None:
        clipped = float(np.clip(raw, 1e-6, 1 - 1e-6))
        raw = float(bundle["calibrator"].predict_proba([[np.log(clipped / (1 - clipped))]])[0, 1])

    threshold = float(bundle.get("decision_threshold", 0.40))

    anomaly_score = None
    if bundle.get("anomaly_model") is not None and bundle.get("anomaly_reference_scores") is not None:
        score = float(bundle["anomaly_model"].decision_function(encoded)[0])
        reference = np.asarray(bundle["anomaly_reference_scores"])
        anomaly_score = float(1.0 - np.searchsorted(reference, score, side="right") / len(reference))

    # SHAP explanations
    shap_values = explainer(encoded)
    values = np.asarray(shap_values.values)
    impacts = values[0, :, -1] if values.ndim == 3 else values[0]
    top_indices = np.argsort(np.abs(impacts))[::-1][:5]
    names = list(bundle["feature_columns"])
    factors = [
        {
            "feature": names[int(i)],
            "impact_log_odds": float(impacts[i]),
            "direction": "increases_risk" if impacts[i] > 0 else "decreases_risk",
        }
        for i in top_indices
    ]

    return {
        "transaction_id": payload.get("transaction_id", f"TX-PAYSIM-{step}-{int(amount)}"),
        "model": {"name": "PaySim Federated Fraud Risk Model", "artifact": "artifacts/paysim/model.joblib"},
        "risk": {
            "fraud_probability": round(raw, 4),
            "risk_score": round(raw * 100, 2),
            "decision_threshold": threshold,
            "classification": "fraud" if raw >= threshold else "safe",
            "anomaly_score": round(anomaly_score, 4) if anomaly_score is not None else None,
        },
        "risk_factors": factors,
        "interpretation": (
            "PaySim model screening result, not confirmed fraud. Anomaly score measures unusualness "
            "relative to baseline peer transactions, not definitive fraud."
        ),
    }
