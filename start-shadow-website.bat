@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo Python is required to start the local website server.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to start the Shadow Board Exam backend.
  pause
  exit /b 1
)

start "Shadow Study Backend" /min cmd /k "cd /d ""%CD%\backend\shadow-board-exam"" && node server.js"
start "Shadow Website" /min cmd /k "cd /d ""%CD%"" && python -m http.server 4173 --bind 127.0.0.1"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/"
