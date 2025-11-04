@echo off
:: ==============================================================================
:: Music Streaming App - Status Script (Batch Version)
:: ==============================================================================

title Music Streaming App - Status

echo.
echo ================================================================
echo    MUSIC STREAMING APP - VERIFICANDO ESTADO...
echo ================================================================
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0status.ps1"

echo.
pause
