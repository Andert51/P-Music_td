# Sprint 3 - Iniciar Frontend
# Puerto: 5176

Write-Host "⚛️  Iniciando Frontend Sprint 3..." -ForegroundColor Blue

Set-Location frontend

# Verificar node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  No existen dependencias. Instalando..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🎨 Frontend disponible en: http://localhost:5176" -ForegroundColor Cyan
Write-Host ""

npm run dev
