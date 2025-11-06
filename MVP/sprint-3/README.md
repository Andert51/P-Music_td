# Sprint 2 - Player + Upload System# 🎵 P-Music TD - Sprint 2: Gestión de Contenido y Reproducción



## 🎯 Objetivos del Sprint## 📅 Semana 2 - MVP 2



Sprint 2 añade las siguientes funcionalidades sobre Sprint 1:### 🎯 Objetivo del Sprint

Implementar la **gestión completa de contenido musical** con reproducción funcional de audio.

### Nuevas Características

- ✅ **Reproductor de Audio**: Howler.js con controles completos---

  - Play/Pause

  - Skip anterior/siguiente## ✨ Características Implementadas

  - Seekbar con progreso en tiempo real

  - Control de volumen### 🎵 Gestión de Canciones

  - Muestra información de la canción actual- ✅ Subida de canciones individuales con MP3

- ✅ **Sistema de Carga** (Creators/Admins):- ✅ Subida de álbumes completos

  - Subir canciones individuales con portada- ✅ Portadas personalizadas para canciones y álbumes

  - Subir álbumes completos con múltiples canciones- ✅ Validación de archivos (formato, tamaño)

  - Validación de tipos y tamaños de archivo- ✅ Cálculo automático de duración de archivos MP3

  - Estado de aprobación (is_approved=False por defecto)- ✅ Metadata: título, artista, género, duración



### Características Heredadas de Sprint 1### ▶️ Reproductor de Audio

- ✅ Autenticación (Login/Register)- ✅ Reproducción completa con Howler.js

- ✅ Visualización de canciones- ✅ Controles: play, pause, skip forward, skip backward

- ✅ Visualización de álbumes- ✅ Barra de progreso con seek

- ✅ Sistema de roles (listener, creator, admin)- ✅ Control de volumen con slider

- ✅ Cola de reproducción

## 🚀 Inicio Rápido- ✅ Información de canción actual



### Prerequisitos### 📊 Visualización

- Python 3.8+- ✅ Listado de canciones populares en Home

- Node.js 18+- ✅ Página de detalles de álbum

- PostgreSQL- ✅ Cards de álbumes con portadas

- Base de datos `music_app` creada y configurada- ✅ Contador de reproducciones

- ✅ Ordenamiento por popularidad

### Backend (Puerto 8002)

---

```bash

cd backend## 🏗️ Arquitectura



# Instalar dependencias```

pip install -r requirements.txtsprint-2/

├── backend/

# Iniciar servidor│   ├── main.py              # Endpoints de canciones y álbumes

uvicorn main:app --reload --port 8002│   ├── models.py            # Modelos Song y Album

```│   ├── routers/

│   │   ├── auth.py          # Auth (desde Sprint 1)

**Endpoints disponibles**:│   │   ├── songs.py         # CRUD de canciones

- `http://localhost:8002/mvp/sprint2/auth/*` - Autenticación│   │   ├── albums.py        # CRUD de álbumes

- `http://localhost:8002/mvp/sprint2/songs/*` - Canciones│   │   └── upload.py        # Upload de archivos

- `http://localhost:8002/mvp/sprint2/albums/*` - Álbumes│   ├── uploads/             # Archivos multimedia

- `http://localhost:8002/mvp/sprint2/upload/*` - Carga de contenido (creators/admins)│   │   ├── songs/

│   │   ├── covers/

### Frontend (Puerto 5175)│   │   │   ├── songs/

│   │   │   └── albums/

```bash│   └── requirements.txt

cd frontend│

├── frontend/

# Instalar dependencias│   ├── src/

npm install│   │   ├── pages/

│   │   │   ├── Home.tsx         # Listado de canciones

# Iniciar dev server│   │   │   ├── Albums.tsx       # Grid de álbumes

npm run dev│   │   │   ├── AlbumDetail.tsx  # Detalles + canciones

```│   │   │   └── UploadSong.tsx   # Subida de contenido

│   │   ├── components/

Acceder a: `http://localhost:5175`│   │   │   └── Player.tsx       # Reproductor funcional

│   │   ├── store/

## 🔑 Tokens y Almacenamiento│   │   │   └── playerStore.ts   # Estado del reproductor

│   │   └── types/

Sprint 2 usa su propio conjunto de tokens en localStorage:│   │       └── index.ts         # Tipos de Song y Album

- `sprint2_token` - Token JWT de autenticación│   └── package.json

- `sprint2_user` - Información del usuario│

└── README.md (este archivo)

**Nota**: Estos tokens son independientes de los de Sprint 1.```



## 📁 Estructura de Archivos---



### Backend## 🚀 Instalación y Ejecución

```

backend/### Prerrequisitos

├── main.py                    # FastAPI app - Puerto 8002- Haber completado Sprint 1

├── models.py                  # Modelos SQLAlchemy- FFmpeg instalado (para metadatos de audio)

├── database.py                # Conexión PostgreSQL

├── requirements.txt           # Dependencias Python### 1. Backend

└── routers/

    ├── auth.py               # Login/Register```bash

    ├── songs.py              # CRUD cancionescd sprint-2/backend

    ├── albums.py             # CRUD álbumes

    └── upload.py             # ⭐ NUEVO: Sistema de carga# Activar entorno virtual

```.\venv\Scripts\activate  # Windows

source venv/bin/activate  # Linux/Mac

### Frontend

```# Instalar nuevas dependencias

frontend/pip install -r requirements.txt

├── src/

│   ├── components/# Crear directorios de uploads

│   │   ├── Player.tsx        # ⭐ NUEVO: Reproductor con Howler.jsmkdir -p uploads/songs uploads/covers/songs uploads/covers/albums

│   │   ├── Header.tsx

│   │   └── Layout.tsx# Variables de entorno (.env)

│   ├── pages/DATABASE_URL=postgresql://postgres:password@localhost/pmusic_sprint2

│   │   ├── Home.tsx          # ⭐ MODIFICADO: Integración con playerSECRET_KEY=tu_secret_key_muy_segura_aqui

│   │   ├── Login.tsxUPLOAD_DIR=./uploads

│   │   └── Register.tsx

│   ├── store/# Iniciar servidor

│   │   └── playerStore.ts    # ⭐ NUEVO: Estado global con Zustanduvicorn main:app --reload --port 8000

│   ├── types/```

│   │   └── index.ts          # ⭐ NUEVO: TypeScript types

│   ├── lib/### 2. Frontend

│   │   └── api.ts            # Cliente Axios (sprint2)

│   └── App.tsx               # ⭐ MODIFICADO: Incluye Player global```bash

└── package.json              # ⭐ MODIFICADO: Añade howler, zustandcd sprint-2/frontend

```

# Instalar nuevas dependencias

## 🎵 Sistema de Reproducciónnpm install howler



### Player Store (Zustand + Howler.js)# Iniciar desarrollo

npm run dev

```typescript```

// Reproducir una canción

playSong(song: Song)### 3. Crear Usuario Creator



// Reproducir cola de canciones```bash

playQueue(songs: Song[], startIndex: number)# Usar endpoint de registro con role="creator"

curl -X POST http://localhost:8000/mvp/sprint2/auth/register \

// Controles  -H "Content-Type: application/json" \

togglePlay()  -d '{

nextSong()    "email": "creator@pmusic.com",

previousSong()    "username": "Creator",

setVolume(volume: number)    "password": "password123",

seek(time: number)    "role": "creator"

```  }'

```

### Uso en Componentes

---

```typescript

import { usePlayerStore } from '../store/playerStore'## 🧪 Cómo Probar



const { playSong, currentSong, isPlaying, togglePlay } = usePlayerStore()### 1. Subir una Canción Individual

1. Login como usuario CREATOR

// Reproducir canción2. Ir a "Subir Música"

<button onClick={() => playSong(song)}>3. Seleccionar tipo: "Canción Individual"

  Play4. Completar formulario:

</button>   - Título: "Mi Primera Canción"

   - Artista: "Test Artist"

// Indicador de reproducción actual   - Género: "Rock"

{currentSong?.id === song.id && <PlayingIndicator />}   - Archivo MP3 (máx 20MB)

```   - Portada (opcional, máx 5MB)

5. Click en "Subir Canción"

## 📤 Sistema de Carga (Upload)6. Verificar en Home que aparece



### Endpoints### 2. Subir un Álbum

1. Seleccionar tipo: "Álbum"

**POST /mvp/sprint2/upload/single** (Crear/Admin)2. Completar datos del álbum:

```typescript   - Título del álbum

// FormData con:   - Descripción

- audio: File (audio/mpeg, max 20MB)   - Fecha de lanzamiento

- cover?: File (image/jpeg|png, max 5MB)   - Portada del álbum

- title: string3. Agregar canciones (mínimo 2):

- artist: string   - Título de cada canción

- duration: number   - Artista

- genre?: string   - Archivo MP3

```4. Click en "Subir Álbum"

5. Ver en página de Álbumes

**POST /mvp/sprint2/upload/album** (Creator/Admin)

```typescript### 3. Reproducir Audio

// FormData con:1. En Home, click en cualquier canción

- songs: File[] (audio/mpeg, max 20MB c/u)2. Verificar que el reproductor se activa

- cover: File (image/jpeg|png, max 5MB)3. Probar controles:

- title: string   - Play/Pause

- description?: string   - Skip Forward/Backward

- release_date?: string   - Barra de progreso (hacer click para saltar)

- song_titles: string[] (JSON)   - Control de volumen

- song_artists: string[] (JSON)

- song_durations: number[] (JSON)### 4. Navegar por Álbum

- song_genres?: string[] (JSON)1. Ir a página de Álbumes

```2. Click en un álbum

3. Ver lista de canciones

**GET /mvp/sprint2/upload/my-uploads**4. Reproducir desde el álbum

```typescript

// Respuesta:---

{

  songs: Song[],## 📊 Endpoints Disponibles

  albums: Album[]

}### Canciones

```

| Método | Endpoint | Descripción |

### Validaciones|--------|----------|-------------|

- **Audio**: `audio/mpeg`, máximo 20MB| GET | `/mvp/sprint2/songs/` | Listar canciones (ordenadas por plays) |

- **Imágenes**: `image/jpeg`, `image/png`, máximo 5MB| GET | `/mvp/sprint2/songs/{id}` | Obtener canción específica |

- **Roles**: Solo `creator` y `admin` pueden subir contenido| POST | `/mvp/sprint2/songs/{id}/play` | Incrementar contador de reproducciones |

- **Aprobación**: Todo contenido subido tiene `is_approved=False`| GET | `/mvp/sprint2/songs/{id}/file` | Stream de audio |



## 🔧 Tecnologías Nuevas### Álbumes



### Frontend| Método | Endpoint | Descripción |

- **Howler.js** (v2.2.4): Biblioteca de audio HTML5/Web Audio|--------|----------|-------------|

- **Zustand** (v4.4.7): Estado global ligero| GET | `/mvp/sprint2/albums/` | Listar todos los álbumes |

- **@types/howler** (v2.2.11): Types para Howler.js| GET | `/mvp/sprint2/albums/{id}` | Obtener álbum con canciones |

| POST | `/mvp/sprint2/albums/` | Crear nuevo álbum |

### Backend

- FastAPI multipart/form-data para uploads### Upload

- Validación de tipos MIME

- Generación de UUIDs para nombres de archivo| Método | Endpoint | Descripción |

- Guardado en `src/backend/uploads/` (compartido con main project)|--------|----------|-------------|

| POST | `/mvp/sprint2/upload/song` | Subir canción individual |

## 🎨 Player UI| POST | `/mvp/sprint2/upload/album` | Subir álbum completo |



El reproductor aparece como barra fija en la parte inferior cuando hay una canción activa:---



```## 🎨 Componentes Principales

┌─────────────────────────────────────────────────────────────┐

│ [Cover] Song Title          ⏮ ⏯ ⏭                    🔊    │### Player Component (Reproductor)

│         Artist Name      0:00 ━━━━━━━━━━━ 3:45              │

└─────────────────────────────────────────────────────────────┘```typescript

```// Estado global con Zustand

interface PlayerState {

### Características del Player  currentSong: Song | null;

- Portada de la canción (clickeable)  isPlaying: boolean;

- Título y artista  volume: number;

- Controles de reproducción (anterior, play/pause, siguiente)  queue: Song[];

- Barra de progreso interactiva (seekbar)  currentIndex: number;

- Tiempo actual / duración total  

- Control de volumen con slider emergente  // Acciones

- Diseño responsivo  playSong: (song: Song) => void;

  playQueue: (songs: Song[], startIndex: number) => void;

## 🗺️ Roadmap  togglePlay: () => void;

  nextSong: () => void;

### Sprint 2 (Actual) ✅  previousSong: () => void;

- ✅ Reproductor con Howler.js  setVolume: (volume: number) => void;

- ✅ Sistema de carga para creators}

```

### Sprint 3 (Próximo) 📋

- Búsqueda de canciones/álbumes/artistas### Características del Reproductor

- Sistema de likes (favoritos)- 🎵 Reproducción suave sin cortes

- Historial de reproducción- 📊 Barra de progreso interactiva

- 🔊 Control de volumen con animación

### Sprint 4 (Final) 📋- ⏭️ Navegación entre canciones de la cola

- Playlists personalizadas- 📱 Diseño responsive

- Compartir canciones- ✨ Animaciones Framer Motion

- UI/UX pulido

- Preparación para producción---



## 🐛 Problemas Conocidos## 📝 Modelos de Base de Datos



- Las dependencias npm tienen 2 vulnerabilidades moderadas (no críticas)### Song (Canción)

- El upload de álbumes requiere que todos los archivos se suban correctamente```python

- La validación de duración es manual (debe calcularse en frontend)class Song(Base):

    id: Integer

## 📝 Notas de Desarrollo    title: String

    artist: String

### Diferencias con Sprint 1    duration: Integer  # En segundos

1. **Puerto backend**: 8001 → 8002    file_path: String

2. **Puerto frontend**: 5174 → 5175    cover_url: String (optional)

3. **Endpoints**: `/mvp/sprint1/*` → `/mvp/sprint2/*`    genre: String (optional)

4. **Tokens**: `sprint1_token` → `sprint2_token`    album_id: Integer (FK, optional)

5. **Nuevas dependencias**: howler, zustand    creator_id: Integer (FK)

6. **Nuevo router**: `upload.py`    is_approved: Boolean

    play_count: Integer

### Compartido con Main Project    created_at: DateTime

- Base de datos `music_app````

- Directorio `src/backend/uploads/`

- Modelos de datos (User, Song, Album)### Album (Álbum)

```python

### Testingclass Album(Base):

    id: Integer

```bash    title: String

# Backend    description: Text (optional)

cd backend    cover_image: String (optional)

pytest    release_date: DateTime (optional)

    creator_id: Integer (FK)

# Frontend    is_approved: Boolean

cd frontend    created_at: DateTime

npm run test    

    # Relación

# Linting    songs: List[Song]

npm run lint```

```

---

## 🎯 Próximos Pasos

## 🎓 Aprendizajes Clave

1. **Probar el player**:

   - Reproducir canciones### Backend

   - Verificar seekbar- Manejo de archivos multimedia con FastAPI

   - Probar controles de volumen- Streaming de audio

   - Verificar skip anterior/siguiente- Validación de formatos de archivo

- Relaciones One-to-Many (Album → Songs)

2. **Crear página de Upload** (TODO):- Extracción de metadata de MP3

   - Formulario para single

   - Formulario para álbum### Frontend

   - Preview de archivos- Integración de Howler.js para audio

   - Progress indicators- Gestión de estado complejo con Zustand

- Upload de archivos con FormData

3. **Testing**:- Manejo de colas de reproducción

   - Subir canciones como creator- Animaciones sincronizadas con reproducción

   - Verificar que aparecen con `is_approved=False`

   - Probar reproducción de canciones subidas---



## 📞 Contacto## 🐛 Limitaciones Conocidas



Para reportar problemas o sugerir mejoras, consulta el archivo `SPRINT_PLAN.md` en el directorio raíz del proyecto.- ❌ Sin búsqueda de canciones (Sprint 3)

- ❌ Sin sistema de likes (Sprint 3)

---- ❌ Sin playlists personalizadas (Sprint 3)

- ❌ Sin filtros por género

**Sprint 2** - P-Music TD © 2024- ⚠️ Duración calculada del lado del cliente (mejorar en Sprint 4)


---

## 📈 Próximo Sprint

En el **Sprint 3** implementaremos:
- ❤️ Sistema de likes/favoritos
- 🔍 Búsqueda avanzada
- 📋 Playlists personalizadas
- 📚 Biblioteca musical
- 🔗 Compartir canciones

---

## 🔧 Troubleshooting

### El audio no se reproduce
- Verificar que el archivo MP3 es válido
- Revisar console del navegador
- Confirmar que Howler.js está instalado

### Error al subir archivos
- Verificar límites de tamaño (20MB audio, 5MB imagen)
- Confirmar formato MP3 para audio
- Revisar permisos de directorio uploads/

### Duración incorrecta
- El cálculo se hace con Web Audio API
- Algunos MP3 pueden tener metadata incorrecta
- Verificar que el archivo no esté corrupto

---

## ✅ Checklist de Entrega

- [ ] Subida de canciones individuales funcional
- [ ] Subida de álbumes completos funcional
- [ ] Reproducción de audio sin interrupciones
- [ ] Controles de reproducción funcionando
- [ ] Barra de progreso interactiva
- [ ] Control de volumen suave
- [ ] Navegación skip forward/backward
- [ ] Contador de reproducciones actualizado
- [ ] Listado de canciones en Home
- [ ] Vista de detalles de álbum
- [ ] Portadas visualizadas correctamente

---

## 📦 Dependencias Nuevas

### Backend
```
python-multipart==0.0.6  # Upload de archivos
mutagen==1.47.0          # Metadata de MP3
```

### Frontend
```
howler: ^2.2.3           # Reproducción de audio
zustand: ^4.4.7          # Estado global
```

---

**🎉 ¡Sprint 2 Completado!**

Este MVP demuestra un sistema completo de gestión y reproducción de música, base fundamental del streaming.
