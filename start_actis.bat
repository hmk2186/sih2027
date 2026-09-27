@echo off
echo ================================================================================
echo  ACTIS - Automated Content Transformation & Intelligence System (NTRO PS 26154)
echo  Smart India Hackathon 2026
echo ================================================================================
echo Starting ACTIS Backend on http://127.0.0.1:8000 ...
start "ACTIS Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo Starting ACTIS Frontend on http://127.0.0.1:5173 ...
start "ACTIS Frontend (React)" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ACTIS is launching!
echo Backend Docs:  http://127.0.0.1:8000/docs
echo Frontend App:  http://127.0.0.1:5173
echo.
pause
