# 🚀 Sprint 3 - Inicio Rápido

## Setup (Solo primera vez)
```powershell
.\setup.ps1
```

## Iniciar
```powershell
.\start-sprint3.ps1
```

## URLs
- Frontend: http://localhost:5176
- Backend: http://localhost:8003
- Docs: http://localhost:8003/docs

## Login
1. Ir a http://localhost:5176
2. Click en "Registrarse"
3. Crear cuenta nueva
4. O usar credenciales existentes de la BD principal

## ¿Problemas?
```powershell
# Limpiar y reinstalar
cd frontend
Remove-Item node_modules -Recurse -Force
npm install

cd ../backend
Remove-Item venv -Recurse -Force
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```
