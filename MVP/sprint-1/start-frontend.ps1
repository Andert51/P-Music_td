# Sprint 1 MVP - Iniciar Frontend
# Puerto: 5174

Write-Host "🚀 Iniciando Frontend Sprint 1..." -ForegroundColor Yellow

# Verificar node_modules
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "⚠️  No se encontraron dependencias. Instalando..." -ForegroundColor Red
    Set-Location frontend
    npm install
    Set-Location ..
}

# Iniciar frontend
Set-Location frontend
Write-Host "✅ Frontend iniciando en http://localhost:5174" -ForegroundColor Green
npm run dev
