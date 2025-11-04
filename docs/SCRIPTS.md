# 🎵 Music Streaming App - Guía de Scripts

## 📋 Índice
- [Descripción General](#descripción-general)
- [Scripts Disponibles](#scripts-disponibles)
- [Uso Rápido](#uso-rápido)
- [Guía Detallada](#guía-detallada)
- [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Descripción General

Este proyecto incluye un conjunto completo de scripts de automatización que facilitan el inicio, detención y monitoreo de la aplicación sin necesidad de ejecutar comandos manualmente o navegar entre directorios.

### ✨ Características

- ✅ **Inicio automático** de backend y frontend en terminales separadas
- ✅ **Auto-instalación** de dependencias si no están presentes
- ✅ **Detección de errores** y verificación de puertos
- ✅ **Auto-reload** activado en ambos servidores
- ✅ **Monitoreo de estado** de todos los servicios
- ✅ **Detención limpia** de todos los procesos

---

## 🛠️ Scripts Disponibles

### PowerShell Scripts (.ps1)

| Script | Descripción | Uso |
|--------|-------------|-----|
| `start.ps1` | Inicia backend y frontend con verificaciones | `.\start.ps1` |
| `stop.ps1` | Detiene todos los servicios | `.\stop.ps1` |
| `status.ps1` | Muestra el estado de la aplicación | `.\status.ps1` |
| `migrate.ps1` | Ejecuta migraciones de base de datos | `.\migrate.ps1` |
| `setup.ps1` | Configuración inicial del proyecto | `.\setup.ps1` |

### Batch Scripts (.bat)

| Script | Descripción | Uso |
|--------|-------------|-----|
| `start.bat` | Ejecuta start.ps1 (doble clic) | Doble clic o `start.bat` |
| `stop.bat` | Ejecuta stop.ps1 (doble clic) | Doble clic o `stop.bat` |
| `status.bat` | Ejecuta status.ps1 (doble clic) | Doble clic o `status.bat` |

---

## 🚀 Uso Rápido

### Iniciar la Aplicación

**Opción 1: Doble clic (más fácil)**
```
1. Doble clic en start.bat
2. Espera a que abran dos terminales (Backend y Frontend)
3. ¡Listo! Accede a http://localhost:5173
```

**Opción 2: PowerShell**
```powershell
.\start.ps1
```

**Opción 3: Con instalación de dependencias**
```powershell
.\start.ps1 -InstallDeps
```

**Opción 4: Sin verificaciones (inicio rápido)**
```powershell
.\start.ps1 -SkipChecks
```

**Opción 5: Forzar inicio (ignorar puertos ocupados)**
```powershell
.\start.ps1 -Force
```

### Detener la Aplicación

**Opción 1: Doble clic**
```
Doble clic en stop.bat
```

**Opción 2: PowerShell**
```powershell
.\stop.ps1
```

**Opción 3: Manual**
```
Presiona Ctrl+C en cada terminal (Backend y Frontend)
```

### Verificar Estado

**Opción 1: Doble clic**
```
Doble clic en status.bat
```

**Opción 2: PowerShell**
```powershell
.\status.ps1
```

---

## 📖 Guía Detallada

### 1. start.ps1 - Script de Inicio

#### Funcionalidades

1. **Verificaciones Iniciales**
   - ✅ Confirma que estás en el directorio correcto
   - ✅ Verifica Python, Node.js y npm instalados
   - ✅ Comprueba que los puertos 8000 y 5173 estén libres
   - ✅ Valida archivos de configuración críticos (.env, main.py, etc.)

2. **Instalación de Dependencias** (opcional con `-InstallDeps`)
   - 🐍 Instala paquetes de Python desde requirements.txt
   - ⚛️ Instala paquetes de Node.js desde package.json

3. **Inicio de Servidores**
   - 🐍 **Backend**: FastAPI + Uvicorn en http://localhost:8000
   - ⚛️ **Frontend**: React + Vite en http://localhost:5173
   - Cada uno en su propia terminal con auto-reload activado

#### Parámetros

```powershell
# Sin verificaciones (inicio más rápido)
.\start.ps1 -SkipChecks

# Instalar dependencias automáticamente
.\start.ps1 -InstallDeps

# Forzar inicio incluso si puertos están ocupados
.\start.ps1 -Force

# Combinar parámetros
.\start.ps1 -InstallDeps -SkipChecks
```

#### Salida Esperada

```
═══════════════════════════════════════════════════════════
   🎵 MUSIC STREAMING APP - STARTUP SCRIPT
═══════════════════════════════════════════════════════════

✅ 📂 Directorio del proyecto verificado

🔍 Verificando dependencias del sistema...

✅ Python: Python 3.12.7
✅ Node.js: v23.4.0
✅ npm: v10.9.2

🔌 Verificando puertos disponibles...
✅ Puerto 8000 (Backend) disponible
✅ Puerto 5173 (Frontend) disponible

📋 Verificando archivos de configuración...
✅ Variables de entorno
✅ Backend main
✅ Frontend package.json
✅ Alembic config

═══════════════════════════════════════════════════════════
   🚀 Iniciando servidores...
═══════════════════════════════════════════════════════════

🐍 Iniciando Backend...
⚛️  Iniciando Frontend...

═══════════════════════════════════════════════════════════
✅ Servidores iniciados exitosamente!
═══════════════════════════════════════════════════════════

📍 ACCESO A LA APLICACIÓN:

   🌐 Frontend (UI):    http://localhost:5173
   🔌 Backend (API):    http://localhost:8000
   📚 API Docs:         http://localhost:8000/docs
   📖 ReDoc:            http://localhost:8000/redoc

💡 CONSEJOS:
   • Ambos servidores tienen auto-reload activado
   • Los cambios en el código se reflejarán automáticamente
   • Para detener: Cierra las ventanas o presiona Ctrl+C
   • Para reiniciar: Ejecuta .\stop.ps1 y luego .\start.ps1
```

---

### 2. stop.ps1 - Script de Detención

#### Funcionalidades

- 🔍 Busca todos los procesos relacionados (Python/Uvicorn, Node/Vite)
- 🔌 Verifica procesos usando los puertos 8000 y 5173
- 🛑 Detiene todos los procesos encontrados de forma segura
- 📊 Reporta cuántos procesos fueron detenidos

#### Uso

```powershell
.\stop.ps1
```

#### Salida Esperada

```
═══════════════════════════════════════════════════════════
   🛑 MUSIC STREAMING APP - STOP SCRIPT
═══════════════════════════════════════════════════════════

🔍 Buscando procesos de la aplicación...

🐍 Deteniendo Backend (Python/Uvicorn)...
   ✅ Proceso 21668 detenido

⚛️  Deteniendo Frontend (Node/Vite)...
   ✅ Proceso 19234 detenido

🔌 Verificando puertos...
   ✅ Puerto 8000 libre
   ✅ Puerto 5173 libre

═══════════════════════════════════════════════════════════
✅ 2 proceso(s) detenido(s) exitosamente

💡 Puedes iniciar nuevamente con: .\start.ps1
```

---

### 3. status.ps1 - Script de Estado

#### Funcionalidades

1. **Estado de Procesos**
   - 🐍 Backend (Python/Uvicorn)
   - ⚛️ Frontend (Node/Vite)
   - Muestra PID y uso de RAM de cada proceso

2. **Estado de Puertos**
   - Puerto 8000 (Backend API)
   - Puerto 5173 (Frontend)
   - Identifica qué proceso está usando cada puerto

3. **Verificación de Conectividad**
   - Hace peticiones HTTP a ambos servicios
   - Muestra códigos de respuesta
   - Detecta si los servicios están respondiendo correctamente

4. **Configuración de Base de Datos**
   - Verifica existencia del archivo .env
   - Muestra la cadena de conexión configurada

5. **Resumen General**
   - Estado global del sistema
   - URLs de acceso si todo está operativo

#### Uso

```powershell
.\status.ps1
```

#### Salida Esperada

```
═══════════════════════════════════════════════════════════
   📊 MUSIC STREAMING APP - STATUS CHECK
═══════════════════════════════════════════════════════════

🔍 ESTADO DE PROCESOS
─────────────────────────────────────────────────────────────

🐍 Backend (Python/Uvicorn):  ACTIVO ✅
   PID: 21668 | RAM: 45.23 MB

⚛️  Frontend (Node/Vite):      ACTIVO ✅
   PID: 19234 | RAM: 78.56 MB


🔌 ESTADO DE PUERTOS
─────────────────────────────────────────────────────────────

Puerto 8000 (Backend API):    ABIERTO ✅
   Proceso: python (PID: 21668)

Puerto 5173 (Frontend):       ABIERTO ✅
   Proceso: node (PID: 19234)


🌐 VERIFICACIÓN DE CONECTIVIDAD
─────────────────────────────────────────────────────────────

Backend API (http://localhost:8000):        RESPONDIENDO ✅
   Código de respuesta: 200

Frontend (http://localhost:5173):           RESPONDIENDO ✅
   Código de respuesta: 200


💾 CONFIGURACIÓN DE BASE DE DATOS
─────────────────────────────────────────────────────────────

Archivo .env:                 ENCONTRADO ✅
   DATABASE_URL=postgresql://postgres:05018583@localhost:5432/music_app


═══════════════════════════════════════════════════════════
   📊 RESUMEN
═══════════════════════════════════════════════════════════

✅ Estado general: TODO OPERATIVO

🌐 Acceso:
   Frontend:  http://localhost:5173
   Backend:   http://localhost:8000
   API Docs:  http://localhost:8000/docs
```

---

### 4. migrate.ps1 - Script de Migraciones

Ejecuta las migraciones de base de datos con Alembic.

```powershell
.\migrate.ps1
```

---

### 5. setup.ps1 - Script de Configuración Inicial

Realiza la configuración inicial completa del proyecto.

```powershell
.\setup.ps1
```

---

## 🔧 Solución de Problemas

### Problema: "No se pueden ejecutar scripts en este sistema"

**Error:**
```
File C:\...\script.ps1 cannot be loaded because running scripts is disabled
```

**Solución 1: Usar archivos .bat**
```
Usa start.bat, stop.bat o status.bat en lugar de los .ps1
```

**Solución 2: Cambiar política de ejecución (una vez)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### Problema: Puerto 8000 o 5173 ya está en uso

**Solución 1: Usar stop.ps1**
```powershell
.\stop.ps1
.\start.ps1
```

**Solución 2: Forzar inicio**
```powershell
.\start.ps1 -Force
```

**Solución 3: Manual**
```powershell
# Encontrar proceso en puerto 8000
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess
Stop-Process -Id <PID>

# Encontrar proceso en puerto 5173
Get-NetTCPConnection -LocalPort 5173 | Select-Object OwningProcess
Stop-Process -Id <PID>
```

---

### Problema: Dependencias faltantes

**Síntoma:**
```
ModuleNotFoundError: No module named 'fastapi'
Error: Cannot find module 'vite'
```

**Solución:**
```powershell
.\start.ps1 -InstallDeps
```

O manualmente:
```powershell
# Backend
cd src/backend
pip install -r ../../requirements.txt

# Frontend
cd src/frontend
npm install
```

---

### Problema: Error de conexión a la base de datos

**Síntoma:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en el archivo `.env`
3. Verifica que la base de datos `music_app` exista

```powershell
# Ver configuración actual
.\status.ps1

# Verificar archivo .env
Get-Content .env | Select-String "DATABASE_URL"
```

---

### Problema: Frontend muestra error de proxy

**Síntoma:**
```
[vite] http proxy error: ECONNREFUSED
```

**Causa:** El backend no está corriendo

**Solución:**
1. Verifica que el backend esté activo: `.\status.ps1`
2. Reinicia ambos servicios: `.\stop.ps1` y `.\start.ps1`

---

### Problema: Cambios en el código no se reflejan

**Solución:**
- El auto-reload está activado por defecto
- Si no funciona, reinicia el servidor específico (Ctrl+C y vuelve a iniciar)
- O reinicia todo: `.\stop.ps1` y `.\start.ps1`

---

## 📚 URLs Importantes

Una vez iniciada la aplicación:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interfaz de usuario principal |
| **Backend API** | http://localhost:8000 | API REST |
| **API Docs (Swagger)** | http://localhost:8000/docs | Documentación interactiva |
| **ReDoc** | http://localhost:8000/redoc | Documentación alternativa |

---

## 💡 Tips y Mejores Prácticas

### Flujo de Trabajo Recomendado

1. **Primera vez:**
   ```powershell
   .\setup.ps1          # Configuración inicial
   .\migrate.ps1        # Crear tablas en BD
   .\start.ps1 -InstallDeps  # Instalar todo e iniciar
   ```

2. **Día a día:**
   ```powershell
   .\start.ps1          # Iniciar
   # ... trabajar ...
   .\stop.ps1           # Detener al finalizar
   ```

3. **Verificar estado:**
   ```powershell
   .\status.ps1         # Ver estado completo
   ```

4. **Después de hacer pull:**
   ```powershell
   .\start.ps1 -InstallDeps  # Por si hay nuevas dependencias
   ```

### Atajos de Teclado

- **Detener servidor:** `Ctrl + C` en la terminal del servidor
- **Cerrar terminal:** `Ctrl + C` y luego cerrar ventana

### Monitoreo de Logs

Los logs se muestran en tiempo real en cada terminal:
- **Backend:** Solicitudes HTTP, errores de Python, operaciones de BD
- **Frontend:** Compilación de componentes, HMR updates, errores de JavaScript

---

## 🎯 Comandos de Referencia Rápida

```powershell
# INICIO
.\start.ps1                      # Inicio normal
.\start.ps1 -InstallDeps         # Con instalación de dependencias
.\start.ps1 -SkipChecks          # Inicio rápido sin verificaciones
.\start.ps1 -Force               # Forzar inicio

# DETENCIÓN
.\stop.ps1                       # Detener todo

# ESTADO
.\status.ps1                     # Ver estado completo

# MIGRACIONES
.\migrate.ps1                    # Ejecutar migraciones

# ALTERNATIVAS (archivos .bat - doble clic)
start.bat                        # Iniciar
stop.bat                         # Detener
status.bat                       # Ver estado
```

---

## 📞 Soporte

Si encuentras problemas no cubiertos en esta guía:

1. Ejecuta `.\status.ps1` para ver el estado del sistema
2. Revisa los logs en las terminales de backend y frontend
3. Verifica el archivo `.env` y las credenciales de la base de datos
4. Asegúrate de tener Python 3.12+ y Node.js 18+ instalados

---

## 🔄 Actualización de Scripts

Los scripts se actualizan automáticamente cuando haces pull del repositorio. No es necesario ninguna acción adicional.

---

**¡Listo para desarrollar! 🚀**
