# Script para iniciar Sprint 2
# Backend: Puerto 8002
# Frontend: Puerto 5175

Write-Host "🚀 Iniciando Sprint 2 - Player + Upload" -ForegroundColor Cyan
Write-Host ""

# Verificar ubicación
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Función para iniciar backend
function Start-Backend {
    Write-Host "📦 Iniciando Backend (Puerto 8002)..." -ForegroundColor Green
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\backend'; uvicorn main:app --reload --port 8002"
}

# Función para iniciar frontend
function Start-Frontend {
    Write-Host "🎨 Iniciando Frontend (Puerto 5175)..." -ForegroundColor Blue
    Start-Sleep -Seconds 2
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\frontend'; npm run dev"
}

# Iniciar servicios
Start-Backend
Start-Frontend

Write-Host ""
Write-Host "✅ Sprint 2 iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost:8002" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5175" -ForegroundColor White
Write-Host "  Docs:     http://localhost:8002/docs" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Para detener los servicios, cierra las ventanas de terminal" -ForegroundColor Yellow
Write-Host ""
