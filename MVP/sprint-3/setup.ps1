# Sprint 3 MVP - Setup Completo
Write-Host "🎯 Setup Sprint 3 MVP - Búsqueda + Álbumes + Upload" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "⚠️  IMPORTANTE: Este Sprint usa la BD principal (music_app)" -ForegroundColor Yellow

# 1. Verificar PostgreSQL
Write-Host "`n📊 Verificando PostgreSQL..." -ForegroundColor Yellow
$dbExists = psql -U postgres -lqt | Select-String "music_app"
if (-not $dbExists) {
    Write-Host "⚠️  Base de datos principal no existe. Creando..." -ForegroundColor Red
    createdb -U postgres music_app
    Write-Host "✅ Base de datos 'music_app' creada" -ForegroundColor Green
    Write-Host "⚠️  Ejecuta el proyecto principal primero para crear las tablas" -ForegroundColor Yellow
} else {
    Write-Host "✅ Base de datos 'music_app' existe (compartida con proyecto principal)" -ForegroundColor Green
}

# 2. Setup Backend (raíz del sprint)
Write-Host "`n🐍 Configurando Backend..." -ForegroundColor Yellow

if (-not (Test-Path "venv")) {
    Write-Host "   Creando entorno virtual..." -ForegroundColor Gray
    python -m venv venv
}

Write-Host "   Activando entorno virtual..." -ForegroundColor Gray
.\venv\Scripts\activate

Write-Host "   Instalando dependencias..." -ForegroundColor Gray
pip install -r requirements.txt

if (-not (Test-Path ".env")) {
    Write-Host "   Copiando .env.example a .env..." -ForegroundColor Gray
    Copy-Item ".env.example" ".env"
}

Write-Host "✅ Backend configurado" -ForegroundColor Green

# 3. Setup Frontend (carpeta frontend)
Write-Host "`n⚛️  Configurando Frontend..." -ForegroundColor Yellow
Set-Location frontend

Write-Host "   Instalando dependencias..." -ForegroundColor Gray
npm install

Write-Host "✅ Frontend configurado" -ForegroundColor Green
Set-Location ..

# 4. Resumen
Write-Host "`n🎉 Setup completado!" -ForegroundColor Green
Write-Host "`n📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Edita .env con tus credenciales de PostgreSQL" -ForegroundColor White
Write-Host "   2. Ejecuta .\start-sprint3.ps1 para iniciar todo" -ForegroundColor White
Write-Host "   3. O ejecuta .\start-backend.ps1 y .\start-frontend.ps1 por separado" -ForegroundColor White
Write-Host "   4. Abre http://localhost:5176 en tu navegador" -ForegroundColor White
Write-Host "`n📚 Lee QUICKSTART.md para más información" -ForegroundColor Yellow
Write-Host "`n✨ Sprint 3 incluye:" -ForegroundColor Cyan
Write-Host "   🔍 Búsqueda de canciones" -ForegroundColor White
Write-Host "   💿 Página de álbumes" -ForegroundColor White
Write-Host "   📤 Sistema de subida" -ForegroundColor White
Write-Host "   🎵 Player funcional" -ForegroundColor White

