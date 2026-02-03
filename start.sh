#!/bin/bash
# VeriTrust - Start Script (Linux/macOS)
# This script starts both the backend and frontend services

set -e

echo "========================================"
echo "VeriTrust - Development Environment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Python found: $(python3 --version)${NC}"
echo -e "${GREEN}✓ Node found: $(node --version)${NC}"

# Install backend dependencies if needed
echo ""
echo -e "${YELLOW}[1/4] Setting up backend...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

source venv/bin/activate
pip install -q -r requirements.txt 2>/dev/null || pip install -r requirements.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Install frontend dependencies if needed
echo ""
echo -e "${YELLOW}[2/4] Setting up frontend...${NC}"
if [ ! -d "frontend/node_modules" ]; then
    cd frontend
    npm install -q
    cd ..
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

# Start backend in background
echo ""
echo -e "${YELLOW}[3/4] Starting backend...${NC}"
cd $(dirname "$0")
source venv/bin/activate
echo -e "${GREEN}Starting backend on http://localhost:8000${NC}"
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait a moment for backend to start
sleep 2

# Start frontend in background
echo ""
echo -e "${YELLOW}[4/4] Starting frontend...${NC}"
cd frontend
echo -e "${GREEN}Starting frontend on http://localhost:5173${NC}"
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo "========================================"
echo -e "${GREEN}Services Started${NC}"
echo "========================================"
echo -e "Backend:  http://localhost:8000"
echo -e "Frontend: http://localhost:5173"
echo -e "Logs:     /tmp/backend.log (backend)"
echo -e "Logs:     /tmp/frontend.log (frontend)"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}Services stopped${NC}"
}

trap cleanup EXIT

# Wait for user interrupt
wait
