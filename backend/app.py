import os
import torch
import torch.nn.functional as F

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import RobertaTokenizerFast, RobertaForSequenceClassification
from typing import List


# -----------------------------
# App initialization
# -----------------------------
app = FastAPI(
    title="VeriTrust API",
    description="AI-powered system for detecting fake product reviews",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Model loading (ONCE)
# -----------------------------
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "roberta_finetuned"
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_loaded = False
try:
    tokenizer = RobertaTokenizerFast.from_pretrained(MODEL_PATH)
    model = RobertaForSequenceClassification.from_pretrained(MODEL_PATH)
    model.to(device)
    model.eval()
    model_loaded = True
    print(f"✓ Model loaded successfully on device: {device}")
except Exception as e:
    print(f"✗ Error loading model: {str(e)}")
    print(f"  Expected model path: {MODEL_PATH}")
    tokenizer = None
    model = None

# -----------------------------
# Schemas
# -----------------------------
class ReviewRequest(BaseModel):
    text: str


class PredictionResponse(BaseModel):
    label: str
    confidence: float
    signals: List[str]


# -----------------------------
# Health check
# -----------------------------
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "veritrust",
        "model_loaded": model_loaded
    }


# -----------------------------
# Explainability signals
# (honest, rule-based indicators)
# -----------------------------
def extract_signals(text: str, confidence: float) -> List[str]:
    signals = []

    word_count = len(text.split())

    if word_count < 5:
        signals.append("Very short review length")

    if text.count("!") >= 3:
        signals.append("Excessive punctuation")

    if any(phrase in text.lower() for phrase in [
        "best ever",
        "must buy",
        "highly recommend",
        "five stars",
        "life changing"
    ]):
        signals.append("Overly promotional language")

    if confidence > 0.90:
        signals.append("Strong deceptive language pattern detected by model")

    return signals


# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/predict", response_model=PredictionResponse)
def predict_review(request: ReviewRequest):
    if not model_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Check server logs for loading errors."
        )
    
    if not request.text or not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Review text cannot be empty"
        )
    
    # Tokenization
    inputs = tokenizer(
        request.text,
        truncation=True,
        padding=True,
        max_length=256,
        return_tensors="pt"
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    # Inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=1)

    confidence, pred_class = torch.max(probs, dim=1)

    label = "fake" if pred_class.item() == 1 else "real"
    confidence_value = round(confidence.item(), 4)

    signals = extract_signals(request.text, confidence_value)

    return {
        "label": label,
        "confidence": confidence_value,
        "signals": signals
    }