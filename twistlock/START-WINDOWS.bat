@echo off
title TWISTLOCK
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js fehlt noch.
  echo   Bitte einmalig von https://nodejs.org herunterladen und installieren
  echo   ^(die linke, grosse Schaltflaeche^), danach diese Datei nochmal starten.
  echo.
  pause
  exit /b
)
echo.
echo   TWISTLOCK startet...
echo   Gleich oeffnet sich der Browser. Dieses Fenster bitte offen lassen.
echo.
start "" http://localhost:3000
node server.js
pause
