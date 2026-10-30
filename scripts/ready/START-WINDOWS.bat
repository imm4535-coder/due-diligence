@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if not errorlevel 1 (
  node launch.mjs
  goto finished
)
where py >nul 2>nul
if not errorlevel 1 (
  py -3 launch.py
  goto finished
)
where python >nul 2>nul
if not errorlevel 1 (
  python launch.py
  goto finished
)
echo Install Node.js 20+ from https://nodejs.org or Python 3.10+ from https://python.org then open this file again.
:finished
pause
