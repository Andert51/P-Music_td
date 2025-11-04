#!/usr/bin/env pwsh

Write-Host "🔄 Running database migrations..." -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

& "$projectRoot\venv\Scripts\Activate.ps1"

Write-Host "Generating migration..." -ForegroundColor Yellow
alembic revision --autogenerate -m "Initial migration"

Write-Host "Applying migrations..." -ForegroundColor Yellow
alembic upgrade head

Write-Host ""
Write-Host "✅ Migrations completed!" -ForegroundColor Green
