# 🎵 P-Music TD - Music Streaming Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.12.7-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com/)

Una plataforma de streaming de música moderna y completa, desarrollada como proyecto educativo utilizando metodología **Scrum** en **4 sprints iterativos**. Actualmente en **Sprint 3**, implementando búsqueda avanzada, gestión de álbumes y sistema de carga de contenido.

---

## 📑 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Stack Tecnológico](#-stack-tecnológico)
- [Características Principales](#-características-principales)
- [Metodología de Desarrollo](#-metodología-de-desarrollo)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Sistema de Base de Datos](#-sistema-de-base-de-datos)
- [Autenticación y Seguridad](#-autenticación-y-seguridad)
- [API Documentation](#-api-documentation)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🎯 Descripción General

**P-Music TD** es una plataforma de streaming de música full-stack que emula las funcionalidades de servicios comerciales modernos. El proyecto está diseñado con una arquitectura escalable, implementando patrones de diseño profesionales y mejores prácticas de desarrollo de software.

### Objetivos del Proyecto

- **Aprendizaje Práctico**: Implementar conceptos avanzados de desarrollo web full-stack
- **Arquitectura Escalable**: Diseño modular que permite crecimiento y mantenimiento
- **Metodología Ágil**: Desarrollo iterativo con Scrum en 4 sprints
- **Open Source**: Código abierto para la comunidad de desarrolladores

### Estado Actual: Sprint 3

✅ **Sprint 1**: Autenticación y reproducción básica  
✅ **Sprint 2**: Playlists y gestión de favoritos  
🚧 **Sprint 3**: Búsqueda, álbumes y sistema de carga (EN DESARROLLO)  
📋 **Sprint 4**: Dashboard de administración y analíticas, rediseño total de la UI (PLANEADO)

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa una **arquitectura de tres capas (Three-Tier Architecture)** con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  React 18 + TypeScript + Vite + Tailwind CSS + Zustand     │
│              (Puerto: 5173 - Proyecto Principal)            │
│              (Puerto: 517X - Sprints MVP)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API (Axios)
                       │ JSON + JWT Tokens
┌──────────────────────▼──────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│        FastAPI + Pydantic + SQLAlchemy + Uvicorn            │
│              (Puerto: 8000 - Proyecto Principal)            │
│              (Puerto: 800X - Sprints MVP)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQLAlchemy ORM
                       │ Alembic Migrations
┌──────────────────────▼──────────────────────────────────────┐
│                      DATA LAYER                              │
│              PostgreSQL 16 + Alembic Migrations             │
│              Database: music_app (Compartida)               │
└─────────────────────────────────────────────────────────────┘
```

### Principios Arquitectónicos

- **Separation of Concerns**: Cada capa tiene responsabilidades bien definidas
- **RESTful API Design**: Endpoints semánticos y estandarizados
- **Stateless Authentication**: JWT para autenticación sin estado
- **ORM Pattern**: SQLAlchemy para abstracción de base de datos
- **Component-Based UI**: React con componentes reutilizables
- **State Management**: Zustand para manejo global de estado

---

## 🛠️ Stack Tecnológico

### Backend Stack

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Python** | 3.12.7+ | Lenguaje de programación principal |
| **FastAPI** | 0.109.0 | Framework web ASGI de alto rendimiento |
| **SQLAlchemy** | 2.0.25 | ORM para manejo de base de datos |
| **Alembic** | 1.13.1 | Sistema de migraciones de base de datos |
| **PostgreSQL** | 16+ | Base de datos relacional |
| **Pydantic** | 2.5.3 | Validación de datos y serialización |
| **Uvicorn** | 0.27.0 | Servidor ASGI |
| **python-jose** | 3.3.0 | Manejo de JWT tokens |
| **passlib** | 1.7.4 | Hash de contraseñas con bcrypt |

### Frontend Stack

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **React** | 18.2.0 | Biblioteca UI declarativa |
| **TypeScript** | 5.2.2 | Superset tipado de JavaScript |
| **Vite** | 5.0.8 | Build tool y dev server ultra-rápido |
| **Tailwind CSS** | 3.4.0 | Framework CSS utility-first |
| **Framer Motion** | 10.18.0 | Biblioteca de animaciones |
| **Zustand** | 4.4.7 | State management minimalista |
| **React Router** | 6.21.1 | Enrutamiento del lado del cliente |
| **Axios** | 1.6.5 | Cliente HTTP para API calls |
| **Howler.js** | 2.2.4 | Reproductor de audio Web Audio API |
| **Lucide React** | 0.303.0 | Iconos SVG optimizados |

### DevOps & Tools

- **Git**: Control de versiones
- **PowerShell**: Scripts de automatización
- **Alembic**: Migraciones de base de datos
- **ESLint**: Linting de código TypeScript
- **PostCSS**: Procesamiento de CSS

---

## ✨ Características Principales

### 🎵 Reproducción de Música

- **Reproductor Full-Featured**: Controles de play/pause, siguiente/anterior, shuffle, repeat
- **Seek Bar**: Barra de progreso interactiva con tiempo real
- **Control de Volumen**: Ajuste de volumen con mute
- **Gestión de Cola**: Queue automático con gestión dinámica
- **Now Playing Panel**: Panel lateral mostrando canción actual y cola

### 🔐 Autenticación y Autorización

- **JWT Authentication**: Tokens seguros con expiración configurable
- **Role-Based Access Control (RBAC)**: 4 niveles de acceso
  - `user`: Usuario estándar (streaming básico)
  - `premium`: Usuario premium (sin publicidad, características extra)
  - `creator`: Creador de contenido (subida de música/álbumes)
  - `admin`: Administrador (gestión completa del sistema)
- **Password Hashing**: Bcrypt con salting automático
- **Protected Routes**: Middleware de autenticación en backend y frontend

### 📚 Gestión de Contenido

- **Álbumes**: Organización de canciones en álbumes con portadas
- **Playlists**: Creación y edición de playlists personalizadas
- **Favoritos**: Sistema de "me gusta" para canciones
- **Upload System**: Carga de archivos de audio con validación (creators)
- **Content Approval**: Sistema de aprobación de contenido por administradores

### 🔍 Búsqueda Avanzada

- **Full-Text Search**: Búsqueda por título y artista usando ILIKE (PostgreSQL)
- **Filtros Dinámicos**: Por álbum, género, aprobación
- **Ordenamiento**: Por reproducción, fecha, título
- **Real-Time Results**: Resultados instantáneos sin delay

### 🎨 Interfaz de Usuario

- **Diseño Moderno**: UI inspirada en Spotify con tema oscuro
- **Responsive Design**: Adaptable a desktop, tablet y mobile
- **Animaciones Suaves**: Framer Motion para transiciones fluidas
- **Gradient Themes**: Paleta de colores purple/pink moderna
- **Custom Scrollbars**: Scrollbars personalizados con estilo uniforme

---

## 📊 Metodología de Desarrollo

El proyecto se desarrolló utilizando **metodología Scrum** con sprints de 2 semanas cada uno:

### Sprint 1: Fundamentos y Autenticación ✅

**Duración**: 2 semanas  
**Objetivo**: Establecer la arquitectura base y sistema de autenticación

**Entregables**:
- ✅ Configuración de proyecto (backend + frontend)
- ✅ Base de datos PostgreSQL con Alembic
- ✅ Sistema de autenticación JWT completo
- ✅ Registro e inicio de sesión
- ✅ Reproductor básico de música
- ✅ Listado de canciones aprobadas
- ✅ Diseño base de UI con Tailwind

**Endpoints**: `/mvp/sprint1/*`  
**Puerto Backend**: 8001  
**Puerto Frontend**: 5174

---

### Sprint 2: Playlists y Favoritos ✅

**Duración**: 2 semanas  
**Objetivo**: Implementar gestión de playlists y sistema de favoritos

**Entregables**:
- ✅ Creación y edición de playlists
- ✅ Sistema de "me gusta" en canciones
- ✅ Página de canciones favoritas
- ✅ Player mejorado con cola dinámica
- ✅ Página de detalle de playlist
- ✅ UI/UX mejorada con animaciones

**Endpoints**: `/mvp/sprint2/*`  
**Puerto Backend**: 8002  
**Puerto Frontend**: 5175

---

### Sprint 3: Búsqueda, Álbumes y Upload 🚧 (EN DESARROLLO)

**Duración**: 2 semanas  
**Objetivo**: Implementar búsqueda avanzada, sistema de álbumes y carga de contenido

**Entregables**:
- ✅ Búsqueda full-text con filtros
- ✅ Página de álbumes funcional
- ✅ Detalle de álbum con canciones
- ✅ Now Playing Panel (sidebar derecho)
- ✅ Páginas placeholder (Favoritas, Playlists)
- ✅ Botones de acción (like, add to playlist)
- 🚧 Sistema de upload de canciones (UI completo)
- 🚧 Upload de álbumes completos
- 🚧 Validación de archivos de audio

**Endpoints**: `/mvp/sprint3/*`  
**Puerto Backend**: 8003  
**Puerto Frontend**: 5176

**Características Técnicas**:
- Search con PostgreSQL ILIKE
- Múltiples filtros (álbum, aprobación, orden)
- Lazy loading de álbumes
- UI makeover con gradientes y animaciones

---

### Sprint 4: Admin Dashboard y Analytics 📋 (PLANEADO)

**Duración**: 2 semanas  
**Objetivo**: Panel de administración completo y sistema de analíticas

**Entregables Planeados**:
- 📋 Dashboard de administrador
- 📋 Sistema de aprobación de contenido
- 📋 Estadísticas de reproducción
- 📋 Gestión de usuarios
- 📋 Reportes y analíticas
- 📋 Sistema de notificaciones
- 📋 Moderación de contenido

**Endpoints**: `/mvp/sprint4/*` (planeado)  
**Puerto Backend**: 8004 (planeado)  
**Puerto Frontend**: 5177 (planeado)

---

## 📁 Estructura del Proyecto

```
P_Music-td/
├── docs/                           # Documentación técnica
│   ├── README.md                   # Documentación principal (este archivo)
│   └── ARCHITECTURE.md             # Detalles de arquitectura
│
├── MVP/                            # Sprints de desarrollo incremental
│   ├── sprint-1/                   # Sprint 1: Autenticación + Player básico
│   │   ├── backend/                # API FastAPI (puerto 8001)
│   │   ├── frontend/               # React App (puerto 5174)
│   │   ├── setup.ps1               # Script de instalación
│   │   └── start-sprint1.ps1       # Script de inicio
│   │
│   ├── sprint-2/                   # Sprint 2: Playlists + Favoritos
│   │   ├── backend/                # API FastAPI (puerto 8002)
│   │   ├── frontend/               # React App (puerto 5175)
│   │   ├── setup.ps1               # Script de instalación
│   │   └── start-sprint2.ps1       # Script de inicio
│   │
│   └── sprint-3/                   # Sprint 3: Búsqueda + Álbumes + Upload
│       ├── routers/                # Routers FastAPI
│       ├── frontend/               # React App (puerto 5176)
│       ├── main.py                 # Entry point backend (puerto 8003)
│       ├── database.py             # Configuración de base de datos
│       ├── models.py               # Modelos SQLAlchemy
│       ├── schemas.py              # Pydantic schemas
│       ├── setup.ps1               # Script de instalación
│       └── start-sprint3.ps1       # Script de inicio
│
├── src/                            # Proyecto principal (producción)
│   ├── backend/                    # Backend FastAPI principal
│   │   ├── routes/                 # Endpoints organizados por recurso
│   │   │   ├── auth.py             # Autenticación y registro
│   │   │   ├── users.py            # Gestión de usuarios
│   │   │   ├── songs.py            # Operaciones de canciones
│   │   │   ├── playlists.py        # Gestión de playlists
│   │   │   ├── albums.py           # Gestión de álbumes
│   │   │   └── upload.py           # Sistema de carga
│   │   ├── models/                 # Modelos de base de datos
│   │   │   └── __init__.py         # User, Song, Album, Playlist
│   │   ├── scripts/                # Scripts de utilidad
│   │   ├── uploads/                # Archivos subidos (audio/imágenes)
│   │   ├── auth.py                 # Utilities de autenticación
│   │   ├── config.py               # Configuración de aplicación
│   │   ├── database.py             # Setup de SQLAlchemy
│   │   ├── dependencies.py         # FastAPI dependencies
│   │   ├── schemas.py              # Pydantic schemas
│   │   └── main.py                 # Entry point (puerto 8000)
│   │
│   └── frontend/                   # Frontend React principal
│       ├── src/
│       │   ├── components/         # Componentes reutilizables
│       │   │   ├── Layout.tsx      # Layout principal
│       │   │   ├── Sidebar.tsx     # Navegación lateral
│       │   │   ├── Player.tsx      # Reproductor de música
│       │   │   └── NowPlayingPanel.tsx  # Panel "Now Playing"
│       │   ├── pages/              # Páginas de la aplicación
│       │   │   ├── Home.tsx        # Dashboard principal
│       │   │   ├── Login.tsx       # Página de login
│       │   │   ├── Register.tsx    # Página de registro
│       │   │   ├── Search.tsx      # Búsqueda avanzada
│       │   │   ├── Albums.tsx      # Listado de álbumes
│       │   │   ├── AlbumDetail.tsx # Detalle de álbum
│       │   │   ├── Playlists.tsx   # Gestión de playlists
│       │   │   ├── LikedSongs.tsx  # Canciones favoritas
│       │   │   └── UploadSong.tsx  # Upload de contenido
│       │   ├── store/              # Zustand state management
│       │   │   ├── authStore.ts    # Estado de autenticación
│       │   │   └── playerStore.ts  # Estado del reproductor
│       │   ├── lib/                # Utilities y helpers
│       │   │   └── api.ts          # Cliente Axios configurado
│       │   ├── types/              # TypeScript interfaces
│       │   ├── App.tsx             # Componente raíz
│       │   └── main.tsx            # Entry point
│       ├── package.json            # Dependencias npm
│       ├── tsconfig.json           # Configuración TypeScript
│       ├── vite.config.ts          # Configuración Vite
│       └── tailwind.config.js      # Configuración Tailwind
│
├── alembic/                        # Migraciones de base de datos
│   ├── versions/                   # Archivos de migración
│   └── env.py                      # Configuración de Alembic
│
├── scripts/                        # Scripts de automatización
│   ├── setup.ps1                   # Setup completo del proyecto
│   ├── start.ps1                   # Iniciar backend y frontend
│   ├── stop.ps1                    # Detener servicios
│   └── migrate.ps1                 # Ejecutar migraciones
│
├── .env                            # Variables de entorno
├── alembic.ini                     # Configuración de Alembic
├── requirements.txt                # Dependencias Python
└── README.md                       # README general del proyecto
```

### Organización de Código

**Backend (FastAPI)**:
- **Routers**: Cada endpoint organizado por recurso (auth, users, songs, etc.)
- **Models**: Modelos SQLAlchemy representando tablas de BD
- **Schemas**: Pydantic schemas para validación y serialización
- **Dependencies**: Funciones reutilizables para inyección de dependencias
- **Config**: Configuración centralizada con variables de entorno

**Frontend (React)**:
- **Components**: Componentes reutilizables y atómicos
- **Pages**: Componentes de página completa
- **Store**: State management con Zustand
- **Lib**: Utilities, helpers y configuraciones
- **Types**: Interfaces y tipos TypeScript

---

## 🚀 Instalación y Configuración

### Prerequisitos

Asegúrate de tener instaladas las siguientes herramientas:

- **Python**: 3.12.7 o superior → [Descargar](https://www.python.org/downloads/)
- **Node.js**: 18+ y npm → [Descargar](https://nodejs.org/)
- **PostgreSQL**: 16+ → [Descargar](https://www.postgresql.org/download/)
- **Git**: Control de versiones → [Descargar](https://git-scm.com/)

### Clonar el Repositorio

```powershell
git clone https://github.com/Andert51/P-Music_td.git
cd P-Music_td
```

### Configuración de Base de Datos

1. **Crear base de datos PostgreSQL**:

```sql
CREATE DATABASE music_app;
```

2. **Configurar variables de entorno** (`.env` en raíz del proyecto):

```env
# Database
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/music_app
DB_HOST=localhost
DB_PORT=5432
DB_NAME=music_app
DB_USER=postgres
DB_PASSWORD=tu_password

# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# JWT
SECRET_KEY=tu_secret_key_super_segura_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:5173
```

### Instalación del Proyecto Principal

#### Opción 1: Script Automático (Recomendado)

```powershell
# Instalar y configurar todo automáticamente
.\scripts\setup.ps1
```

#### Opción 2: Instalación Manual

**Backend**:

```powershell
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
alembic upgrade head

# Iniciar servidor
cd src/backend
uvicorn main:app --reload --port 8000
```

**Frontend**:

```powershell
# Instalar dependencias
cd src/frontend
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Instalación de Sprints MVP

Cada sprint tiene su propio script de instalación:

```powershell
# Sprint 1
cd MVP/sprint-1
.\setup.ps1
.\start-sprint1.ps1

# Sprint 2
cd MVP/sprint-2
.\setup.ps1
.\start-sprint2.ps1

# Sprint 3 (Actual)
cd MVP/sprint-3
.\setup.ps1
.\start-sprint3.ps1
```

### Iniciar la Aplicación

**Proyecto Principal**:

```powershell
# Opción 1: Script automático (inicia backend y frontend)
.\scripts\start.ps1

# Opción 2: Manual
# Terminal 1 - Backend
cd src/backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd src/frontend
npm run dev
```

**Acceso**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Documentación Swagger: http://localhost:8000/docs
- Documentación ReDoc: http://localhost:8000/redoc

---

## 🗄️ Sistema de Base de Datos

### Modelos de Datos

#### User Model

```python
class User(Base):
    id: int (PK)
    email: str (unique, indexed)
    username: str (unique, indexed)
    full_name: str
    hashed_password: str
    role: str (user, premium, creator, admin)
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    playlists: List[Playlist]
    albums: List[Album]
    songs: List[Song]
    liked_songs: List[Song]
```

#### Song Model

```python
class Song(Base):
    id: int (PK)
    title: str (indexed)
    artist: str (indexed)
    album_id: int (FK -> Album) (nullable)
    genre: str
    duration: int (seconds)
    file_path: str (unique)
    cover_path: str (nullable)
    play_count: int (default=0)
    approved: bool (default=False)
    creator_id: int (FK -> User)
    created_at: datetime
    
    # Relationships
    album: Album
    creator: User
    playlists: List[Playlist]
    liked_by: List[User]
```

#### Album Model

```python
class Album(Base):
    id: int (PK)
    title: str
    artist: str
    cover_path: str (nullable)
    release_year: int
    approved: bool (default=False)
    creator_id: int (FK -> User)
    created_at: datetime
    
    # Relationships
    creator: User
    songs: List[Song]
```

#### Playlist Model

```python
class Playlist(Base):
    id: int (PK)
    name: str
    description: str (nullable)
    cover_path: str (nullable)
    is_public: bool (default=False)
    owner_id: int (FK -> User)
    created_at: datetime
    updated_at: datetime
    
    # Relationships
    owner: User
    songs: List[Song]  # Many-to-Many
```

### Relaciones

```
User 1 ──────── N Playlist
User 1 ──────── N Album
User 1 ──────── N Song (as creator)
User N ──────── N Song (as liked_by)

Album 1 ──────── N Song

Playlist N ──────── N Song
```

### Migraciones con Alembic

```powershell
# Crear nueva migración
alembic revision --autogenerate -m "Descripción del cambio"

# Aplicar migraciones
alembic upgrade head

# Revertir última migración
alembic downgrade -1

# Ver historial
alembic history

# Ver estado actual
alembic current
```

---

## 🔐 Autenticación y Seguridad

### Flow de Autenticación

```
1. Usuario envía credenciales (email/username + password)
   POST /auth/login
   
2. Backend valida credenciales:
   - Busca usuario en base de datos
   - Verifica password hasheado con bcrypt
   
3. Si es válido, genera JWT token:
   - Payload: { sub: user_id, role: user_role }
   - Expiración: 30 minutos (configurable)
   - Algoritmo: HS256
   
4. Token retornado al cliente:
   { access_token: "eyJ0eXAiOiJKV1QiLCJhbGc...", token_type: "bearer" }
   
5. Cliente almacena token (Zustand store)

6. Requests subsecuentes incluyen token:
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
   
7. Backend valida token en cada request:
   - Verifica firma
   - Verifica expiración
   - Extrae user_id y role
```

### Hashing de Contraseñas

```python
# Usando bcrypt a través de passlib
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
hashed = pwd_context.hash("plain_password")

# Verify password
is_valid = pwd_context.verify("plain_password", hashed)
```

### Protección de Rutas

**Backend (FastAPI Dependencies)**:

```python
from dependencies import get_current_user, require_role

# Ruta protegida (usuario autenticado)
@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

# Ruta con rol específico
@router.post("/songs/approve/{song_id}")
async def approve_song(
    song_id: int,
    admin: User = Depends(require_role("admin"))
):
    # Solo admins pueden aprobar canciones
    pass
```

**Frontend (React Router)**:

```typescript
// ProtectedRoute component
function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
}

// Uso en App.tsx
<Route 
  path="/upload" 
  element={
    <ProtectedRoute allowedRoles={["creator", "admin"]}>
      <UploadSong />
    </ProtectedRoute>
  } 
/>
```

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **user** | - Reproducir canciones aprobadas<br>- Crear playlists<br>- Dar "me gusta"<br>- Gestionar cuenta |
| **premium** | - Todo lo de user<br>- Sin publicidad<br>- Calidad de audio superior<br>- Downloads offline |
| **creator** | - Todo lo de premium<br>- Subir canciones<br>- Crear álbumes<br>- Ver estadísticas de reproducciones |
| **admin** | - Acceso completo<br>- Aprobar contenido<br>- Gestionar usuarios<br>- Moderar contenido<br>- Ver analíticas |

---

## 📡 API Documentation

### Endpoints Principales

#### Authentication

```http
POST /auth/register
POST /auth/login
GET  /auth/me
POST /auth/refresh
```

#### Users

```http
GET    /users/me
PUT    /users/me
DELETE /users/me
GET    /users/{user_id}
```

#### Songs

```http
GET    /songs                    # Listar canciones (con filtros)
GET    /songs/{song_id}          # Detalle de canción
POST   /songs                    # Crear canción (creator)
PUT    /songs/{song_id}          # Actualizar canción
DELETE /songs/{song_id}          # Eliminar canción
POST   /songs/{song_id}/like     # Dar me gusta
DELETE /songs/{song_id}/like     # Quitar me gusta
GET    /songs/liked              # Canciones favoritas
```

**Query Parameters para /songs**:

```
?search=query         # Búsqueda por título/artista
?album_id=1          # Filtrar por álbum
?genre=rock          # Filtrar por género
?approved_only=true  # Solo canciones aprobadas
?order_by=play_count # Ordenar (play_count, created_at, title)
?limit=50            # Límite de resultados
```

#### Albums

```http
GET    /albums                   # Listar álbumes
GET    /albums/{album_id}        # Detalle de álbum
POST   /albums                   # Crear álbum (creator)
PUT    /albums/{album_id}        # Actualizar álbum
DELETE /albums/{album_id}        # Eliminar álbum
GET    /albums/{album_id}/songs  # Canciones del álbum
```

#### Playlists

```http
GET    /playlists                    # Listar playlists del usuario
GET    /playlists/{playlist_id}      # Detalle de playlist
POST   /playlists                    # Crear playlist
PUT    /playlists/{playlist_id}      # Actualizar playlist
DELETE /playlists/{playlist_id}      # Eliminar playlist
POST   /playlists/{id}/songs/{song_id}   # Agregar canción
DELETE /playlists/{id}/songs/{song_id}   # Quitar canción
```

#### Upload

```http
POST /upload/song       # Subir archivo de audio
POST /upload/cover      # Subir imagen de portada
```

### Documentación Interactiva

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🎨 Frontend Architecture

### State Management (Zustand)

**Auth Store**:

```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}
```

**Player Store**:

```typescript
interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  currentTime: number;
  duration: number;
  
  play: (song: Song) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  addToQueue: (song: Song) => void;
}
```

### Routing Structure

```
/ ────────────────────── Home (Dashboard principal)
/login ─────────────────  Login (Autenticación)
/register ──────────────  Register (Registro de usuario)
/search ────────────────  Search (Búsqueda avanzada)
/albums ────────────────  Albums (Listado de álbumes)
/albums/:id ────────────  AlbumDetail (Detalle de álbum)
/playlists ─────────────  Playlists (Gestión de playlists)
/playlists/:id ─────────  PlaylistDetail (Detalle de playlist)
/liked ─────────────────  LikedSongs (Canciones favoritas)
/upload ────────────────  UploadSong (Subida de contenido - creator)
/admin ─────────────────  AdminDashboard (Panel de admin - admin)
```

---

## 🧪 Testing

El proyecto incluye configuración para testing con pytest (backend) y Jest (frontend):

```powershell
# Backend tests
pytest

# Frontend tests
cd src/frontend
npm run test
```

---

## 🤝 Contribución

Este es un proyecto open source educativo. Las contribuciones son bienvenidas siguiendo estos pasos:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Estándares de Código

- **Backend**: PEP 8 (Python)
- **Frontend**: ESLint + TypeScript strict mode
- **Commits**: Conventional Commits
- **Branches**: Git Flow

---

## 📄 Licencia

Este proyecto está licenciado bajo la licencia MIT - ver el archivo [LICENSE](../LICENSE) para detalles.

---

## 👨‍💻 Autor

**Anderson Terán**  
GitHub: [@Andert51](https://github.com/Andert51)  
Proyecto: [P-Music_td](https://github.com/Andert51/P-Music_td)

---

## 🙏 Agradecimientos

- FastAPI por su excelente framework
- React y el ecosistema de JavaScript/TypeScript
- La comunidad open source por las herramientas increíbles
- Todos los contribuidores del proyecto

---

## 📞 Soporte

Si tienes preguntas o encuentras problemas:

1. Revisa la [documentación de arquitectura](./ARCHITECTURE.md)
2. Busca en los [Issues existentes](https://github.com/Andert51/P-Music_td/issues)
3. Crea un [nuevo Issue](https://github.com/Andert51/P-Music_td/issues/new)

---

**¡Disfruta del código! 🎵**
