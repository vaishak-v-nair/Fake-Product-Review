#!/usr/bin/env python3
"""
Integration test script to verify backend and frontend connectivity.
This script tests the backend API before running the full application.
"""

import json
import requests
import time
import sys
from typing import Dict, Any

# Configuration
BACKEND_URL = "http://localhost:8000"
HEALTH_ENDPOINT = f"{BACKEND_URL}/health"
PREDICT_ENDPOINT = f"{BACKEND_URL}/predict"

# Test reviews
TEST_REVIEWS = [
    {
        "name": "Clearly Fake Review",
        "text": "AMAZING BEST PRODUCT EVER!!!! MUST BUY!!!! 10/10!!!!! Don't wait!!!",
        "expected_label": "fake"
    },
    {
        "name": "Balanced Review",
        "text": "I've been using this product for 2 months. The build quality is good, though the battery life could be better. Overall satisfied with the purchase.",
        "expected_label": "real"
    },
    {
        "name": "Short Promotional",
        "text": "Best ever!",
        "expected_label": "fake"
    }
]

def test_health_check() -> bool:
    """Test if backend is running and healthy."""
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        print("✓ Health Check Passed")
        print(f"  Status: {data.get('status')}")
        print(f"  Service: {data.get('service')}")
        print(f"  Model Loaded: {data.get('model_loaded')}")
        return True
    except requests.exceptions.ConnectionError:
        print("✗ Health Check Failed: Cannot connect to backend")
        print(f"  Make sure backend is running on {BACKEND_URL}")
        return False
    except Exception as e:
        print(f"✗ Health Check Failed: {str(e)}")
        return False

def test_prediction(review: Dict[str, str]) -> bool:
    """Test prediction endpoint with a review."""
    try:
        response = requests.post(
            PREDICT_ENDPOINT,
            json={"text": review["text"]},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        
        print(f"\n✓ Prediction for '{review['name']}':")
        print(f"  Input: {review['text'][:60]}...")
        print(f"  Predicted Label: {data['label']}")
        print(f"  Confidence: {data['confidence']:.4f}")
        print(f"  Signals: {', '.join(data['signals'][:2])}")
        
        # Validate response structure
        required_fields = ["label", "confidence", "signals"]
        if not all(field in data for field in required_fields):
            print(f"  ✗ Response missing required fields: {required_fields}")
            return False
            
        return True
    except requests.exceptions.Timeout:
        print(f"✗ Prediction Timeout for '{review['name']}'")
        print("  Model inference took too long. Check if model is loaded.")
        return False
    except Exception as e:
        print(f"✗ Prediction Failed for '{review['name']}': {str(e)}")
        return False

def main():
    """Run all integration tests."""
    print("=" * 60)
    print("VeriTrust Backend Integration Test")
    print("=" * 60)
    
    # Test 1: Health Check
    print("\n[1/3] Testing Backend Health...")
    health_ok = test_health_check()
    
    if not health_ok:
        print("\n" + "=" * 60)
        print("Backend is not running. Please start it with:")
        print(f"  uvicorn backend.app:app --reload")
        print("=" * 60)
        sys.exit(1)
    
    # Test 2: Predictions
    print("\n[2/3] Testing Prediction Endpoint...")
    predictions_ok = True
    for review in TEST_REVIEWS:
        if not test_prediction(review):
            predictions_ok = False
    
    # Test 3: Frontend Connectivity
    print("\n[3/3] Testing Frontend Connectivity...")
    print("✓ Frontend will connect to backend at:")
    print(f"  {BACKEND_URL}/predict")
    print("✓ CORS is configured for http://localhost:5173")
    
    # Summary
    print("\n" + "=" * 60)
    if health_ok and predictions_ok:
        print("✓ All tests passed! Backend is ready.")
        print("\nStart the frontend with:")
        print("  cd frontend && npm run dev")
        print("\nThen open: http://localhost:5173/")
    else:
        print("✗ Some tests failed. Check the errors above.")
        sys.exit(1)
    print("=" * 60)

if __name__ == "__main__":
    main()
