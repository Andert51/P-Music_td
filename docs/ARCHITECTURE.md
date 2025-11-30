# 🏗️ Panal-Music - Architecture Documentation

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025  
**Estado**: Sprint 3 en desarrollo

---

## 📑 Tabla de Contenidos

- [Visión General del Sistema](#-visión-general-del-sistema)
- [Patrón Arquitectónico](#-patrón-arquitectónico)
- [Stack Tecnológico Detallado](#-stack-tecnológico-detallado)
- [Arquitectura Backend](#-arquitectura-backend)
- [Arquitectura Frontend](#-arquitectura-frontend)
- [Capa de Datos](#-capa-de-datos)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Flujo de Datos](#-flujo-de-datos)
- [Decisiones de Diseño](#-decisiones-de-diseño)
- [Escalabilidad y Rendimiento](#-escalabilidad-y-rendimiento)

---

## 🎯 Visión General del Sistema

**Panal-Music** es una aplicación web full-stack de streaming de música desarrollada con arquitectura moderna y escalable. El sistema está diseñado siguiendo principios SOLID, patrones de diseño probados y mejores prácticas de la industria.

### Características Arquitectónicas Clave

- **Arquitectura de Tres Capas**: Separación clara entre presentación, lógica de negocio y datos
- **RESTful API Design**: API bien estructurada siguiendo principios REST
- **Stateless Authentication**: JWT para autenticación sin estado del servidor
- **Component-Based UI**: React con componentes reutilizables y composables
- **Type Safety**: TypeScript en frontend, Pydantic en backend
- **ORM Pattern**: SQLAlchemy para abstracción de base de datos
- **Reactive State**: Gestión de estado reactivo con Zustand
- **Responsive Design**: Mobile-first con Tailwind CSS

---

## 🏛️ Patrón Arquitectónico

La aplicación implementa una **arquitectura de tres capas (Three-Tier Architecture)** que proporciona:

- ✅ **Separación de responsabilidades**: Cada capa tiene un propósito específico
- ✅ **Mantenibilidad**: Cambios en una capa no afectan a las demás
- ✅ **Testabilidad**: Cada capa puede ser testeada independientemente
- ✅ **Escalabilidad**: Las capas pueden escalar horizontalmente

```
┌──────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React 18 + TypeScript + Vite                            │   │
│  │  • Components (UI + Logic)                               │   │
│  │  • Pages (Route Components)                              │   │
│  │  • Zustand Store (State Management)                      │   │
│  │  • React Router (Client-Side Routing)                    │   │
│  │  • Framer Motion (Animations)                            │   │
│  │  • Tailwind CSS (Styling)                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Puerto: 5173 (Principal) | 5174-5177 (Sprints)                │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │ • GET, POST, PUT, DELETE, PATCH
                         │ • JSON Payloads
                         │ • JWT Bearer Token
                         │ • CORS Enabled
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FastAPI + Uvicorn (ASGI Server)                         │   │
│  │  • Routers (Endpoint Organization)                       │   │
│  │  • Pydantic Schemas (Validation)                         │   │
│  │  • Dependencies (Dependency Injection)                   │   │
│  │  • Middleware (CORS, Authentication)                     │   │
│  │  • Business Logic                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Puerto: 8000 (Principal) | 8001-8004 (Sprints)                │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ SQLAlchemy ORM
                         │ • Database Abstraction
                         │ • Query Builder
                         │ • Relationship Management
                         │ • Transaction Control
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                        DATA LAYER                                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL 16 (Relational Database)                     │   │
│  │  • Tables (Normalized Schema)                            │   │
│  │  • Relationships (Foreign Keys)                          │   │
│  │  • Indexes (Performance)                                 │   │
│  │  • Constraints (Data Integrity)                          │   │
│  │  • Alembic Migrations (Version Control)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Database: music_app (Compartida entre sprints)                 │
│  Puerto: 5432                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico Detallado

### Backend Stack

| Tecnología | Versión | Rol en la Arquitectura | Justificación |
|-----------|---------|------------------------|---------------|
| **Python** | 3.12.7+ | Lenguaje principal | Alto rendimiento, sintaxis clara, gran ecosistema |
| **FastAPI** | 0.109.0 | Framework web ASGI | Altísimo rendimiento, auto-documentación, async nativo |
| **Uvicorn** | 0.27.0 | Servidor ASGI | Servidor rápido para aplicaciones async |
| **SQLAlchemy** | 2.0.25 | ORM | Abstracción de BD, soporte para async, migraciones |
| **Alembic** | 1.13.1 | Migraciones de BD | Control de versiones de esquema, rollback seguro |
| **PostgreSQL** | 16+ | Base de datos | ACID, relaciones complejas, full-text search |
| **Pydantic** | 2.5.3 | Validación de datos | Validación tipo-segura, serialización automática |
| **python-jose** | 3.3.0 | JWT handling | Generación y verificación de tokens JWT |
| **passlib** | 1.7.4 | Hashing de passwords | Bcrypt, seguridad probada en producción |
| **aiofiles** | 23.2.1 | I/O asíncrono | Manejo async de archivos (audio/imágenes) |

**Principios de Diseño Backend**:
- **Async by default**: Operaciones I/O no bloqueantes
- **Dependency Injection**: FastAPI dependencies para reutilización
- **Type Hints**: Python typing para seguridad de tipos
- **Pydantic Validation**: Validación automática de datos de entrada
- **RESTful Design**: Recursos bien definidos, verbos HTTP semánticos

### Frontend Stack

| Tecnología | Versión | Rol en la Arquitectura | Justificación |
|-----------|---------|------------------------|---------------|
| **React** | 18.2.0 | Biblioteca UI | Virtual DOM, componentes reutilizables, gran ecosistema |
| **TypeScript** | 5.2.2 | Lenguaje | Type safety, mejor DX, detección temprana de errores |
| **Vite** | 5.0.8 | Build tool | HMR ultra-rápido, build optimizado, ESM nativo |
| **Tailwind CSS** | 3.4.0 | Framework CSS | Utility-first, diseño consistente, bundle pequeño |
| **Framer Motion** | 10.18.0 | Animaciones | Animaciones declarativas, gestos, transiciones |
| **Zustand** | 4.4.7 | State management | Simple, performante, sin boilerplate |
| **React Router** | 6.21.1 | Routing | SPA routing, lazy loading, nested routes |
| **Axios** | 1.6.5 | HTTP client | Interceptors, cancelación, mejor API que fetch |
| **Howler.js** | 2.2.4 | Audio playback | Web Audio API, formato cross-browser, streaming |
| **Lucide React** | 0.303.0 | Iconos | SVG optimizados, tree-shakeable, consistentes |

**Principios de Diseño Frontend**:
- **Component-Based**: Componentes pequeños, reutilizables y composables
- **Type Safety**: TypeScript strict mode
- **Separation of Concerns**: Lógica separada de presentación
- **Responsive First**: Mobile-first design con Tailwind
- **Performance**: Code splitting, lazy loading, memoization

---

## 🔧 Arquitectura Backend

### Estructura de Directorios

```
src/backend/
│
├── routes/                      # 🌐 API Endpoints (Routing)
│   ├── __init__.py
│   ├── auth.py                 # POST /auth/register, /auth/login
│   ├── users.py                # CRUD de usuarios
│   ├── songs.py                # CRUD de canciones + búsqueda
│   ├── albums.py               # CRUD de álbumes
│   ├── playlists.py            # CRUD de playlists
│   └── upload.py               # POST /upload/song, /upload/cover
│
├── models/                      # 🗄️ SQLAlchemy Models (ORM)
│   ├── __init__.py             # User, Song, Album, Playlist, etc.
│   └── associations.py         # Many-to-Many tables
│
├── schemas.py                   # 📋 Pydantic Schemas (Validation)
│   # UserCreate, UserResponse, SongCreate, etc.
│
├── auth.py                      # 🔐 Authentication Utilities
│   # create_access_token, verify_password, get_password_hash
│
├── dependencies.py              # 💉 FastAPI Dependencies
│   # get_current_user, require_role, get_db
│
├── database.py                  # 🗃️ Database Configuration
│   # SessionLocal, Base, engine, get_db
│
├── config.py                    # ⚙️ Application Settings
│   # Settings class con pydantic-settings
│
├── uploads/                     # 📁 Uploaded Files
│   ├── audio/                  # Archivos de audio (.mp3, .wav)
│   └── covers/                 # Imágenes de portadas
│
└── main.py                      # 🚀 FastAPI Application Entry Point
```

### Flujo de Request en Backend

```
1. HTTP Request llega al servidor
   │
   ├─> CORS Middleware (valida origen)
   │
2. FastAPI Router Match
   │
   ├─> Encuentra el endpoint correspondiente
   │
3. Dependencies Execution (Dependency Injection)
   │
   ├─> get_db() → Crea sesión de base de datos
   ├─> get_current_user() → Valida JWT token
   └─> require_role("admin") → Valida rol de usuario
   │
4. Pydantic Validation
   │
   ├─> Valida request body contra schema
   ├─> Serializa tipos de datos
   └─> Retorna 422 si validación falla
   │
5. Endpoint Function Execution
   │
   ├─> Business logic
   ├─> Database queries (SQLAlchemy)
   └─> File operations (si aplica)
   │
6. Response Serialization
   │
   ├─> Pydantic schema convierte a JSON
   └─> Status code apropiado
   │
7. HTTP Response enviado al cliente
```

### Organización de Routers

**Principio**: Un router por recurso (RESTful)

```python
# routes/songs.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

router = APIRouter(prefix="/songs", tags=["Songs"])

@router.get("/")
async def list_songs(
    search: str = Query(None),
    album_id: int = Query(None),
    limit: int = Query(50),
    db: Session = Depends(get_db)
):
    # Lógica de búsqueda y filtrado
    pass

@router.get("/{song_id}")
async def get_song(song_id: int, db: Session = Depends(get_db)):
    # Detalle de canción
    pass

@router.post("/")
async def create_song(
    song: SongCreate,
    current_user: User = Depends(require_role("creator")),
    db: Session = Depends(get_db)
):
    # Crear canción (solo creators)
    pass
```

### Dependency Injection Pattern

```python
# dependencies.py
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user

def require_role(role: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != role and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker
```

---

## 🎨 Arquitectura Frontend

### Estructura de Directorios

```
src/frontend/src/
│
├── components/                  # 🧩 Componentes Reutilizables
│   ├── Layout.tsx              # Layout principal (Sidebar + Content + Player)
│   ├── Sidebar.tsx             # Navegación lateral
│   ├── Player.tsx              # Reproductor de música (bottom bar)
│   ├── NowPlayingPanel.tsx     # Panel "Now Playing" (right sidebar)
│   ├── SongCard.tsx            # Card de canción reutilizable
│   ├── AlbumCard.tsx           # Card de álbum reutilizable
│   └── ProtectedRoute.tsx      # HOC para rutas protegidas
│
├── pages/                       # 📄 Páginas (Route Components)
│   ├── Home.tsx                # Dashboard principal
│   ├── Login.tsx               # Página de autenticación
│   ├── Register.tsx            # Registro de usuarios
│   ├── Search.tsx              # Búsqueda avanzada
│   ├── Albums.tsx              # Listado de álbumes
│   ├── AlbumDetail.tsx         # Detalle de álbum
│   ├── Playlists.tsx           # Gestión de playlists
│   ├── PlaylistDetail.tsx      # Detalle de playlist
│   ├── LikedSongs.tsx          # Canciones favoritas
│   ├── UploadSong.tsx          # Upload de contenido
│   └── AdminDashboard.tsx      # Panel de administrador
│
├── store/                       # 🗄️ State Management (Zustand)
│   ├── authStore.ts            # Estado de autenticación
│   │   # user, token, login(), logout(), register()
│   └── playerStore.ts          # Estado del reproductor
│       # currentSong, isPlaying, queue, play(), pause()
│
├── lib/                         # 🛠️ Utilities & Helpers
│   ├── api.ts                  # Axios instance configurado
│   ├── formatters.ts           # formatDuration(), formatDate()
│   └── constants.ts            # API_URL, ROLES, etc.
│
├── types/                       # 📐 TypeScript Interfaces
│   ├── user.ts                 # User, UserRole, etc.
│   ├── song.ts                 # Song, SongCreate, etc.
│   ├── album.ts                # Album, AlbumDetail, etc.
│   └── playlist.ts             # Playlist, PlaylistCreate, etc.
│
├── config.ts                    # ⚙️ Configuración de app
├── App.tsx                      # 🚀 Componente raíz + Router
├── main.tsx                     # 🏁 Entry point (ReactDOM.render)
└── index.css                    # 🎨 Estilos globales + Tailwind
```

### Flujo de Rendering en Frontend

```
1. Usuario navega a una URL
   │
   ├─> React Router determina componente de página
   │
2. Componente de página se monta
   │
   ├─> Hooks de estado (useState, useEffect)
   ├─> Zustand store subscription
   │
3. Se realizan llamadas API necesarias
   │
   ├─> Axios request con token JWT
   ├─> Loading state se muestra
   │
4. Datos llegan del backend
   │
   ├─> Store actualizado (si global)
   ├─> Re-render de componentes
   │
5. UI se renderiza con datos
   │
   ├─> Animaciones (Framer Motion)
   ├─> Estilos aplicados (Tailwind)
   │
6. Usuario interactúa
   │
   ├─> Event handlers ejecutados
   ├─> Estado actualizado
   └─> Ciclo se repite
```

### State Management con Zustand

**Auth Store**:

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { access_token, user } = response.data;
        set({ token: access_token, user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      register: async (data) => {
        await api.post('/auth/register', data);
      },
      
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // Persiste en localStorage
    }
  )
);
```

**Player Store**:

```typescript
// store/playerStore.ts
import { create } from 'zustand';
import { Howl } from 'howler';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  currentTime: number;
  duration: number;
  howl: Howl | null;
  
  // Actions
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  addToQueue: (song: Song) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],
  currentTime: 0,
  duration: 0,
  howl: null,
  
  play: (song) => {
    const { howl, currentSong } = get();
    
    // Si hay una canción reproduciéndose, detenerla
    if (howl && currentSong?.id !== song.id) {
      howl.unload();
    }
    
    // Crear nuevo Howl instance
    const newHowl = new Howl({
      src: [`${API_URL}/uploads/audio/${song.file_path}`],
      html5: true,
      volume: get().volume,
      onplay: () => set({ isPlaying: true }),
      onpause: () => set({ isPlaying: false }),
      onend: () => get().next(),
      onload: () => set({ duration: newHowl.duration() }),
    });
    
    newHowl.play();
    set({ currentSong: song, howl: newHowl, isPlaying: true });
  },
  
  pause: () => {
    const { howl } = get();
    if (howl) {
      howl.pause();
      set({ isPlaying: false });
    }
  },
  
  next: () => {
    const { queue, currentSong } = get();
    const currentIndex = queue.findIndex(s => s.id === currentSong?.id);
    if (currentIndex < queue.length - 1) {
      get().play(queue[currentIndex + 1]);
    }
  },
  
  // ... más acciones
}));
```

### Component Patterns

**Smart vs Presentational Components**:

```typescript
// Smart Component (tiene lógica, accede a stores)
// pages/Home.tsx
export function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const { play } = usePlayerStore();
  
  useEffect(() => {
    api.get('/songs').then(res => setSongs(res.data));
  }, []);
  
  return (
    <div>
      {songs.map(song => (
        <SongCard 
          key={song.id} 
          song={song} 
          onPlay={() => play(song)} 
        />
      ))}
    </div>
  );
}

// Presentational Component (solo recibe props, sin lógica)
// components/SongCard.tsx
interface SongCardProps {
  song: Song;
  onPlay: () => void;
}

export function SongCard({ song, onPlay }: SongCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      onClick={onPlay}
      className="bg-gray-800 rounded-lg p-4"
    >
      <img src={song.cover_url} alt={song.title} />
      <h3>{song.title}</h3>
      <p>{song.artist}</p>
    </motion.div>
  );
}
```

---

## 🗄️ Capa de Datos

### Esquema de Base de Datos

```sql
-- Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- Tabla de Álbumes
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    cover_path VARCHAR(500),
    release_year INTEGER,
    approved BOOLEAN DEFAULT FALSE,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_title (title),
    INDEX idx_artist (artist),
    INDEX idx_creator (creator_id)
);

-- Tabla de Canciones
CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
    genre VARCHAR(50),
    duration INTEGER, -- en segundos
    file_path VARCHAR(500) UNIQUE NOT NULL,
    cover_path VARCHAR(500),
    play_count INTEGER DEFAULT 0,
    approved BOOLEAN DEFAULT FALSE,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_title (title),
    INDEX idx_artist (artist),
    INDEX idx_genre (genre),
    INDEX idx_album (album_id),
    INDEX idx_play_count (play_count DESC),
    INDEX idx_approved (approved)
);

-- Tabla de Playlists
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_path VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_owner (owner_id),
    INDEX idx_public (is_public)
);

-- Tabla Many-to-Many: Playlists ↔ Songs
CREATE TABLE playlist_songs (
    playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (playlist_id, song_id),
    INDEX idx_playlist (playlist_id),
    INDEX idx_position (playlist_id, position)
);

-- Tabla Many-to-Many: Users ↔ Songs (Favoritos)
CREATE TABLE user_liked_songs (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, song_id),
    INDEX idx_user_likes (user_id),
    INDEX idx_song_likes (song_id)
);
```

### Relaciones de Datos

```
User
├── 1:N → Playlists (owner)
├── 1:N → Albums (creator)
├── 1:N → Songs (creator)
└── N:N → Songs (liked_songs)

Album
├── N:1 → User (creator)
└── 1:N → Songs

Song
├── N:1 → Album
├── N:1 → User (creator)
├── N:N → Playlists
└── N:N → Users (liked_by)

Playlist
├── N:1 → User (owner)
└── N:N → Songs
```

### Query Optimization

**Índices Estratégicos**:

```python
# Búsqueda de canciones (ILIKE en PostgreSQL)
# Índice en title y artist para búsqueda rápida
CREATE INDEX idx_songs_title_trgm ON songs USING gin (title gin_trgm_ops);
CREATE INDEX idx_songs_artist_trgm ON songs USING gin (artist gin_trgm_ops);

# Query optimizada
query = db.query(Song).filter(
    (Song.title.ilike(f"%{search}%")) | 
    (Song.artist.ilike(f"%{search}%"))
)
```

**Eager Loading**:

```python
# Sin eager loading (N+1 problem)
albums = db.query(Album).all()  # 1 query
for album in albums:
    songs = album.songs  # N queries adicionales!

# Con eager loading (2 queries totales)
albums = db.query(Album).options(
    joinedload(Album.songs),
    joinedload(Album.creator)
).all()
```

---

## 🔐 Sistema de Autenticación

### Arquitectura de Autenticación

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /auth/login
       │    { email, password }
       ▼
┌─────────────────────────────┐
│       Backend (FastAPI)     │
│                             │
│  2. Buscar usuario en BD    │
│  3. Verificar password      │
│     (bcrypt.verify)         │
│                             │
│  4. Generar JWT Token       │
│     {                       │
│       sub: user_id,         │
│       role: user_role,      │
│       exp: timestamp        │
│     }                       │
│                             │
│  5. Firmar con SECRET_KEY   │
│     (HS256)                 │
└──────────┬──────────────────┘
           │
           │ 6. Return token
           │    { access_token, token_type }
           ▼
┌──────────────────────────┐
│  Cliente almacena token  │
│  (Zustand + localStorage)│
└──────────┬───────────────┘
           │
           │ 7. Requests subsecuentes
           │    Authorization: Bearer <token>
           ▼
┌────────────────────────────────┐
│   Backend valida en cada req  │
│                                │
│  • Verifica firma              │
│  • Verifica expiración         │
│  • Extrae user_id y role       │
│  • Busca usuario en BD         │
│  • Inyecta en dependencies     │
└────────────────────────────────┘
```

### Implementación de JWT

**Generación de Token**:

```python
# auth.py
from datetime import datetime, timedelta
from jose import jwt

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode, 
        SECRET_KEY, 
        algorithm=ALGORITHM
    )
    
    return encoded_jwt
```

**Verificación de Token**:

```python
# dependencies.py
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user
```

### Role-Based Access Control (RBAC)

**Implementación**:

```python
# dependencies.py
def require_role(required_role: str):
    """
    Factory function que retorna un dependency checker.
    Uso: current_user = Depends(require_role("admin"))
    """
    def role_checker(current_user: User = Depends(get_current_user)):
        # Admin tiene acceso a todo
        if current_user.role == "admin":
            return current_user
        
        # Usuario no tiene el rol requerido
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{required_role}' required"
            )
        
        return current_user
    
    return role_checker

# Uso en routers
@router.post("/songs")
async def create_song(
    song: SongCreate,
    creator: User = Depends(require_role("creator")),
    db: Session = Depends(get_db)
):
    # Solo creators y admins pueden crear canciones
    pass
```

**Matriz de Permisos**:

| Endpoint | user | premium | creator | admin |
|----------|------|---------|---------|-------|
| GET /songs | ✅ | ✅ | ✅ | ✅ |
| POST /songs | ❌ | ❌ | ✅ | ✅ |
| DELETE /songs/:id (own) | ❌ | ❌ | ✅ | ✅ |
| DELETE /songs/:id (any) | ❌ | ❌ | ❌ | ✅ |
| POST /songs/:id/approve | ❌ | ❌ | ❌ | ✅ |
| GET /admin/* | ❌ | ❌ | ❌ | ✅ |

---

## 🔄 Flujo de Datos

### Flujo Completo de Reproducción de Canción

```
1. Usuario hace clic en canción
   │
   ├─> Home.tsx: handlePlay(song)
   │
2. Actualización de Player Store
   │
   ├─> playerStore.play(song)
   ├─> Crea Howl instance
   ├─> Set currentSong, isPlaying = true
   │
3. Player Component Re-render
   │
   ├─> Player.tsx subscrito a playerStore
   ├─> Muestra información de canción
   ├─> Progress bar inicia
   │
4. Howler.js carga audio
   │
   ├─> Request a: /uploads/audio/{file_path}
   ├─> Backend sirve archivo estático
   ├─> Streaming de audio inicia
   │
5. NowPlayingPanel actualizado
   │
   ├─> Muestra portada, título, artista
   ├─> Muestra cola de reproducción
   ├─> Animaciones activadas
   │
6. Incrementar play_count
   │
   ├─> API call: POST /songs/:id/play
   ├─> Backend incrementa contador
   └─> Analytics actualizadas
```

### Flujo de Búsqueda

```
1. Usuario escribe en Search input
   │
   ├─> Search.tsx: handleSearch(query)
   │
2. Debounce (300ms)
   │
   ├─> Evita requests excesivos
   │
3. API Request
   │
   ├─> GET /songs?search={query}
   │
4. Backend procesa búsqueda
   │
   ├─> PostgreSQL ILIKE query
   ├─> Busca en title y artist
   ├─> Aplica filtros adicionales
   │
5. Response con resultados
   │
   ├─> Lista de canciones matching
   │
6. UI actualizada
   │
   ├─> setSongs(results)
   ├─> Re-render de SongCards
   └─> Animaciones de entrada
```

---

## 🎯 Decisiones de Diseño

### ¿Por qué PostgreSQL en lugar de SQLite?

**Razones**:
- ✅ **Concurrencia**: Múltiples usuarios simultáneos
- ✅ **ACID completo**: Transacciones robustas
- ✅ **Full-text search**: ILIKE, GIN indexes
- ✅ **Escalabilidad**: Producción-ready
- ✅ **Relaciones complejas**: Foreign keys, constraints

**Trade-off**: Mayor complejidad de setup (requiere servidor PostgreSQL)

### ¿Por qué Zustand en lugar de Redux?

**Razones**:
- ✅ **Simplicidad**: Sin boilerplate (actions, reducers)
- ✅ **Performance**: Re-renders optimizados automáticamente
- ✅ **TypeScript**: First-class support
- ✅ **Tamaño**: ~1KB vs ~3KB (Redux Toolkit)
- ✅ **DX**: API intuitiva y minimalista

### ¿Por qué FastAPI en lugar de Django/Flask?

**Razones**:
- ✅ **Performance**: Async nativo (comparable a Node.js)
- ✅ **Auto-documentación**: Swagger/ReDoc automático
- ✅ **Type hints**: Validación con Pydantic
- ✅ **Modern**: Built for Python 3.7+
- ✅ **DX**: Menos código, más productividad

### ¿Por qué Howler.js para audio?

**Razones**:
- ✅ **Cross-browser**: Funciona en todos los navegadores
- ✅ **Streaming**: Reproducción progresiva
- ✅ **Web Audio API**: Mejor que HTML5 audio
- ✅ **Control**: Volume, seek, rate control
- ✅ **Eventos**: Hooks para play, pause, end, etc.

---

## 📈 Escalabilidad y Rendimiento

### Optimizaciones Backend

**1. Async Everywhere**:
```python
# I/O no bloqueante
@router.get("/songs")
async def list_songs(db: Session = Depends(get_db)):
    # Database queries son async
    songs = await db.query(Song).all()
    return songs
```

**2. Database Connection Pooling**:
```python
# database.py
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,        # Conexiones persistentes
    max_overflow=20,     # Conexiones adicionales bajo carga
    pool_pre_ping=True   # Verificar conexiones antes de usar
)
```

**3. Caching con Redis** (Sprint 4):
```python
# Para datos frecuentemente accedidos
@router.get("/songs/popular")
async def popular_songs(cache: Redis = Depends(get_redis)):
    cached = await cache.get("popular_songs")
    if cached:
        return json.loads(cached)
    
    songs = await db.query(Song).order_by(Song.play_count.desc()).limit(50).all()
    await cache.setex("popular_songs", 3600, json.dumps(songs))
    return songs
```

### Optimizaciones Frontend

**1. Code Splitting**:
```typescript
// Lazy loading de páginas
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AlbumDetail = lazy(() => import('./pages/AlbumDetail'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/albums/:id" element={<AlbumDetail />} />
  </Routes>
</Suspense>
```

**2. Memoization**:
```typescript
// Evitar re-renders innecesarios
const SongCard = memo(({ song, onPlay }: Props) => {
  return (
    <div onClick={onPlay}>
      {song.title}
    </div>
  );
}, (prev, next) => prev.song.id === next.song.id);
```

**3. Virtual Scrolling** (para listas grandes):
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function SongList({ songs }: { songs: Song[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: songs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Altura estimada de cada item
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <SongCard key={virtualRow.index} song={songs[virtualRow.index]} />
        ))}
      </div>
    </div>
  );
}
```

### Estrategias de Escalabilidad Horizontal

**1. Load Balancer** (Nginx):
```nginx
upstream backend {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

**2. CDN para Archivos Estáticos**:
- Audio files → S3 + CloudFront
- Images → CDN con image optimization

**3. Database Read Replicas**:
```python
# Separar reads de writes
write_engine = create_engine(PRIMARY_DB_URL)
read_engine = create_engine(REPLICA_DB_URL)

@router.get("/songs")  # Read operation
async def list_songs(db: Session = Depends(get_read_db)):
    pass

@router.post("/songs")  # Write operation
async def create_song(db: Session = Depends(get_write_db)):
    pass
```

---

## 🔍 Monitoring y Observability (Sprint 4)

### Logging

```python
import logging

logger = logging.getLogger(__name__)

@router.post("/songs")
async def create_song(song: SongCreate):
    logger.info(f"Creating song: {song.title} by {song.artist}")
    try:
        # ...
        logger.info(f"Song created successfully: {db_song.id}")
    except Exception as e:
        logger.error(f"Error creating song: {str(e)}", exc_info=True)
        raise
```

### Métricas (Prometheus + Grafana)

```python
from prometheus_client import Counter, Histogram

song_plays = Counter('song_plays_total', 'Total song plays', ['song_id'])
api_latency = Histogram('api_latency_seconds', 'API request latency')

@api_latency.time()
@router.get("/songs/{song_id}")
async def get_song(song_id: int):
    song_plays.labels(song_id=song_id).inc()
    # ...
```

---

## 🛡️ Seguridad

### Prácticas Implementadas

1. **Password Hashing**: Bcrypt con salting automático
2. **JWT con Expiración**: Tokens expiran en 30 minutos
3. **CORS Configurado**: Solo orígenes permitidos
4. **SQL Injection Prevention**: SQLAlchemy ORM previene inyección
5. **XSS Prevention**: React escapa automáticamente
6. **HTTPS Only** (producción): TLS 1.3
7. **Rate Limiting** (Sprint 4): Limitar requests por IP
8. **File Upload Validation**: Validar tipo MIME, tamaño

---

## 📚 Referencias y Recursos

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/
- **Zustand Docs**: https://docs.pmnd.rs/zustand/

---

**Documento actualizado**: Noviembre 2025  
**Versión**: 1.0.0 (Sprint 3)  
**Autor**: Anderson Terán

```
src/frontend/src/
├── components/      # Reusable components
│   ├── Layout.tsx   # Main layout wrapper
│   ├── Navbar.tsx   # Top navigation
│   ├── Sidebar.tsx  # Side navigation
│   ├── Player.tsx   # Audio player
│   └── SongCard.tsx # Song display card
├── pages/          # Route pages
│   ├── Home.tsx    # Landing page
│   ├── Login.tsx   # Login page
│   └── Register.tsx # Registration page
├── store/          # State management
│   ├── authStore.ts    # Authentication state
│   └── playerStore.ts  # Player state
├── types/          # TypeScript definitions
│   └── index.ts
├── lib/            # Utilities
│   └── axios.ts    # Axios configuration
├── App.tsx         # Main app component
├── main.tsx        # App entry point
└── index.css       # Global styles
```

### State Management

#### Auth Store (Zustand)
- User authentication state
- Login/register/logout functions
- Token management
- User profile data

#### Player Store (Zustand)
- Current song and queue
- Play/pause state
- Volume control
- Playback controls
- Howler.js integration

### Component Hierarchy

```
App
├── BrowserRouter
│   ├── Login
│   ├── Register
│   └── Layout (Protected)
│       ├── Sidebar
│       ├── Navbar
│       ├── Outlet (Pages)
│       │   ├── Home
│       │   ├── Search
│       │   ├── Library
│       │   └── Liked
│       └── Player
```

## Database Schema

### Tables

#### users
- id (PK)
- email (unique)
- username (unique)
- hashed_password
- role (enum)
- is_active
- profile_picture
- created_at
- updated_at

#### songs
- id (PK)
- title
- artist
- duration
- file_path
- cover_image
- album_id (FK)
- creator_id (FK)
- is_approved
- play_count
- created_at
- updated_at

#### albums
- id (PK)
- title
- description
- cover_image
- release_date
- creator_id (FK)
- is_approved
- created_at
- updated_at

#### playlists
- id (PK)
- name
- description
- cover_image
- is_public
- owner_id (FK)
- created_at
- updated_at

#### playlist_songs (Junction Table)
- id (PK)
- playlist_id (FK)
- song_id (FK)
- position
- added_at

#### liked_songs (Junction Table)
- id (PK)
- user_id (FK)
- song_id (FK)
- liked_at

## API Design

### RESTful Principles
- Resource-based URLs
- HTTP verbs (GET, POST, PATCH, DELETE)
- Status codes (200, 201, 400, 401, 403, 404, 500)
- JSON request/response format

### Authentication
- Bearer token in Authorization header
- JWT with expiration
- Token refresh mechanism (future)

### Error Handling
- Consistent error response format
- Detailed error messages
- HTTP status codes

## Security Considerations

1. **Password Security**
   - Bcrypt hashing
   - Salt generation
   - No plain text storage

2. **JWT Security**
   - Short expiration time
   - Secret key in environment variables
   - HTTPS in production

3. **CORS**
   - Configured origins
   - Credentials support

4. **Input Validation**
   - Pydantic schemas
   - SQL injection prevention (SQLAlchemy)
   - XSS protection

5. **File Upload** (Future)
   - File type validation
   - Size limits
   - Virus scanning

## Performance Optimization

### Backend
- Database connection pooling
- Query optimization with SQLAlchemy
- Async/await with FastAPI
- Pagination for large datasets
- Caching (future: Redis)

### Frontend
- Code splitting with Vite
- Lazy loading routes
- Image optimization
- Component memoization
- Virtual scrolling (future)

### Database
- Indexed columns (email, username)
- Foreign key constraints
- Query optimization

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT for authentication (no sessions)
- CDN for static assets (future)
- Load balancing (future)

### Vertical Scaling
- Database optimization
- Caching layer (Redis)
- File storage (S3/Cloud)

## Deployment Strategy

### Development
- Local development servers
- SQLite for quick testing (optional)
- Hot reload enabled

### Production (Future)
- Docker containerization
- Kubernetes orchestration
- PostgreSQL managed service
- CDN for frontend assets
- S3 for audio files
- CI/CD pipeline

## Monitoring & Logging

### Backend
- FastAPI built-in logging
- Database query logging
- Error tracking (Sentry - future)

### Frontend
- Console logging (development)
- Error boundary components
- Analytics (future)

## Testing Strategy

### Backend
- Unit tests with pytest
- Integration tests
- API endpoint tests

### Frontend
- Component tests (Jest)
- E2E tests (Cypress - future)
- Accessibility tests

## Future Enhancements

1. **File Upload System**
   - Audio file processing
   - Image optimization
   - Cloud storage integration

2. **Real-time Features**
   - WebSocket for live updates
   - Collaborative playlists
   - Listen along feature

3. **Analytics**
   - User listening habits
   - Popular songs/artists
   - Creator dashboard

4. **Social Features**
   - Follow artists
   - Share playlists
   - Comments/reviews

5. **Payment Integration**
   - Stripe for Premium subscriptions
   - Creator monetization

6. **Advanced Player**
   - Equalizer
   - Lyrics sync
   - Crossfade
   - Gapless playback

## Development Workflow

1. Create feature branch
2. Develop feature
3. Write tests
4. Code review
5. Merge to main
6. Deploy

## Coding Standards

- English code and comments
- Type hints in Python
- TypeScript strict mode
- ESLint/Prettier for formatting
- Meaningful variable names
- RESTful API conventions

---

**Version**: 1.0.0
**Last Updated**: November 2025
