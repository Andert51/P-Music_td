# 🎵 Panal-Music - Music Streaming Platform

<div align="center">

A modern, full-stack music streaming application built with FastAPI and React, featuring audio playback, content management, and user authentication.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat&logo=postgresql)](https://www.postgresql.org)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Scripts & Commands](#-scripts--commands)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Panal-Music** is a Spotify-like music streaming platform that allows users to discover, upload, and play music. Built with modern web technologies, it features a robust backend API, responsive frontend, and comprehensive music management capabilities.

### Key Highlights

- 🎵 **Full Audio Playback** - Stream music with Howler.js powered player
- 📤 **Content Upload** - Upload songs and albums with metadata
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based authentication system
- 👥 **Role-Based Access** - User, Creator, Premium, and Admin roles
- 📊 **Analytics** - Track plays and popular content
- 🎼 **Album Management** - Organize songs into albums
- ❤️ **Favorites** - Like and save favorite tracks
- 📋 **Playlists** - Create and manage custom playlists

---

## ✨ Features

### User Features
- ✅ User registration and authentication
- ✅ Browse songs, albums, and artists
- ✅ Search functionality across all content
- ✅ Audio playback with full controls (play, pause, skip, seek)
- ✅ Volume control with visual feedback
- ✅ Like songs and build favorites library
- ✅ Create and manage custom playlists
- ✅ View listening history

### Creator Features
- ✅ Upload individual songs with cover art
- ✅ Create and upload full albums
- ✅ Manage uploaded content
- ✅ View content approval status
- ✅ Track play counts and analytics

### Admin Features
- ✅ Content moderation and approval
- ✅ User management
- ✅ Full system access
- ✅ Platform analytics

---

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI 0.109.0
- **Language**: Python 3.12+
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Bcrypt
- **Server**: Uvicorn (ASGI)
- **Validation**: Pydantic
- **File Upload**: python-multipart, aiofiles

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 5.2.2
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.4.0
- **State Management**: Zustand 4.4.7
- **Routing**: React Router 6.21.1
- **HTTP Client**: Axios 1.6.5
- **Audio**: Howler.js 2.2.4
- **Animations**: Framer Motion 10.18.0
- **Notifications**: React Hot Toast 2.4.1
- **Icons**: Lucide React 0.303.0

### Development Tools
- **Linting**: ESLint, TypeScript ESLint
- **Testing**: Pytest, pytest-asyncio
- **Code Quality**: Autoprefixer, PostCSS

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.12+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm 10+** (comes with Node.js)
- **PostgreSQL** - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** - [Download Git](https://git-scm.com/downloads)

### Verify Installation

```bash
python --version    # Should be 3.12+
node --version      # Should be v18+
npm --version       # Should be 10+
psql --version      # Verify PostgreSQL is installed
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Andert51/P-Music_td.git
cd P-Music_td
```

### 2. Database Setup

Create the PostgreSQL database:

```bash
# Using psql
psql -U postgres
CREATE DATABASE music_app;
\q

# Or using createdb command
createdb music_app
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/music_app

# Security
SECRET_KEY=your-secret-key-here-generate-a-secure-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Upload Configuration
UPLOAD_DIR=./uploads
```

**Generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Automated Setup

The easiest way to get started is using the setup script:

```powershell
# Windows PowerShell
.\setup.ps1
```

This script will:
- Create Python virtual environment
- Install backend dependencies
- Install frontend dependencies
- Set up directory structure

### 5. Run Database Migrations

```powershell
.\migrate.ps1
```

Or manually:
```bash
# Activate virtual environment first
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Run migrations
alembic upgrade head
```

### 6. Start the Application

**Option 1: Using automated script (Recommended)**

```powershell
# Windows - Double click start.bat or run:
.\start.ps1
```

**Option 2: Manual start**

```bash
# Terminal 1 - Backend
cd src/backend
python main.py
# Or with uvicorn: uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd src/frontend
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 8. Create Your First Account

1. Navigate to http://localhost:5173
2. Click "Register"
3. Choose role:
   - **User**: Basic streaming access
   - **Creator**: Can upload content
4. Start exploring!

---

## 📁 Project Structure

```
P-Music_td/
├── src/
│   ├── backend/                  # FastAPI Backend
│   │   ├── routes/              # API Endpoints
│   │   │   ├── auth.py          # Authentication
│   │   │   ├── users.py         # User management
│   │   │   ├── songs.py         # Song operations
│   │   │   ├── albums.py        # Album management
│   │   │   ├── playlists.py     # Playlist operations
│   │   │   └── upload.py        # File uploads
│   │   ├── models/              # Database models
│   │   │   └── __init__.py      # SQLAlchemy models
│   │   ├── scripts/             # Utility scripts
│   │   ├── uploads/             # Uploaded files
│   │   │   ├── songs/           # Audio files
│   │   │   ├── covers/          # Cover images
│   │   │   └── avatars/         # Profile pictures
│   │   ├── main.py              # Application entry point
│   │   ├── auth.py              # Authentication utilities
│   │   ├── database.py          # Database configuration
│   │   ├── config.py            # Settings management
│   │   ├── dependencies.py      # FastAPI dependencies
│   │   └── schemas.py           # Pydantic schemas
│   │
│   └── frontend/                 # React Frontend
│       ├── src/
│       │   ├── components/      # Reusable components
│       │   │   ├── Layout.tsx   # Main layout
│       │   │   ├── Navbar.tsx   # Navigation bar
│       │   │   ├── Sidebar.tsx  # Side navigation
│       │   │   ├── Player.tsx   # Audio player
│       │   │   └── SongCard.tsx # Song display
│       │   ├── pages/           # Route pages
│       │   │   ├── Home.tsx     # Home page
│       │   │   ├── Login.tsx    # Login page
│       │   │   ├── Register.tsx # Registration
│       │   │   ├── Library.tsx  # User library
│       │   │   ├── Search.tsx   # Search page
│       │   │   ├── Albums.tsx   # Albums listing
│       │   │   └── ...          # Other pages
│       │   ├── store/           # State management
│       │   │   ├── authStore.ts # Auth state
│       │   │   └── playerStore.ts # Player state
│       │   ├── types/           # TypeScript definitions
│       │   │   └── index.ts     # Type definitions
│       │   ├── lib/             # Utilities
│       │   ├── App.tsx          # Main app component
│       │   └── main.tsx         # Entry point
│       ├── public/              # Static assets
│       ├── package.json         # Dependencies
│       └── vite.config.ts       # Vite configuration
│
├── alembic/                      # Database migrations
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md          # Architecture details
│   └── SCRIPTS.md               # Scripts documentation
├── MVP/                          # Sprint-based development
│   ├── sprint-1/                # Initial MVP
│   ├── sprint-2/                # Player & Upload
│   └── sprint-3/                # Advanced features
├── design/                       # Design assets
├── .env                          # Environment variables
├── .gitignore                   # Git ignore rules
├── alembic.ini                  # Alembic configuration
├── requirements.txt             # Python dependencies
├── setup.ps1                    # Setup script
├── start.ps1                    # Start script
├── stop.ps1                     # Stop script
├── status.ps1                   # Status check script
├── migrate.ps1                  # Migration script
└── README.md                    # This file
```

---

## ⚙️ Configuration

### Backend Configuration

Edit `src/backend/config.py` or set environment variables:

```python
DATABASE_URL = "postgresql://user:password@localhost:5432/music_app"
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200  # 30 days
```

### Frontend Configuration

Edit `src/frontend/src/config.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:8000';
```

### Database Configuration

Edit `alembic.ini` for migration settings:

```ini
sqlalchemy.url = postgresql://postgres:password@localhost:5432/music_app
```

---

## 📜 Scripts & Commands

### Automated Scripts (PowerShell)

| Script | Description | Usage |
|--------|-------------|-------|
| `setup.ps1` | Initial project setup | `.\setup.ps1` |
| `start.ps1` | Start both servers | `.\start.ps1` |
| `stop.ps1` | Stop all services | `.\stop.ps1` |
| `status.ps1` | Check system status | `.\status.ps1` |
| `migrate.ps1` | Run database migrations | `.\migrate.ps1` |

### Batch Files (Double-Click)

- `start.bat` - Start application
- `stop.bat` - Stop application
- `status.bat` - Check status

### Script Options

```powershell
# Start with options
.\start.ps1 -InstallDeps    # Install dependencies first
.\start.ps1 -SkipChecks     # Skip pre-flight checks
.\start.ps1 -Force          # Force start even if ports are busy
```

### Manual Commands

#### Backend Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Create a new migration
alembic revision --autogenerate -m "Description"

# Start development server
cd src/backend
uvicorn main:app --reload --port 8000

# Run tests
pytest

# Run with specific Python version
python3.12 -m uvicorn main:app --reload
```

#### Frontend Commands

```bash
# Install dependencies
cd src/frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

For detailed scripts documentation, see [docs/SCRIPTS.md](docs/SCRIPTS.md).

---

## 📚 API Documentation

### Base URL

```
http://localhost:8000
```

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Authentication

All protected endpoints require a Bearer token:

```bash
Authorization: Bearer <your_jwt_token>
```

### Main Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |

#### Songs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/songs/` | List all approved songs | No |
| GET | `/songs/{id}` | Get song details | No |
| POST | `/songs/{id}/play` | Increment play count | Yes |
| GET | `/songs/{id}/file` | Stream audio file | Yes |

#### Albums

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/albums/` | List all albums | No |
| GET | `/albums/{id}` | Get album with songs | No |
| POST | `/albums/` | Create album | Yes (Creator) |

#### Playlists

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/playlists/` | List user playlists | Yes |
| POST | `/playlists/` | Create playlist | Yes |
| GET | `/playlists/{id}` | Get playlist details | Yes |
| POST | `/playlists/{id}/songs/{song_id}` | Add song to playlist | Yes |
| DELETE | `/playlists/{id}/songs/{song_id}` | Remove song | Yes |

#### Upload (Creator/Admin only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload/song` | Upload single song | Yes (Creator) |
| POST | `/upload/album` | Upload full album | Yes (Creator) |
| GET | `/upload/my-uploads` | Get user uploads | Yes (Creator) |

### Request Examples

#### Register User

```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "newuser",
    "password": "securepassword123",
    "role": "user"
  }'
```

#### Login

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "securepassword123"
  }'
```

#### Get Songs

```bash
curl "http://localhost:8000/songs/" \
  -H "Authorization: Bearer <token>"
```

#### Upload Song

```bash
curl -X POST "http://localhost:8000/upload/song" \
  -H "Authorization: Bearer <token>" \
  -F "audio=@song.mp3" \
  -F "cover=@cover.jpg" \
  -F "title=My Song" \
  -F "artist=Artist Name" \
  -F "duration=240"
```

---

## 👨‍💻 Development

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   # Backend tests
   cd src/backend
   pytest
   
   # Frontend lint
   cd src/frontend
   npm run lint
   ```

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

#### Python (Backend)
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions and classes
- Keep functions focused and small

```python
def get_song_by_id(db: Session, song_id: int) -> Optional[Song]:
    """
    Retrieve a song by its ID.
    
    Args:
        db: Database session
        song_id: ID of the song to retrieve
        
    Returns:
        Song object or None if not found
    """
    return db.query(Song).filter(Song.id == song_id).first()
```

#### TypeScript (Frontend)
- Use TypeScript strict mode
- Define interfaces for data structures
- Use functional components with hooks
- Follow React best practices

```typescript
interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
  file_path: string;
}

const SongCard: React.FC<{ song: Song }> = ({ song }) => {
  // Component logic
};
```

### Database Migrations

When you modify database models:

```bash
# Create a new migration
alembic revision --autogenerate -m "Add new column to songs table"

# Review the generated migration in alembic/versions/

# Apply migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

### Adding New Features

#### Backend
1. Create/modify model in `src/backend/models/__init__.py`
2. Create Pydantic schema in `src/backend/schemas.py`
3. Implement endpoint in appropriate router
4. Add tests in `tests/`

#### Frontend
1. Define TypeScript types in `src/types/index.ts`
2. Create component in `src/components/`
3. Add page in `src/pages/` if needed
4. Update routing in `App.tsx`
5. Add state management if needed

---

## 🧪 Testing

### Backend Testing

```bash
cd src/backend

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

### Frontend Testing

```bash
cd src/frontend

# Run linter
npm run lint

# Type checking
npm run type-check

# Build test
npm run build
```

### Manual Testing Checklist

- [ ] User registration works
- [ ] Login/logout functionality
- [ ] Song playback works smoothly
- [ ] File upload succeeds
- [ ] Playlists can be created
- [ ] Search returns results
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

**Problem**: "Address already in use" error

**Solution**:
```powershell
# Use the stop script
.\stop.ps1

# Or manually kill processes
# Windows
Get-Process -Name python | Stop-Process
Get-Process -Name node | Stop-Process

# Linux/Mac
killall python
killall node
```

#### Database Connection Error

**Problem**: Cannot connect to PostgreSQL

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Check credentials in `.env` file
3. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

#### Module Not Found

**Problem**: `ModuleNotFoundError` or similar

**Solutions**:
```bash
# Backend
cd src/backend
pip install -r ../../requirements.txt

# Frontend
cd src/frontend
npm install
```

#### Migration Errors

**Problem**: Alembic migration fails

**Solutions**:
```bash
# Check current revision
alembic current

# Show migration history
alembic history

# Reset to head (caution: may lose data)
alembic downgrade base
alembic upgrade head
```

#### Upload Fails

**Problem**: File upload returns error

**Solutions**:
1. Check file size limits (Audio: 20MB, Images: 5MB)
2. Verify file format (MP3 for audio, JPG/PNG for images)
3. Ensure uploads directory exists and has proper permissions:
   ```bash
   mkdir -p src/backend/uploads/{songs,covers/songs,covers/albums,avatars}
   ```

#### Frontend Not Loading

**Problem**: White screen or JavaScript errors

**Solutions**:
1. Check browser console for errors
2. Verify backend is running
3. Clear browser cache
4. Rebuild frontend:
   ```bash
   cd src/frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

#### CORS Errors

**Problem**: CORS policy blocking requests

**Solution**: Verify CORS settings in `src/backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Getting Help

1. Check [docs/SCRIPTS.md](docs/SCRIPTS.md) for script issues
2. Review [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
3. Run status check: `.\status.ps1`
4. Check application logs in terminal windows
5. Open an issue on GitHub

---

## 🏗 Architecture

### System Architecture

P-Music TD follows a **three-tier architecture**:

1. **Presentation Layer** - React frontend with TypeScript
2. **Application Layer** - FastAPI backend with Python
3. **Data Layer** - PostgreSQL database

```
┌─────────────────────────────────────────────────┐
│           Frontend (React + TypeScript)         │
│  Components | Pages | Store | Router            │
└─────────────────────┬───────────────────────────┘
                      │ HTTP/REST
                      ▼
┌─────────────────────────────────────────────────┐
│          Backend (FastAPI + Python)             │
│  Routes | Models | Schemas | Auth               │
└─────────────────────┬───────────────────────────┘
                      │ SQLAlchemy ORM
                      ▼
┌─────────────────────────────────────────────────┐
│           Database (PostgreSQL)                 │
│  Users | Songs | Albums | Playlists             │
└─────────────────────────────────────────────────┘
```

### Key Design Patterns

- **Repository Pattern** - Database access through SQLAlchemy models
- **Dependency Injection** - FastAPI dependencies for auth and database
- **State Management** - Zustand for global state (auth, player)
- **Component Composition** - Reusable React components
- **RESTful API** - Standard HTTP methods and status codes

### Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control (RBAC)
- CORS protection
- SQL injection prevention (SQLAlchemy)
- File upload validation
- Environment variable configuration

For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/P-Music_td.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Test thoroughly**
6. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Contribution Guidelines

- Write clean, documented code
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Keep PRs focused and atomic
- Be respectful and collaborative

### Commit Message Convention

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Andert51** - *Initial work* - [GitHub Profile](https://github.com/Andert51)

---

## 🙏 Acknowledgments

- FastAPI for the excellent framework
- React and TypeScript communities
- Howler.js for audio playback
- All contributors and testers

---

## 📞 Support

For support, questions, or feedback:

- 📧 Email: [Your Email]
- 🐛 Issues: [GitHub Issues](https://github.com/Andert51/P-Music_td/issues)
- 📖 Documentation: [docs/](docs/)

---

## 🗺️ Roadmap

### Current Version (v1.0.0)
- ✅ Core authentication system
- ✅ Audio streaming and playback
- ✅ File upload system
- ✅ Album and playlist management
- ✅ Search functionality
- ✅ User favorites

### Upcoming Features (v1.1.0)
- 🔄 Real-time notifications
- 🔄 Social features (follow artists)
- 🔄 Advanced analytics dashboard
- 🔄 Recommendation engine
- 🔄 Mobile app (React Native)

### Future Enhancements (v2.0.0)
- 🔮 Lyrics integration
- 🔮 Live streaming support
- 🔮 Payment integration
- 🔮 Advanced audio features (equalizer, crossfade)
- 🔮 Podcast support

---

## 📊 Project Stats

- **Backend**: Python, FastAPI, PostgreSQL
- **Frontend**: React, TypeScript, Vite
- **Lines of Code**: 10,000+
- **Components**: 20+
- **API Endpoints**: 30+
- **Database Tables**: 7

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

<div align="center">

**Built with ❤️ using FastAPI and React**

[⬆ Back to Top](#-p-music-td---music-streaming-platform)

</div>
