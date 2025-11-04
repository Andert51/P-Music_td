# 🎵 P-Music - Music Streaming Platform

Una plataforma moderna de streaming de música construida con FastAPI, React y SQLite. Presenta una hermosa interfaz oscura inspirada en Spotify con animaciones suaves y un robusto sistema de control de acceso basado en roles.

## ✨ Características

- 🎨 **Interfaz Oscura Hermosa** - Diseño inspirado en Spotify con animaciones suaves
- 🔐 **Autenticación y Autorización** - Autenticación basada en JWT con gestión de roles
- 👥 **Control de Acceso por Roles** - Roles de Usuario, Creator y Admin
- 🎵 **Reproductor de Música** - Reproductor completo con gestión de cola
- 📱 **Diseño Responsivo** - Funciona perfectamente en todos los dispositivos
- 🎼 **Gestión de Playlists** - Crea y gestiona playlists personalizadas
- 💿 **Soporte de Álbumes** - Organiza canciones en álbumes
- 🔍 **Funcionalidad de Búsqueda** - Encuentra canciones, artistas y álbumes
- ❤️ **Canciones Favoritas** - Guarda tus pistas favoritas
- 📊 **Dashboard de Admin** - Sistema de aprobación de contenido

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web moderno de Python
- **SQLite** - Base de datos relacional ligera
- **SQLAlchemy** - ORM para gestión de base de datos
- **JWT** - Autenticación segura
- **Pydantic** - Validación de datos

### Frontend
- **React 18** - Biblioteca UI moderna
- **TypeScript** - JavaScript con tipado seguro
- **Vite** - Herramienta de build rápida
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animaciones suaves
- **Zustand** - Gestión de estado
- **Axios** - Cliente HTTP
- **Howler.js** - Reproductor de audio (modo híbrido HTML5/Web Audio API)
- **React Router** - Enrutamiento del lado del cliente

## 📋 Prerequisitos

- Python 3.12.7+
- Node.js 18+
- npm o yarn

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd P_Music-td
```

### 2. Setup (First time only)

```powershell
.\setup.ps1
```

This script will:
- Create a Python virtual environment
- Install Python dependencies
- Install Node.js dependencies
- Create `.env` file from template

### 3. Configure Database

Update `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/music_app
DB_NAME=music_app
DB_USER=your_username
DB_PASSWORD=your_password
SECRET_KEY=your-secret-key-here
```

### 4. Create Database

```bash
createdb music_app
```

### 5. Run Migrations

```powershell
.\migrate.ps1
```

### 6. Start the Application

```powershell
.\start.ps1
```

This will start both servers:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Project Structure

```
P_Music-td/
├── src/
│   ├── backend/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # Authentication logic
│   │   ├── dependencies.py  # FastAPI dependencies
│   │   ├── database.py      # Database connection
│   │   ├── config.py        # Configuration
│   │   └── main.py          # FastAPI app
│   └── frontend/
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── pages/       # Page components
│       │   ├── store/       # Zustand stores
│       │   ├── types/       # TypeScript types
│       │   ├── lib/         # Utilities
│       │   └── App.tsx      # Main app component
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── alembic/                 # Database migrations
├── docs/                    # Documentation
├── requirements.txt         # Python dependencies
├── setup.ps1               # Initial setup script
├── start.ps1               # Start both servers
├── migrate.ps1             # Run migrations
└── README.md

```

## 🎭 User Roles

- **User** - Basic streaming access
- **Premium** - Ad-free experience and exclusive features
- **Creator** - Upload songs and albums (requires admin approval)
- **Admin** - Content moderation and user management

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/token` - Get access token

### Users
- `GET /users/me` - Get current user
- `GET /users/{id}` - Get user by ID
- `PATCH /users/{id}/role` - Update user role (Admin)

### Songs
- `GET /songs` - List songs
- `POST /songs` - Create song (Creator/Admin)
- `GET /songs/{id}` - Get song details
- `DELETE /songs/{id}` - Delete song
- `PATCH /songs/{id}/approve` - Approve song (Admin)

### Playlists
- `GET /playlists` - List playlists
- `POST /playlists` - Create playlist
- `GET /playlists/{id}` - Get playlist with songs
- `POST /playlists/{id}/songs/{song_id}` - Add song to playlist
- `DELETE /playlists/{id}/songs/{song_id}` - Remove song

### Albums
- `GET /albums` - List albums
- `POST /albums` - Create album (Creator/Admin)
- `GET /albums/{id}` - Get album details
- `PATCH /albums/{id}/approve` - Approve album (Admin)

## 🎨 Design Features

- **Dark Theme** - Easy on the eyes
- **Smooth Animations** - Framer Motion powered
- **Hover Effects** - Interactive UI elements
- **Responsive Grid** - Adaptive layouts
- **Custom Scrollbars** - Styled to match theme
- **Loading States** - Skeleton screens
- **Toast Notifications** - User feedback

## 🔧 Development

### Backend Development

```powershell
cd src\backend
.\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```

### Frontend Development

```powershell
cd src\frontend
npm run dev
```

### Create New Migration

```powershell
alembic revision --autogenerate -m "description"
alembic upgrade head
```

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/music_app
DB_HOST=localhost
DB_PORT=5432
DB_NAME=music_app
DB_USER=postgres
DB_PASSWORD=password

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_PORT=5173

# Environment
ENVIRONMENT=development

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## 🤝 Contributing

This project follows Scrum methodology with code in English. Pull requests are welcome.

## 📄 License

This project is private and confidential.

## 🎯 Future Features

- [ ] File upload for audio files
- [ ] Advanced search filters
- [ ] Social features (follow artists)
- [ ] Lyrics display
- [ ] Queue management
- [ ] Shuffle and repeat modes
- [ ] Download for offline listening (Premium)
- [ ] Artist analytics dashboard
- [ ] Payment integration for Premium
- [ ] Email verification
- [ ] Password reset
- [ ] Profile customization

## 🐛 Known Issues

- Audio files need to be properly configured
- File upload endpoint needs implementation
- Image upload for covers needs implementation

## 📞 Support

For support, please open an issue in the repository.

---

**Built with ❤️ using FastAPI, React, and PostgreSQL**
