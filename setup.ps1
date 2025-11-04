#!/usr/bin/env pwsh

Write-Host "🛠️  Setting up Music Streaming Application..." -ForegroundColor Green
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please update with your configuration." -ForegroundColor Green
}

Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
python -m venv venv

Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& "$projectRoot\venv\Scripts\Activate.ps1"

Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
pip install --upgrade pip
pip install -r requirements.txt

Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location "$projectRoot\src\frontend"
npm install

Set-Location $projectRoot

Write-Host ""
Write-Host "✅ Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env file with your PostgreSQL credentials"
Write-Host "2. Create the database: createdb music_app"
Write-Host "3. Run migrations: alembic upgrade head"
Write-Host "4. Start the application: .\start.ps1"
Write-Host ""
