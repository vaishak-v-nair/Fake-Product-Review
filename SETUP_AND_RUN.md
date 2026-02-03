# VeriTrust - Setup and Run Instructions

## Project Overview
VeriTrust is a full-stack application for detecting fake product reviews using AI/ML. It consists of:
- **Backend**: FastAPI server running a fine-tuned RoBERTa model
- **Frontend**: React + TypeScript web application with Vite

## Prerequisites
- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- pip (Python package manager)
- npm or yarn (Node package manager)

## Setup Instructions

### 1. Backend Setup

**Step 1.1: Install Python Dependencies**
```bash
pip install -r requirements.txt
```

This installs:
- `fastapi` - Web framework for Python
- `uvicorn` - ASGI server to run FastAPI
- `torch` & `transformers` - For the RoBERTa model
- `pydantic` - Data validation
- Other ML/data processing libraries

**Step 1.2: Verify Model Files**
Ensure the fine-tuned model exists at: `models/roberta_finetuned/`
- `config.json`
- `tokenizer.json`
- `model.safetensors`
- `vocab.json`
- `tokenizer_config.json`
- `merges.txt`
- `special_tokens_map.json`

### 2. Frontend Setup

**Step 2.1: Install Node Dependencies**
```bash
cd frontend
npm install
```

**Step 2.2: Verify Vite Configuration**
The frontend is configured to run on `http://localhost:5173` (default Vite port) and communicates with the backend on `http://localhost:8000`.

## Running the Application

### Option 1: Automated Start (Recommended)

**On Windows:**
```bash
start.bat
```

**On Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

This will:
1. Create a virtual environment (if needed)
2. Install all dependencies
3. Start the backend server
4. Start the frontend dev server
5. Open both services in new terminal windows

### Option 2: Manual Start

#### Terminal 1: Start the Backend Server

```bash
cd <project-root>
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
```

**Health Check:** Visit `http://localhost:8000/health` - should return JSON with status "ok"

#### Terminal 2: Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v7.2.5 running at:

  ➜  Local:   http://localhost:5173/
```

## Usage

1. Open `http://localhost:5173/` in your web browser
2. Navigate to the "Live Demo" section
3. Paste a product review or select a sample review
4. Click "Analyze review"
5. View the prediction results with confidence score and signals

## API Endpoints

### Health Check
- **GET** `http://localhost:8000/health`
- Returns: `{"status": "ok", "service": "veritrust", "model_loaded": true}`

### Review Prediction
- **POST** `http://localhost:8000/predict`
- **Request Body:**
  ```json
  {
    "text": "Your product review here..."
  }
  ```
- **Response:**
  ```json
  {
    "label": "fake" or "real",
    "confidence": 0.95,
    "signals": [
      "Signal 1",
      "Signal 2"
    ]
  }
  ```

## CORS Configuration

The backend is configured to accept requests from the frontend:
- **Allowed Origin:** `http://localhost:5173`
- **Allowed Methods:** All (`GET`, `POST`, `PUT`, `DELETE`, etc.)
- **Allowed Headers:** All

If running on different ports, update the CORS settings in `backend/app.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change this if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Backend Issues

**Error: "Cannot find model files"**
- Verify `models/roberta_finetuned/` directory exists
- Ensure all required model files are present

**Error: "CUDA out of memory"**
- The model will fall back to CPU automatically
- Or reduce batch size in inference logic

**Error: "Port 8000 already in use"**
- Use a different port: `uvicorn backend.app:app --port 8001`
- Update frontend API URL to match

### Frontend Issues

**Error: "Cannot connect to backend"**
- Ensure backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Verify firewall isn't blocking localhost:8000

**Error: "Module not found"**
- Run `npm install` in the `frontend` directory
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Architecture

```
┌─────────────────────────────────────────────────────┐
│          Frontend (React + Vite)                    │
│       Running on http://localhost:5173              │
│  ┌─────────────────────────────────────────────┐   │
│  │ DemoSection Component                       │   │
│  │ - Textarea for review input                 │   │
│  │ - Calls POST /predict endpoint              │   │
│  │ - Displays analysis results                 │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        │ HTTP
                        │ (CORS enabled)
                        ▼
┌─────────────────────────────────────────────────────┐
│          Backend (FastAPI)                          │
│       Running on http://localhost:8000              │
│  ┌─────────────────────────────────────────────┐   │
│  │ /health (GET) - Health check                │   │
│  │ /predict (POST) - Predict review            │   │
│  │   - Tokenizes input text                    │   │
│  │   - Runs RoBERTa inference                  │   │
│  │   - Extracts explanation signals            │   │
│  │   - Returns JSON response                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  RoBERTa Fine-tuned Model                          │
│  (models/roberta_finetuned/)                       │
└─────────────────────────────────────────────────────┘
```

## Development Notes

- **Hot Reload:** Both backend (with `--reload` flag) and frontend support hot module replacement
- **Model Loading:** The model is loaded once at startup and cached in memory for performance
- **Inference:** Uses PyTorch with GPU acceleration if available (falls back to CPU)
- **Frontend State:** React state management for UI (no additional state library needed for demo)

## Next Steps

1. **Production Deployment:** Configure CORS for actual domain
2. **Environment Variables:** Use `.env` files for configuration
3. **Rate Limiting:** Add request rate limiting to backend
4. **Caching:** Implement caching for repeated predictions
5. **Error Handling:** Enhance error messages and logging
6. **Testing:** Add unit and integration tests
