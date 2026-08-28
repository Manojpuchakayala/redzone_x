@echo off
TITLE RED-ZONE X - Disaster Decision Platform Launcher
COLOR 0A
echo ================================================================
echo    RED-ZONE X : Intelligent Disaster Risk Platform
echo    SIH 2026 Emergency Decision Support System
echo ================================================================
echo.
echo [1/2] Launching Backend API & MongoDB Atlas Cloud Connection...
start "RED-ZONE X Backend API" cmd /k "cd backend && npm install && npm start"

echo [2/2] Launching React Satellite Frontend UI...
start "RED-ZONE X Frontend Web" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ================================================================
echo  All services launched! 
echo  Frontend UI: http://localhost:5173/
echo  Backend API: http://localhost:5001/api/alerts
echo ================================================================
pause
