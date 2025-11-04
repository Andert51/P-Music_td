# ==============================================================================
# 🚀 Music Streaming App - Start Script
# ==============================================================================
# Este script inicia automáticamente el backend (FastAPI) y frontend (React)
# en terminales separadas con detección de errores y verificación de dependencias
# ==============================================================================

param(
    [switch]$SkipChecks,  # Saltar verificaciones de dependencias
    [switch]$InstallDeps,  # Instalar/actualizar dependencias automáticamente
    [switch]$Force         # Forzar inicio incluso si puertos están ocupados
)

$ErrorActionPreference = "Stop"

# Colores y símbolos
$script:Colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
    Highlight = "Magenta"
}

function Write-ColorMessage {
    param([string]$Message, [string]$Color = "White", [string]$Icon = "")
    if ($Icon) {
        Write-Host "$Icon $Message" -ForegroundColor $Color
    } else {
        Write-Host $Message -ForegroundColor $Color
    }
}

function Test-Command {
    param([string]$Command)
    try {
        $null = Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet -ErrorAction SilentlyContinue
        return $connection
    } catch {
        return $false
    }
}

# ==============================================================================
# VERIFICACIONES INICIALES
# ==============================================================================

Clear-Host
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor $Colors.Info
Write-Host "   🎵 MUSIC STREAMING APP - STARTUP SCRIPT" -ForegroundColor $Colors.Highlight
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor $Colors.Info
Write-Host ""

# Verificar directorio
if (-not (Test-Path "src/backend") -or -not (Test-Path "src/frontend")) {
    Write-ColorMessage "❌ Error: Ejecuta este script desde la raíz del proyecto" $Colors.Error
    Write-Host "   Ubicación actual: $PWD" -ForegroundColor Gray
    exit 1
}

Write-ColorMessage "📂 Directorio del proyecto verificado" $Colors.Success "✅"
Write-Host ""

if (-not $SkipChecks) {
    Write-ColorMessage "🔍 Verificando dependencias del sistema..." $Colors.Info
    Write-Host ""

    # Verificar Python
    if (Test-Command "python") {
        $pythonVersion = python --version 2>&1
        Write-ColorMessage "Python: $pythonVersion" $Colors.Success "✅"
    } else {
        Write-ColorMessage "Python no encontrado en PATH" $Colors.Error "❌"
        Write-Host "   Instala Python desde: https://www.python.org/" -ForegroundColor Gray
        exit 1
    }

    # Verificar Node.js
    if (Test-Command "node") {
        $nodeVersion = node --version
        Write-ColorMessage "Node.js: $nodeVersion" $Colors.Success "✅"
    } else {
        Write-ColorMessage "Node.js no encontrado en PATH" $Colors.Error "❌"
        Write-Host "   Instala Node.js desde: https://nodejs.org/" -ForegroundColor Gray
        exit 1
    }

    # Verificar npm
    if (Test-Command "npm") {
        $npmVersion = npm --version
        Write-ColorMessage "npm: v$npmVersion" $Colors.Success "✅"
    } else {
        Write-ColorMessage "npm no encontrado" $Colors.Error "❌"
        exit 1
    }

    Write-Host ""

    # Verificar puertos
    if (-not $Force) {
        Write-ColorMessage "🔌 Verificando puertos disponibles..." $Colors.Info
        
        if (Test-Port -Port 8000) {
            Write-ColorMessage "Puerto 8000 (Backend) ya está en uso" $Colors.Warning "⚠️"
            Write-Host "   Usa .\stop.ps1 para detener procesos existentes" -ForegroundColor Gray
            $continue = Read-Host "   ¿Continuar de todas formas? (s/n)"
            if ($continue -ne "s" -and $continue -ne "S") {
                exit 0
            }
        } else {
            Write-ColorMessage "Puerto 8000 (Backend) disponible" $Colors.Success "✅"
        }

        if (Test-Port -Port 5173) {
            Write-ColorMessage "Puerto 5173 (Frontend) ya está en uso" $Colors.Warning "⚠️"
            Write-Host "   Usa .\stop.ps1 para detener procesos existentes" -ForegroundColor Gray
            $continue = Read-Host "   ¿Continuar de todas formas? (s/n)"
            if ($continue -ne "s" -and $continue -ne "S") {
                exit 0
            }
        } else {
            Write-ColorMessage "Puerto 5173 (Frontend) disponible" $Colors.Success "✅"
        }

        Write-Host ""
    }
}

# ==============================================================================
# INSTALACIÓN DE DEPENDENCIAS (OPCIONAL)
# ==============================================================================

if ($InstallDeps) {
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor $Colors.Info
    Write-ColorMessage "📦 Instalando/actualizando dependencias..." $Colors.Highlight
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor $Colors.Info
    Write-Host ""

    # Backend dependencies
    Write-ColorMessage "🐍 Instalando dependencias de Python..." $Colors.Info
    try {
        Push-Location "src/backend"
        pip install -r ../../requirements.txt --quiet --disable-pip-version-check
        Write-ColorMessage "Dependencias de Python instaladas" $Colors.Success "✅"
        Pop-Location
    } catch {
        Write-ColorMessage "Error al instalar dependencias de Python" $Colors.Error "❌"
        Write-Host "   $_" -ForegroundColor Gray
        Pop-Location
        exit 1
    }

    Write-Host ""

    # Frontend dependencies
    Write-ColorMessage "⚛️  Instalando dependencias de Node.js..." $Colors.Info
    try {
        Push-Location "src/frontend"
        & npm.cmd install --silent 2>$null
        Write-ColorMessage "Dependencias de Node.js instaladas" $Colors.Success "✅"
        Pop-Location
    } catch {
        Write-ColorMessage "Error al instalar dependencias de Node.js" $Colors.Error "❌"
        Write-Host "   $_" -ForegroundColor Gray
        Pop-Location
        exit 1
    }

    Write-Host ""
}

# ==============================================================================
# VERIFICAR ARCHIVOS CRÍTICOS
# ==============================================================================

Write-ColorMessage "📋 Verificando archivos de configuración..." $Colors.Info

$criticalFiles = @(
    @{Path=".env"; Name="Variables de entorno"},
    @{Path="src/backend/main.py"; Name="Backend main"},
    @{Path="src/frontend/package.json"; Name="Frontend package.json"},
    @{Path="alembic.ini"; Name="Alembic config"}
)

$allFilesPresent = $true
foreach ($file in $criticalFiles) {
    if (Test-Path $file.Path) {
        Write-ColorMessage "$($file.Name)" $Colors.Success "✅"
    } else {
        Write-ColorMessage "$($file.Name) no encontrado" $Colors.Warning "⚠️"
        $allFilesPresent = $false
    }
}

if (-not $allFilesPresent) {
    Write-Host ""
    Write-ColorMessage "Algunos archivos críticos no fueron encontrados" $Colors.Warning "⚠️"
    Write-Host "   El sistema puede no funcionar correctamente" -ForegroundColor Gray
}

Write-Host ""

# ==============================================================================
# INICIAR SERVIDORES
# ==============================================================================

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor $Colors.Info
Write-ColorMessage "🚀 Iniciando servidores..." $Colors.Highlight
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor $Colors.Info
Write-Host ""

$backendPath = (Get-Location).Path + "\src\backend"
$frontendPath = (Get-Location).Path + "\src\frontend"
$projectRoot = (Get-Location).Path

# Script para el backend
$backendScript = @"
`$Host.UI.RawUI.WindowTitle = '🐍 Backend Server - Music App'
Clear-Host
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Magenta
Write-Host '   🐍 BACKEND SERVER (FastAPI + Uvicorn)' -ForegroundColor Magenta
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Magenta
Write-Host ''
Write-Host '📍 URL: http://127.0.0.1:8000' -ForegroundColor Cyan
Write-Host '📚 Docs: http://127.0.0.1:8000/docs' -ForegroundColor Cyan
Write-Host '🔄 Auto-reload: Activado' -ForegroundColor Green
Write-Host ''
Write-Host '💡 Presiona Ctrl+C para detener el servidor' -ForegroundColor Yellow
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Magenta
Write-Host ''

cd '$backendPath'

# Verificar si las dependencias están instaladas
try {
    python -c "import fastapi" 2>`$null
    if (`$LASTEXITCODE -ne 0) { throw }
} catch {
    Write-Host '⚠️  Dependencias no detectadas. Instalando...' -ForegroundColor Yellow
    pip install -r '$projectRoot\requirements.txt' --quiet --disable-pip-version-check
    Write-Host ''
}

Write-Host '🚀 Iniciando servidor...' -ForegroundColor Green
Write-Host ''

try {
    python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
} catch {
    Write-Host ''
    Write-Host '❌ Error al iniciar el backend' -ForegroundColor Red
    Write-Host `$_.Exception.Message -ForegroundColor Gray
    Write-Host ''
    Write-Host 'Presiona Enter para cerrar...' -ForegroundColor Yellow
    Read-Host
}
"@

# Script para el frontend
$frontendScript = @"
`$Host.UI.RawUI.WindowTitle = '⚛️  Frontend Server - Music App'
Clear-Host
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Blue
Write-Host '   ⚛️  FRONTEND SERVER (React + Vite)' -ForegroundColor Blue
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Blue
Write-Host ''
Write-Host '📍 URL: http://localhost:5173' -ForegroundColor Cyan
Write-Host '🔥 Hot Module Replacement: Activado' -ForegroundColor Green
Write-Host ''
Write-Host '💡 Presiona Ctrl+C para detener el servidor' -ForegroundColor Yellow
Write-Host '═══════════════════════════════════════════════════════════' -ForegroundColor Blue
Write-Host ''

cd '$frontendPath'

# Verificar si node_modules existe
if (-not (Test-Path 'node_modules')) {
    Write-Host '⚠️  node_modules no encontrado. Instalando dependencias...' -ForegroundColor Yellow
    & npm.cmd install
    Write-Host ''
}

Write-Host '🚀 Iniciando servidor...' -ForegroundColor Green
Write-Host ''

try {
    & npm.cmd run dev
} catch {
    Write-Host ''
    Write-Host '❌ Error al iniciar el frontend' -ForegroundColor Red
    Write-Host `$_.Exception.Message -ForegroundColor Gray
    Write-Host ''
    Write-Host 'Presiona Enter para cerrar...' -ForegroundColor Yellow
    Read-Host
}
"@

# Iniciar Backend
Write-ColorMessage "🐍 Iniciando Backend..." $Colors.Highlight
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript
Start-Sleep -Seconds 2

# Iniciar Frontend
Write-ColorMessage "⚛️  Iniciando Frontend..." $Colors.Highlight
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor $Colors.Success
Write-ColorMessage "✅ Servidores iniciados exitosamente!" $Colors.Success
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor $Colors.Success
Write-Host ""

Write-ColorMessage "📍 ACCESO A LA APLICACIÓN:" $Colors.Info
Write-Host ""
Write-Host "   🌐 Frontend (UI):    " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:5173" -ForegroundColor White
Write-Host "   🔌 Backend (API):    " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:8000" -ForegroundColor White
Write-Host "   📚 API Docs:         " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:8000/docs" -ForegroundColor White
Write-Host "   📖 ReDoc:            " -NoNewline -ForegroundColor Gray
Write-Host "http://localhost:8000/redoc" -ForegroundColor White
Write-Host ""

Write-ColorMessage "💡 CONSEJOS:" $Colors.Warning
Write-Host "   • Ambos servidores tienen auto-reload activado" -ForegroundColor Gray
Write-Host "   • Los cambios en el código se reflejarán automáticamente" -ForegroundColor Gray
Write-Host "   • Para detener: Cierra las ventanas o presiona Ctrl+C" -ForegroundColor Gray
Write-Host "   • Para reiniciar: Ejecuta .\stop.ps1 y luego .\start.ps1" -ForegroundColor Gray
Write-Host ""

Write-ColorMessage "🛠️  SCRIPTS DISPONIBLES:" $Colors.Info
Write-Host "   .\start.ps1                  - Iniciar servidores" -ForegroundColor Gray
Write-Host "   .\start.ps1 -InstallDeps     - Iniciar e instalar dependencias" -ForegroundColor Gray
Write-Host "   .\start.ps1 -Force           - Forzar inicio sin verificaciones" -ForegroundColor Gray
Write-Host "   .\stop.ps1                   - Detener todos los servidores" -ForegroundColor Gray
Write-Host "   .\status.ps1                 - Ver estado de los servidores" -ForegroundColor Gray
Write-Host "   .\migrate.ps1                - Ejecutar migraciones de BD" -ForegroundColor Gray
Write-Host ""
