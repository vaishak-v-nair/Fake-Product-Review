# VeriTrust - Troubleshooting and Debugging Guide

## Common Issues and Solutions

### 1. Backend Won't Start

**Error: "ModuleNotFoundError: No module named 'fastapi'"**

**Solution:**
```bash
pip install -r requirements.txt
```

**Error: "Port 8000 already in use"**

**Solution:**
```bash
# Option 1: Kill the process using port 8000
# Windows (PowerShell)
Get-Process | Where-Object {$_.Port -eq 8000}

# Option 2: Use a different port
uvicorn backend.app:app --reload --port 8001
# Then update frontend .env: VITE_API_URL=http://localhost:8001
```

**Error: "CUDA out of memory" or model loading fails**

**Solution:**
- The backend will automatically fall back to CPU
- Ensure model files exist in `models/roberta_finetuned/`
- Check disk space for model files (usually ~500MB)

### 2. Frontend Won't Start

**Error: "npm: command not found"**

**Solution:**
- Install Node.js from https://nodejs.org/
- Run `npm --version` to verify installation

**Error: "Cannot find module" or "vite" not found**

**Solution:**
```bash
cd frontend
npm install
npm run dev
```

**Error: Module resolution issues**

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 3. Frontend Cannot Connect to Backend

**Error: "Failed to fetch" or CORS error in browser console**

**Checklist:**
1. ✓ Is backend running on `http://localhost:8000`?
   ```bash
   # Test with curl or postman
   curl http://localhost:8000/health
   ```

2. ✓ Check browser console for detailed error (F12)

3. ✓ Verify CORS is configured correctly in `backend/app.py`
   ```python
   allow_origins=["http://localhost:5173"]
   ```

4. ✓ If using different ports, update `.env` file:
   ```
   VITE_API_URL=http://localhost:8001  # if using port 8001
   ```

**Error: "Access to XMLHttpRequest blocked by CORS policy"**

**Solution:**
- Ensure backend is running
- Check that frontend URL matches CORS config
- For development, backend allows all origins on localhost

### 4. Model Not Loaded

**Error: "Model loading failed" or inference hangs**

**Checklist:**
```bash
# Check if model files exist
ls models/roberta_finetuned/
# Should show:
# - config.json
# - model.safetensors
# - tokenizer.json
# - vocab.json
# - tokenizer_config.json
# - merges.txt
# - special_tokens_map.json
```

**Solution:**
1. Verify all model files are present
2. Check file sizes (should be reasonable, not 0 bytes)
3. Ensure correct directory structure: `models/roberta_finetuned/`

### 5. API Response Issues

**Error: "label is not 'fake' or 'real'"**

**Solution:**
- Check backend response format
- Verify backend is returning correct JSON structure:
  ```json
  {
    "label": "fake" or "real",
    "confidence": 0.95,
    "signals": ["signal1", "signal2"]
  }
  ```

**Error: "signals is empty"**

**Solution:**
- This is expected for borderline cases
- The backend extracts signals based on patterns
- Check `backend/app.py` `extract_signals()` function

### 6. Debugging Tips

#### Enable Backend Debug Logging
```bash
uvicorn backend.app:app --reload --log-level debug
```

#### Check Backend Endpoint Directly
```bash
# Test health
curl http://localhost:8000/health

# Test prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a test review"}'
```

#### Check Frontend Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Trigger prediction
4. Check request/response details
5. Look for CORS errors in Console tab

#### View Backend Logs
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Started server process [12345]
INFO:     Application startup complete
```

Look for:
- Model loading messages
- Request processing logs
- Any error traces

### 7. Performance Issues

**Slow predictions (>5 seconds)**

**Causes:**
- Model running on CPU (normal, especially for first inference)
- System resources low
- Inference optimization needed

**Solutions:**
- First inference is slower (model warm-up)
- Subsequent predictions should be faster
- Check CPU/GPU usage with system monitor

**High memory usage**

**Solution:**
- Model cached in memory (~1-2GB)
- Normal for transformer models
- Reduce with smaller model or batch size optimization

## Testing the Integration

### Automated Test
```bash
# Run integration test
python test_integration.py
```

This will:
1. Check if backend is running
2. Test health endpoint
3. Test prediction with sample reviews
4. Verify response format
5. Provide feedback on readiness

### Manual Testing

1. **Start Backend**
   ```bash
   uvicorn backend.app:app --reload
   ```
   Wait for: "Application startup complete"

2. **Test Health Endpoint**
   ```bash
   curl http://localhost:8000/health
   ```
   Expected response:
   ```json
   {"status":"ok","service":"veritrust","model_loaded":true}
   ```

3. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Wait for: "Local: http://localhost:5173/"

4. **Test in Browser**
   - Open http://localhost:5173/
   - Go to "Live Demo" section
   - Enter a review and click "Analyze review"
   - Check browser console (F12) for errors

### Load Testing

For basic load testing:
```bash
# Using curl in a loop
for i in {1..10}; do
  curl -X POST http://localhost:8000/predict \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"Test review $i\"}"
done
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend
Uses environment variables from system:
- `TORCH_DEVICE`: Force CPU/GPU (optional)
- `MODEL_PATH`: Custom model location (optional)

## Logs and Debugging

### Backend Logs Location
- Console output from `uvicorn` command
- Check for warnings/errors

### Frontend Logs
- Browser Console (F12)
- Check Network tab for failed requests
- Look for CORS warnings

### Useful Log Messages

**Backend - Model Loaded**
```
INFO:     Application startup complete
```

**Frontend - API Call**
```
Console: "Error analyzing review: ..."
```

## Quick Fix Checklist

When something breaks:

1. ☐ Backend running? `curl http://localhost:8000/health`
2. ☐ Frontend running? Check terminal for "Local: http://localhost:5173/"
3. ☐ Network tab shows errors? Check CORS headers
4. ☐ Model files present? Check `models/roberta_finetuned/` directory
5. ☐ Dependencies installed? Run `pip install -r requirements.txt`
6. ☐ Correct ports? Backend:8000, Frontend:5173
7. ☐ Try hard refresh? Ctrl+Shift+R in browser
8. ☐ Run test_integration.py? Check backend health

## Reporting Issues

If you encounter issues:

1. Run `python test_integration.py` and save output
2. Check browser console (F12) for client errors
3. Check terminal output for backend errors
4. Verify all prerequisites are installed
5. Provide error messages and logs

## Related Files

- [SETUP_AND_RUN.md](./SETUP_AND_RUN.md) - Initial setup
- [backend/app.py](./backend/app.py) - Backend API code
- [frontend/src/components/DemoSection.tsx](./frontend/src/components/DemoSection.tsx) - Frontend API client
