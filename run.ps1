# NE-Logi Mind AI - PowerShell Launcher
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "         NE-LOGI MIND AI - FULLSTACK APPLICATION LAUNCHER          " -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Starting Python FastAPI ML & Telemetry Backend (Port 8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "py server/main.py"

Write-Host "[2/2] Starting Vite + React Frontend Dashboard (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "`n====================================================================" -ForegroundColor Green
Write-Host "  Application is running!" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:5173/" -ForegroundColor White
Write-Host "  - Backend:  http://localhost:8000/" -ForegroundColor White
Write-Host "  - API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "====================================================================" -ForegroundColor Green
