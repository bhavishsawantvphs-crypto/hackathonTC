@echo off
title Jharkhand Tourism Website & AI Bot Server
cd /d "%~dp0"

echo ========================================================
echo   Jharkhand Tourism - Unexplored Gems ^& Sohrai AI Bot
echo ========================================================
echo.
echo Starting backend server on http://localhost:3000 ...
echo Opening your browser to http://localhost:3000/ ...
echo.

start "" /b cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:3000/"
node Bots/server.js

pause
