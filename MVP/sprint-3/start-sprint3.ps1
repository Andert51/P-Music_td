# Script para iniciar Sprint 3
# Backend: Puerto 8003
# Frontend: Puerto 5176

Write-Host "🚀 Iniciando Sprint 3 - Búsqueda + Álbumes + Upload" -ForegroundColor Cyan
Write-Host ""

# Verificar ubicación
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Función para iniciar backend
function Start-Backend {
    Write-Host "📦 Iniciando Backend (Puerto 8003)..." -ForegroundColor Green
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; .\start-backend.ps1"
}

# Función para iniciar frontend
function Start-Frontend {
    Write-Host "🎨 Iniciando Frontend (Puerto 5176)..." -ForegroundColor Blue
    Start-Sleep -Seconds 3
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; .\start-frontend.ps1"
}

# Iniciar servicios
Start-Backend
Start-Frontend

Write-Host ""
Write-Host "✅ Sprint 3 iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Yellow
Write-Host "  Backend:  http://localhost:8003" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5176" -ForegroundColor White
Write-Host "  Docs:     http://localhost:8003/docs" -ForegroundColor White
Write-Host ""
Write-Host "✨ Funcionalidades:" -ForegroundColor Cyan
Write-Host "  🔍 Búsqueda de canciones" -ForegroundColor White
Write-Host "  💿 Página de álbumes" -ForegroundColor White
Write-Host "  📤 Sistema de subida" -ForegroundColor White
Write-Host "  🎵 Player funcional" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Para detener los servicios, cierra las ventanas de terminal" -ForegroundColor Yellow
Write-Host ""
