@echo off
REM VeriTrust - Start Script (Windows)
REM This script starts both the backend and frontend services

setlocal enabledelayedexpansion

echo ========================================
echo VeriTrust - Development Environment
echo ========================================

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    exit /b 1
)

echo [OK] Python found: 
python --version

echo [OK] Node found:
node --version

REM Setup backend
echo.
echo [1/4] Setting up backend...
if not exist "venv" (
    python -m venv venv
    echo [OK] Virtual environment created
)

call venv\Scripts\activate.bat
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    exit /b 1
)
echo [OK] Backend dependencies installed

REM Setup frontend
echo.
echo [2/4] Setting up frontend...
if not exist "frontend\node_modules" (
    cd frontend
    call npm install -q
    cd ..
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

REM Start backend
echo.
echo [3/4] Starting backend...
echo Starting backend on http://localhost:8000
start "VeriTrust Backend" cmd /k "call venv\Scripts\activate.bat && uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000"
echo [OK] Backend started

timeout /t 2 /nobreak

REM Start frontend
echo.
echo [4/4] Starting frontend...
echo Starting frontend on http://localhost:5173
cd frontend
start "VeriTrust Frontend" cmd /k "call npm run dev"
cd ..
echo [OK] Frontend started

echo.
echo ========================================
echo Services Started
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Close the console windows to stop services
echo.

pause
