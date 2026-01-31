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
- `models/` – saved model artifacts
- `main.py` – pipeline orchestration

## Tech Stack
- Python
- scikit-learn
- Transformers (BERT-based embeddings)
- VS Code (local development)

## Status
🚧 In progress – building from scratch with a production-oriented mindset. 