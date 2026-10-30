@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 20+ from https://nodejs.org or copy skills\due-diligence into %%USERPROFILE%%\.agents\skills manually.
) else (
  node install-skill.mjs codex
)
pause
