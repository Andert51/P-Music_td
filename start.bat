@echo off
:: ==============================================================================
:: Music Streaming App - Start Script (Batch Version)
:: ==============================================================================

title Music Streaming App - Launcher

echo.
echo ================================================================
echo    MUSIC STREAMING APP - INICIANDO...
echo ================================================================
echo.

:: Verificar si estamos en el directorio correcto
if not exist "src\backend" (
    echo [ERROR] No se encuentra el directorio src\backend
    echo Ejecuta este script desde la raiz del proyecto
    pause
    exit /b 1
)

if not exist "src\frontend" (
    echo [ERROR] No se encuentra el directorio src\frontend
    echo Ejecuta este script desde la raiz del proyecto
    pause
    exit /b 1
)

:: Ejecutar el script de PowerShell
echo Ejecutando script de PowerShell...
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0start.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Hubo un problema al ejecutar el script
    pause
    exit /b 1
)

exit /b 0
