# 🚀 VeriTrust - Quick Start Guide

## What is VeriTrust?
VeriTrust is a full-stack application that uses AI to detect fake product reviews. It combines a fine-tuned RoBERTa model (backend) with a modern React UI (frontend).

## ⚡ 30-Second Start

### Windows
```bash
start.bat
```

### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

Then open: **http://localhost:5173/**

## 📋 Prerequisites
- Python 3.8+ ([Download](https://www.python.org/downloads/))
- Node.js 18+ ([Download](https://nodejs.org/))

## 🔧 Manual Start (If Scripts Don't Work)

### Terminal 1: Backend
```bash
pip install -r requirements.txt
uvicorn backend.app:app --reload
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [SETUP_AND_RUN.md](./SETUP_AND_RUN.md) | Detailed setup instructions |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Debugging common issues |
| [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) | Technical overview of changes |
| [README.md](./README.md) | Project overview |

## 🧪 Test the Integration

```bash
python test_integration.py
```

This verifies:
- ✓ Backend is running
- ✓ Model is loaded
- ✓ API endpoints work
- ✓ Frontend can connect

## 🏗️ Architecture

```
Frontend (React)          Backend (FastAPI)
http://localhost:5173     http://localhost:8000
     │                           │
     └──> POST /predict ────────>│
          Review Text            │ Model Inference
     <── JSON Response ───────────┘
```

## 🎯 What Works

✅ Submit product reviews for analysis
✅ Get AI predictions (fake/real)
✅ View confidence scores
✅ See explanation signals
✅ Dark/light theme support
✅ Responsive design

## 📝 API Examples

### Health Check
```bash
curl http://localhost:8000/health
```

### Analyze Review
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"This product is amazing!"}'
```

## 🐛 Troubleshooting

**Q: Port 8000 already in use?**
```bash
uvicorn backend.app:app --reload --port 8001
# Update frontend .env: VITE_API_URL=http://localhost:8001
```

**Q: Frontend can't connect to backend?**
- Ensure backend is running: `curl http://localhost:8000/health`
- Check browser console (F12) for errors
- Verify both are using localhost

**Q: Model not found?**
- Check that `models/roberta_finetuned/` exists
- Verify all model files are present and not corrupted

**Q: Dependencies not installing?**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## 📞 Need Help?

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues with solutions
2. Run `python test_integration.py` - Diagnostic test
3. Check browser console (F12) - Client-side errors
4. Check terminal output - Server-side errors
5. Read [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) - Technical details

## 🎓 Understanding the Flow

1. User enters review in demo section
2. Frontend sends review to `POST /predict` endpoint
3. Backend tokenizes review and runs RoBERTa model
4. Model produces prediction (fake/real) with confidence
5. Backend extracts explanation signals
6. Frontend receives JSON and displays results

## 🔐 Production Notes

For deploying to production:
- Update CORS origins to your domain
- Add authentication/API keys
- Implement rate limiting
- Use environment variables for config
- Enable HTTPS
- Add request caching
- Consider model optimization

## 🎨 Customize

### Change API URL
Edit `frontend/.env`:
```
VITE_API_URL=http://your-backend-url:8000
```

### Change Backend Port
```bash
uvicorn backend.app:app --port 8001
```

### Update Model
Replace `models/roberta_finetuned/` with your fine-tuned model

## 📊 Performance

- First prediction: ~2-5 seconds (model warmup)
- Subsequent predictions: <1 second
- Uses GPU if available, falls back to CPU
- Handles up to 256 tokens per review

## 🚀 Next Steps

1. ✅ Start the application
2. ✅ Try analyzing sample reviews
3. ✅ Explore the model's predictions
4. ✅ Read the full documentation
5. ✅ Customize for your needs

---

**Happy analyzing! 🎉**
