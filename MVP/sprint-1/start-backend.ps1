# Sprint 1 MVP - Iniciar Backend
# Puerto: 8001

Write-Host "🚀 Iniciando Backend Sprint 1..." -ForegroundColor Yellow

# Verificar si existe venv
if (-not (Test-Path "backend\venv")) {
    Write-Host "⚠️  No se encontró entorno virtual. Creando..." -ForegroundColor Red
    Set-Location backend
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    Set-Location ..
}

# Verificar .env
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  No se encontró .env. Copiando desde .env.example..." -ForegroundColor Red
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "⚠️  Por favor, edita backend\.env con tus credenciales de PostgreSQL" -ForegroundColor Red
    pause
}

# Iniciar backend
Set-Location backend
.\venv\Scripts\activate
Write-Host "✅ Backend iniciando en http://localhost:8001" -ForegroundColor Green
Write-Host "📚 API Docs: http://localhost:8001/docs" -ForegroundColor Cyan
uvicorn main:app --reload --port 8001
