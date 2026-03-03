@echo off
echo ===================================================
echo     BharatTranslate - AI Kosh Servers Launcher
echo ===================================================
echo.
echo Starting FastAPI Backend (Port 8000)...
start "FastAPI Backend" cmd /k "cd /d d:\Software\Projects\BharatTranslate\backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Expo Mobile App Front-End...
timeout /t 3 >nul
start "Expo Mobile Server" cmd /k "cd /d d:\Software\Projects\BharatTranslate\mobile && npx expo start -c"

echo.
echo Both servers are starting in new windows!
echo DO NOT close those windows while testing.
echo ===================================================
pause
