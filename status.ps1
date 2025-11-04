# ==============================================================================
# 📊 Music Streaming App - Status Script
# ==============================================================================
# Este script verifica el estado de todos los servicios de la aplicación
# ==============================================================================

$ErrorActionPreference = "SilentlyContinue"

Clear-Host
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📊 MUSIC STREAMING APP - STATUS CHECK" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ==============================================================================
# VERIFICAR PROCESOS
# ==============================================================================

Write-Host "🔍 ESTADO DE PROCESOS" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Backend
$backendRunning = $false
$uvicornProcesses = Get-Process -Name "python" | Where-Object {
    $_.CommandLine -like "*uvicorn*main:app*"
}

if ($uvicornProcesses) {
    Write-Host "🐍 Backend (Python/Uvicorn):  " -NoNewline -ForegroundColor Magenta
    Write-Host "ACTIVO ✅" -ForegroundColor Green
    foreach ($process in $uvicornProcesses) {
        $memoryMB = [math]::Round($process.WorkingSet64 / 1MB, 2)
        Write-Host "   PID: $($process.Id) | RAM: $memoryMB MB" -ForegroundColor Gray
    }
    $backendRunning = $true
} else {
    Write-Host "🐍 Backend (Python/Uvicorn):  " -NoNewline -ForegroundColor Magenta
    Write-Host "INACTIVO ❌" -ForegroundColor Red
}

Write-Host ""

# Frontend
$frontendRunning = $false
$nodeProcesses = Get-Process -Name "node" | Where-Object {
    $_.CommandLine -like "*vite*"
}

if ($nodeProcesses) {
    Write-Host "⚛️  Frontend (Node/Vite):      " -NoNewline -ForegroundColor Blue
    Write-Host "ACTIVO ✅" -ForegroundColor Green
    foreach ($process in $nodeProcesses) {
        $memoryMB = [math]::Round($process.WorkingSet64 / 1MB, 2)
        Write-Host "   PID: $($process.Id) | RAM: $memoryMB MB" -ForegroundColor Gray
    }
    $frontendRunning = $true
} else {
    Write-Host "⚛️  Frontend (Node/Vite):      " -NoNewline -ForegroundColor Blue
    Write-Host "INACTIVO ❌" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# ==============================================================================
# VERIFICAR PUERTOS
# ==============================================================================

Write-Host "🔌 ESTADO DE PUERTOS" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
        return $connection
    } catch {
        return $false
    }
}

# Puerto 8000 (Backend)
if (Test-Port -Port 8000) {
    Write-Host "Puerto 8000 (Backend API):    " -NoNewline
    Write-Host "ABIERTO ✅" -ForegroundColor Green
    $port8000Process = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
    if ($port8000Process) {
        $process = Get-Process -Id $port8000Process.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   Proceso: $($process.Name) (PID: $($process.Id))" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "Puerto 8000 (Backend API):    " -NoNewline
    Write-Host "CERRADO ❌" -ForegroundColor Red
}

Write-Host ""

# Puerto 5173 (Frontend)
if (Test-Port -Port 5173) {
    Write-Host "Puerto 5173 (Frontend):       " -NoNewline
    Write-Host "ABIERTO ✅" -ForegroundColor Green
    $port5173Process = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
    if ($port5173Process) {
        $process = Get-Process -Id $port5173Process.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   Proceso: $($process.Name) (PID: $($process.Id))" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "Puerto 5173 (Frontend):       " -NoNewline
    Write-Host "CERRADO ❌" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# ==============================================================================
# VERIFICAR CONECTIVIDAD
# ==============================================================================

Write-Host "🌐 VERIFICACIÓN DE CONECTIVIDAD" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Verificar Backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000" -Method GET -TimeoutSec 2 -UseBasicParsing
    Write-Host "Backend API (http://localhost:8000):        " -NoNewline
    Write-Host "RESPONDIENDO ✅" -ForegroundColor Green
    Write-Host "   Código de respuesta: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "Backend API (http://localhost:8000):        " -NoNewline
    Write-Host "NO RESPONDE ❌" -ForegroundColor Red
    if ($_.Exception.Message) {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host ""

# Verificar Frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 2 -UseBasicParsing
    Write-Host "Frontend (http://localhost:5173):           " -NoNewline
    Write-Host "RESPONDIENDO ✅" -ForegroundColor Green
    Write-Host "   Código de respuesta: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "Frontend (http://localhost:5173):           " -NoNewline
    Write-Host "NO RESPONDE ❌" -ForegroundColor Red
    if ($_.Exception.Message) {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host ""

# ==============================================================================
# VERIFICAR BASE DE DATOS
# ==============================================================================

Write-Host "💾 CONFIGURACIÓN DE BASE DE DATOS" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

if (Test-Path ".env") {
    $envContent = Get-Content ".env"
    $dbUrl = $envContent | Where-Object { $_ -like "DATABASE_URL=*" }
    if ($dbUrl) {
        Write-Host "Archivo .env:                 " -NoNewline
        Write-Host "ENCONTRADO ✅" -ForegroundColor Green
        Write-Host "   $dbUrl" -ForegroundColor Gray
    } else {
        Write-Host "Archivo .env:                 " -NoNewline
        Write-Host "SIN DATABASE_URL ⚠️" -ForegroundColor Yellow
    }
} else {
    Write-Host "Archivo .env:                 " -NoNewline
    Write-Host "NO ENCONTRADO ❌" -ForegroundColor Red
}

Write-Host ""
Write-Host ""

# ==============================================================================
# RESUMEN
# ==============================================================================

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📊 RESUMEN" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($backendRunning -and $frontendRunning) {
    Write-Host "✅ Estado general: " -NoNewline
    Write-Host "TODO OPERATIVO" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Acceso:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "   API Docs:  http://localhost:8000/docs" -ForegroundColor White
} elseif ($backendRunning -or $frontendRunning) {
    Write-Host "⚠️  Estado general: " -NoNewline
    Write-Host "PARCIALMENTE OPERATIVO" -ForegroundColor Yellow
    Write-Host ""
    if (-not $backendRunning) {
        Write-Host "   ❌ Backend no está corriendo" -ForegroundColor Red
    }
    if (-not $frontendRunning) {
        Write-Host "   ❌ Frontend no está corriendo" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "💡 Inicia los servicios con: .\start.ps1" -ForegroundColor Yellow
} else {
    Write-Host "❌ Estado general: " -NoNewline
    Write-Host "INACTIVO" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Inicia los servicios con: .\start.ps1" -ForegroundColor Yellow
}

Write-Host ""
