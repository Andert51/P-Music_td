@echo off
:: ==============================================================================
:: Music Streaming App - Stop Script (Batch Version)
:: ==============================================================================

title Music Streaming App - Stop

echo.
echo ================================================================
echo    MUSIC STREAMING APP - DETENIENDO SERVICIOS...
echo ================================================================
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0stop.ps1"

echo.
pause
