# ==============================================================================
# 🛑 Music Streaming App - Stop Script
# ==============================================================================
# Este script detiene todos los procesos de backend y frontend
# ==============================================================================

$ErrorActionPreference = "Continue"

Clear-Host
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
Write-Host "   🛑 MUSIC STREAMING APP - STOP SCRIPT" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red
Write-Host ""

Write-Host "🔍 Buscando procesos de la aplicación..." -ForegroundColor Cyan
Write-Host ""

$stoppedProcesses = 0

# Buscar y detener procesos de Uvicorn (Backend)
$uvicornProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*uvicorn*main:app*" -or
    $_.MainWindowTitle -like "*Backend Server*"
}

if ($uvicornProcesses) {
    Write-Host "🐍 Deteniendo Backend (Python/Uvicorn)..." -ForegroundColor Magenta
    foreach ($process in $uvicornProcesses) {
        try {
            Stop-Process -Id $process.Id -Force
            Write-Host "   ✅ Proceso $($process.Id) detenido" -ForegroundColor Green
            $stoppedProcesses++
        } catch {
            Write-Host "   ⚠️  No se pudo detener proceso $($process.Id)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ℹ️  No se encontraron procesos de Backend" -ForegroundColor Gray
}

# Buscar y detener procesos de Node/Vite (Frontend)
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*vite*" -or
    $_.MainWindowTitle -like "*Frontend Server*"
}

if ($nodeProcesses) {
    Write-Host "⚛️  Deteniendo Frontend (Node/Vite)..." -ForegroundColor Blue
    foreach ($process in $nodeProcesses) {
        try {
            Stop-Process -Id $process.Id -Force
            Write-Host "   ✅ Proceso $($process.Id) detenido" -ForegroundColor Green
            $stoppedProcesses++
        } catch {
            Write-Host "   ⚠️  No se pudo detener proceso $($process.Id)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ℹ️  No se encontraron procesos de Frontend" -ForegroundColor Gray
}

# Buscar procesos usando los puertos específicos
Write-Host ""
Write-Host "🔌 Verificando puertos..." -ForegroundColor Cyan

# Puerto 8000 (Backend)
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    $processId = $port8000.OwningProcess
    try {
        Stop-Process -Id $processId -Force
        Write-Host "   ✅ Proceso en puerto 8000 detenido (PID: $processId)" -ForegroundColor Green
        $stoppedProcesses++
    } catch {
        Write-Host "   ⚠️  No se pudo detener proceso en puerto 8000" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ Puerto 8000 libre" -ForegroundColor Green
}

# Puerto 5173 (Frontend)
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    $processId = $port5173.OwningProcess
    try {
        Stop-Process -Id $processId -Force
        Write-Host "   ✅ Proceso en puerto 5173 detenido (PID: $processId)" -ForegroundColor Green
        $stoppedProcesses++
    } catch {
        Write-Host "   ⚠️  No se pudo detener proceso en puerto 5173" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ Puerto 5173 libre" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Red

if ($stoppedProcesses -gt 0) {
    Write-Host "✅ $stoppedProcesses proceso(s) detenido(s) exitosamente" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No se encontraron procesos activos" -ForegroundColor Gray
}

Write-Host ""
Write-Host "💡 Puedes iniciar nuevamente con: .\start.ps1" -ForegroundColor Yellow
Write-Host ""
