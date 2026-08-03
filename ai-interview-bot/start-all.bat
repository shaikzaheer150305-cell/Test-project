@echo off
title AI Interview Bot - Starting All...
echo.
echo =============================================
echo   Smart AI Interview Bot - Full Stack
echo =============================================
echo.

echo [1/2] Starting Backend Server (port 5000)...
start "Backend Server" cmd /c "cd /d D:\AI Interview Project\backend && node server.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (port 5173)...
start "Frontend Dev" cmd /c "cd /d D:\AI Interview Project\frontend && npx vite --port 5173"

echo.
echo =============================================
echo   Both servers are starting!
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo.
echo   Open http://localhost:5173 in your browser
echo =============================================
echo.
timeout /t 5 /nobreak >nul
