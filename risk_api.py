"""Central backend: UI input -> saved ML model -> Gemini/local explanation -> UI.

Run with: uvicorn risk_api:app --reload

The browser must call this backend. Keep GEMINI_API_Key in the server .env,
never in frontend JavaScript. ML output remains authoritative; Gemini explains it.
"""

import json
import os
from pathlib import Path
from typing import Any, Literal

import joblib
import numpy as np
import pandas as pd
import requests
import shap
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from predict_paysim import assess_transaction


ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

MODEL_PATHS = {
    "banks": ROOT / "artifacts" / "paysim" / "model.joblib",
    "lenders": ROOT / "artifacts" / "lenders" / "model.joblib",
    "insurers": ROOT / "artifacts" / "insurance" / "model.joblib",
}

GEMINI_MODEL_PREFERENCE = [
    # These models passed the user's latest generateContent probe.
    "gemini-3.7-flash", "gemini-3.6-flash", "gemini-3.5-flash",
    "gemini-3.5-flash-lite", "gemini-flash-latest", "gemini-flash-lite-latest",
    "gemini-3.1-flash-lite", "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview", "gemini-2.5-flash",
]
_GEMINI_MODELS_CACHE = None

app = FastAPI(title="ENIGMA Risk Inference API", version="1.0.0")
origins = [value.strip() for value in os.getenv(
    "FRONTEND_ORIGINS", "http://localhost:3000,http://localhost:5173"
).split(",") if value.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class AssessRequest(BaseModel):
    domain: Literal["banks", "lenders", "insurers"]
    user_input: dict[str, Any] = Field(..., description="Input values for that domain's trained model")
    include_ai_reasoning: bool = True


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


def _insurance_assessment(payload):
    path = MODEL_PATHS["insurers"]
    if not path.is_file():
        raise FileNotFoundError("Insurance model is not trained yet; expected artifacts/insurance/model.joblib")
    required = ["claim_type", "state", "policyholder_tenure_years", "previous_claims_count",
                "incident_date", "claim_filed_date", "claim_amount", "deductible"]
    missing = [name for name in required if name not in payload]
    if missing:
        raise ValueError(f"Missing insurance inputs: {', '.join(missing)}")
    for field in ["claim_type", "state"]:
        if not isinstance(payload[field], str) or not payload[field].strip():
            raise ValueError(f"{field} must be a non-empty string")

    tenure = _finite_number(payload, "policyholder_tenure_years", 0)
    previous = _finite_number(payload, "previous_claims_count", 0)
    amount = _finite_number(payload, "claim_amount", 0)
    deductible = _finite_number(payload, "deductible", 0)
    incident = pd.to_datetime(payload["incident_date"], errors="coerce")
    filed = pd.to_datetime(payload["claim_filed_date"], errors="coerce")
    if pd.isna(incident) or pd.isna(filed):
        raise ValueError("incident_date and claim_filed_date must be valid dates")

    features = pd.DataFrame([{
        "claim_type": str(payload["claim_type"]).strip(),
        "state": str(payload["state"]).strip(),
        "policyholder_tenure_years": tenure,
        "previous_claims_count": previous,
        "claim_amount": amount,
        "deductible": deductible,
        "filing_delay_days": int((filed - incident).days),
        "claim_to_deductible_ratio": amount / (deductible + 1.0),
        "claim_amount_log": float(np.log1p(amount)),
    }])
    bundle = joblib.load(path)
    categories = list(features.select_dtypes(include=["object"]).columns)
    encoded = pd.get_dummies(features, columns=categories, dummy_na=True, dtype=np.uint8)
    encoded = encoded.reindex(columns=bundle["feature_columns"], fill_value=0)
    encoded = encoded.replace([np.inf, -np.inf], np.nan).fillna(0)

    raw = float(bundle["model"].predict_proba(encoded)[0, 1])
    if bundle.get("calibrator") is not None:
        clipped = float(np.clip(raw, 1e-6, 1 - 1e-6))
        raw = float(bundle["calibrator"].predict_proba([[np.log(clipped / (1 - clipped))]])[0, 1])
    threshold = float(bundle.get("decision_threshold", 0.5))
    anomaly_score = None
    if bundle.get("anomaly_model") is not None and bundle.get("anomaly_reference_scores") is not None:
        score = float(bundle["anomaly_model"].decision_function(encoded)[0])
        reference = np.asarray(bundle["anomaly_reference_scores"])
        anomaly_score = float(1.0 - np.searchsorted(reference, score, side="right") / len(reference))

    shap_values = shap.TreeExplainer(bundle["model"])(encoded)
    values = np.asarray(shap_values.values)
    impacts = values[0, :, -1] if values.ndim == 3 else values[0]
    top_indices = np.argsort(np.abs(impacts))[::-1][:5]
    names = list(bundle["feature_columns"])
    factors = [{"feature": names[int(i)], "impact_log_odds": float(impacts[i]),
                "direction": "increases_risk" if impacts[i] > 0 else "decreases_risk"}
               for i in top_indices]
    return {
        "claim_id": payload.get("claim_id"),
        "model": {"name": "Insurance Claims Risk Model", "artifact": "artifacts/insurance/model.joblib"},
        "risk": {"fraud_probability": raw, "risk_score": round(raw * 100, 6),
                 "decision_threshold": threshold,
                 "classification": "fraud" if raw >= threshold else "safe",
                 "anomaly_score": anomaly_score},
        "risk_factors": factors,
        "interpretation": "Model screening result, not confirmed fraud. Anomaly score is unusualness, not fraud probability.",
    }


def run_ml(domain, user_input):
    if domain == "banks":
        if not MODEL_PATHS[domain].is_file():
            raise FileNotFoundError("PaySim model is missing: artifacts/paysim/model.joblib")
        return assess_transaction(user_input)
    if domain == "insurers":
        return _insurance_assessment(user_input)
    if not MODEL_PATHS["lenders"].is_file():
        raise FileNotFoundError(
            "Lender model is not available yet. Add a trained model at artifacts/lenders/model.joblib "
            "and its input adapter before enabling the Lenders tab."
        )
    raise NotImplementedError("Lender model artifact exists, but its feature/input adapter is not configured yet")


def local_reasoning(domain, ml_json):
    risk = ml_json.get("risk", {})
    probability = risk.get("fraud_probability")
    decision = risk.get("classification", "unavailable")
    threshold = risk.get("decision_threshold")
    factors = ml_json.get("risk_factors", [])
    factor_text = ", ".join(
        f"{factor.get('feature')} {factor.get('direction', 'affects risk')} (SHAP {factor.get('impact_log_odds', factor.get('shap_log_odds_impact', 'n/a'))})"
        for factor in factors[:3]
    ) or "No feature explanation was returned by the model."
    anomaly = risk.get("anomaly_score")
    anomaly_text = (f" Anomaly score: {anomaly:.3f}; this is a separate unusualness signal, not a fraud probability or confirmation."
                    if isinstance(anomaly, (float, int)) else "")
    score_text = (f" Calibrated model score: {probability:.2%}; decision cutoff: {threshold:.4%}."
                  if isinstance(probability, (float, int)) and isinstance(threshold, (float, int)) else "")
    if decision == "fraud":
        guidance = "Suggested next step: route for human review and verify transaction/claim evidence and input data before action."
    else:
        guidance = "Suggested next step: continue normal controls; this below-cutoff result does not rule out fraud or replace routine monitoring."
    return {
        "source": "local_fallback",
        "text": (f"{domain.title()} screening: {decision}.{score_text} The strongest model contributors were {factor_text}."
                 f"{anomaly_text} {guidance} The model was trained on synthetic data; treat this as decision support, not a confirmed finding."),
    }


def discover_gemini_models(api_key):
    """Get this key's generateContent models once; never log or return the key."""
    global _GEMINI_MODELS_CACHE
    if _GEMINI_MODELS_CACHE is not None:
        return _GEMINI_MODELS_CACHE
    try:
        response = requests.get(
            "https://generativelanguage.googleapis.com/v1beta/models",
            headers={"x-goog-api-key": api_key},
            timeout=15,
        )
        response.raise_for_status()
        models = response.json().get("models", [])
        blocked = ["image", "tts", "transcribe", "robotics", "computer-use", "customtools"]
        available = {
            item.get("name", "").removeprefix("models/")
            for item in models
            if "generateContent" in item.get("supportedGenerationMethods", [])
            and "gemini" in item.get("name", "").lower()
            and not any(term in item.get("name", "").lower() for term in blocked)
        }
        _GEMINI_MODELS_CACHE = available
        return available
    except (requests.RequestException, ValueError, KeyError):
        # Use the static fallback list if discovery itself is unavailable.
        return set()


def gemini_model_order(api_key):
    configured = os.getenv("GEMINI_MODEL", "gemini-3.7-flash").strip()
    configured_fallbacks = [name.strip() for name in
                            os.getenv("GEMINI_FALLBACK_MODELS", "").split(",") if name.strip()]
    available = discover_gemini_models(api_key)
    # Restrict automatic discovery to the models already proven to respond.
    # Merely being listed by the API does not mean a model is usable for this key.
    discovered_order = [name for name in GEMINI_MODEL_PREFERENCE if name in available]
    # Prefer an explicitly configured default, then explicit fallbacks, then
    # other text generation models returned for this API key.
    ordered = [configured, *configured_fallbacks, *discovered_order]
    deduplicated = list(dict.fromkeys(name for name in ordered if name))
    return [name for name in deduplicated if not available or name in available]


def gemini_reasoning(domain, ml_json):
    api_key = os.getenv("GEMINI_API_Key")
    if not api_key:
        return local_reasoning(domain, ml_json)

    # Do not forward optional record identifiers or local artifact paths to
    # the external explanation API; only send the risk assessment content.
    explanation_json = dict(ml_json)
    for identifier in ["transaction_id", "claim_id"]:
        explanation_json.pop(identifier, None)
    if isinstance(explanation_json.get("model"), dict):
        explanation_json["model"] = {
            key: value for key, value in explanation_json["model"].items()
            if key != "artifact"
        }
    prompt = (
        "You are the explanation layer for a financial risk screening system. Write a concise, specific explanation "
        "with these labeled sections: Result, Evidence, Anomaly signal, Suggested checks, Limitations. "
        "Explain whether the score is above or below the supplied decision threshold and give the supplied values exactly. "
        "Use the top SHAP features as contributors to the model score, not as causes or proof. Explain anomaly_score "
        "separately; it measures unusualness and is not a fraud probability. For a below-threshold result, say it is "
        "lower model risk, not guaranteed safe. For an above-threshold result, recommend human review and evidence "
        "verification. Suggest concrete checks relevant to the domain (transaction records/authentication for Banks; "
        "claim documents/incident facts for Insurers; repayment and affordability records for Lenders). "
        "Never recommend an automatic denial, rejection, account freeze, or other adverse action. "
        "Do not invent facts, thresholds, confidence, or numbers. State that these models use synthetic training data "
        "and require human review. Use only the supplied assessment.\n\n"
        f"Domain: {domain}\nML assessment JSON:\n{json.dumps(explanation_json, ensure_ascii=False)}"
    )
    failures = []
    for model_name in gemini_model_order(api_key):
        endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
        try:
            response = requests.post(
                endpoint,
                headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": prompt}]}],
                      "generationConfig": {"temperature": 0.2, "maxOutputTokens": 500}},
                timeout=15,
            )
            if response.status_code in (401, 403):
                failures.append({"model": model_name, "reason": f"HTTP {response.status_code}; key/authentication rejected"})
                break
            response.raise_for_status()
            body = response.json()
            text = "".join(part.get("text", "") for part in
                           body["candidates"][0]["content"].get("parts", []))
            if not text.strip():
                raise ValueError("empty response")
            return {"source": "gemini", "model": model_name, "text": text.strip(),
                    "fallback_models_tried": failures}
        except Exception as exc:
            status = getattr(getattr(exc, "response", None), "status_code", None)
            failures.append({"model": model_name,
                             "reason": f"HTTP {status}" if status else type(exc).__name__})

    fallback = local_reasoning(domain, ml_json)
    fallback["fallback_reason"] = "All configured/discovered Gemini models failed; using local explanation."
    fallback["gemini_attempts"] = failures
    return fallback


@app.get("/health")
def health():
    return {
        "status": "ok",
        "models": {name: {"available": path.is_file(), "artifact": str(path.relative_to(ROOT))}
                   for name, path in MODEL_PATHS.items()},
        "gemini_configured": bool(os.getenv("GEMINI_API_Key")),
    }


@app.get("/")
def root():
    return {
        "service": "ENIGMA Risk Inference API",
        "status": "running",
        "health": "/health",
        "interactive_api_docs": "/docs",
        "assessment_endpoint": "POST /api/assess",
        "message": "Use /docs to submit a risk assessment; the root URL does not accept prediction inputs.",
    }


@app.post("/api/assess")
def assess(request: AssessRequest):
    try:
        # Required ordering: ML inference first; the explanation API receives
        # only the structured ML result, never the raw form payload.
        ml_json = run_ml(request.domain, request.user_input)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except NotImplementedError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc
    except (ValueError, TypeError, KeyError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    reasoning = gemini_reasoning(request.domain, ml_json) if request.include_ai_reasoning else None
    return {"domain": request.domain, "ml_risk_json": ml_json, "ai_reasoning": reasoning}
