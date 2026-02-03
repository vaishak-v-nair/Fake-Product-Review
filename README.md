# Fake Product Review Detection using NLP

This project implements an end-to-end machine learning system to assess the trustworthiness of product reviews using semantic, opinion-based, and structural signals.

## Objectives
- Detect potentially manipulated or fake product reviews
- Generate a trust risk score instead of binary labels
- Build a modular ML pipeline with clear separation between data, features, models, and inference
- Simulate real-world ML system design using local development

## Project Structure
- `data/` – raw and processed datasets
- `notebooks/` – exploratory data analysis
- `src/` – core ML pipeline (validation, preprocessing, features, training, inference)
- `models/` – saved model artifacts (fine-tuned RoBERTa)
- `backend/` – FastAPI server for model inference
- `frontend/` – React + TypeScript web application
- `main.py` – pipeline orchestration script

## Tech Stack
- **Backend:** Python, FastAPI, PyTorch, Transformers (RoBERTa)
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **ML/Data:** scikit-learn, pandas, numpy

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- pip & npm

### Setup
See [SETUP_AND_RUN.md](./SETUP_AND_RUN.md) for detailed instructions.

**Quick Setup:**
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Running the Application

**Terminal 1: Start Backend**
```bash
uvicorn backend.app:app --reload
```

**Terminal 2: Start Frontend**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173/` in your browser.

## Features
- ✅ Live demo interface for analyzing product reviews
- ✅ Fine-tuned RoBERTa model for fake review detection
- ✅ Explainability signals showing why a review is flagged
- ✅ Dark/light theme support
- ✅ Responsive design

## API Documentation

### Health Check
```
GET http://localhost:8000/health
```

### Predict Review
```
POST http://localhost:8000/predict
Content-Type: application/json

{
  "text": "Your product review here..."
}
```

Response:
```json
{
  "label": "fake" or "real",
  "confidence": 0.95,
  "signals": ["Signal 1", "Signal 2"]
}
```

## Status
🚧 In progress – building from scratch with a production-oriented mindset. 