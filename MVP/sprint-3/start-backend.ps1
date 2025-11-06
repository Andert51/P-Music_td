# Sprint 3 - Iniciar Backend
# Puerto: 8003
# API: /mvp/sprint3

Write-Host "🐍 Iniciando Backend Sprint 3..." -ForegroundColor Green

# Verificar si existe venv
if (-not (Test-Path "venv")) {
    Write-Host "⚠️  No existe entorno virtual. Ejecuta .\setup.ps1 primero" -ForegroundColor Red
    exit 1
}

# Activar venv
Write-Host "   Activando entorno virtual..." -ForegroundColor Gray
.\venv\Scripts\activate

# Iniciar servidor
Write-Host "   Iniciando servidor en puerto 8003..." -ForegroundColor Gray
Write-Host ""
Write-Host "📡 Backend disponible en: http://localhost:8003" -ForegroundColor Cyan
Write-Host "📚 Docs disponibles en: http://localhost:8003/docs" -ForegroundColor Cyan
Write-Host ""

python -m uvicorn main:app --reload --port 8003
