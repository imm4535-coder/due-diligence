@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 20+ from https://nodejs.org or import due-diligence-skill.zip in a compatible Claude skill interface.
) else (
  node install-skill.mjs claude
)
pause
