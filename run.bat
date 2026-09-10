@echo off
title NE-Logi Mind AI Launcher
echo ====================================================================
echo             NE-LOGI MIND AI - FULLSTACK APPLICATION LAUNCHER
echo ====================================================================
echo.
echo [1/2] Starting Python FastAPI ML ^& Telemetry Backend (Port 8000)...
start "NE-Logi Mind AI - Backend Server" cmd /k "py server/main.py"

echo [2/2] Starting Vite + React Frontend Dashboard (Port 5173)...
start "NE-Logi Mind AI - Frontend Server" cmd /k "npm run dev"

echo.
echo ====================================================================
echo   Application is now running!
echo   - Frontend: http://localhost:5173/
echo   - Backend:  http://localhost:8000/
echo   - API Docs: http://localhost:8000/docs
echo ====================================================================
