@echo off
title Digital Library System - Launcher
echo ===================================================
echo     Starting Digital Library Management System
echo ===================================================
echo.

echo [1/2] Starting Spring Boot Backend (Port 8082)...
start "Digital Library Backend" cmd /k "cd /d ""%~dp0backend"" && mvn spring-boot:run"

echo [2/2] Starting Vite Frontend (Port 5173)...
start "Digital Library Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Waiting 5 seconds for servers to initialize...
timeout /t 5 /nobreak >nul

echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/

echo.
echo ===================================================
echo   Digital Library is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8082
echo ===================================================
pause
