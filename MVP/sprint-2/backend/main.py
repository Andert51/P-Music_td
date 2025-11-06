"""
Sprint 2 MVP - Backend
Autenticación + Canciones/Álbumes + PLAYER FUNCIONAL + UPLOAD
Base de datos: music_app (compartida)
Endpoints: /mvp/sprint2/*
MODO: Reproducción con Howler.js + Subida de canciones/álbumes
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from routers import auth, users, songs, albums, upload
import os

# NO crear tablas (ya existen en BD principal)

app = FastAPI(
    title="P-Music TD - Sprint 2 MVP",
    description="Player Funcional + Upload de Canciones/Álbumes",
    version="2.0.0"
)

# CORS para frontend (puerto 5175 del Sprint 2)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5175",  # Sprint 2 frontend
        "http://localhost:5174",  # Sprint 1 frontend
        "http://localhost:5173",  # Proyecto final
        "http://127.0.0.1:5175",
        "http://127.0.0.1:8002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos (audio/imágenes) desde la carpeta del proyecto principal
UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "src", "backend", "uploads"))

if os.path.exists(UPLOADS_DIR):
    app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
    print(f"✅ Sirviendo archivos desde: {UPLOADS_DIR}")
else:
    print(f"⚠️ Directorio de uploads no encontrado: {UPLOADS_DIR}")

# Routers con prefijo /mvp/sprint2
app.include_router(auth.router, prefix="/mvp/sprint2/auth", tags=["Sprint2-Auth"])
app.include_router(users.router, prefix="/mvp/sprint2/users", tags=["Sprint2-Users"])
app.include_router(songs.router, prefix="/mvp/sprint2/songs", tags=["Sprint2-Songs"])
app.include_router(albums.router, prefix="/mvp/sprint2/albums", tags=["Sprint2-Albums"])
app.include_router(upload.router, prefix="/mvp/sprint2/upload", tags=["Sprint2-Upload"])

@app.get("/")
async def root():
    return {
        "message": "P-Music TD - Sprint 2 MVP",
        "version": "2.0.0",
        "sprint": "2",
        "features": [
            "✅ Autenticación (Login/Register)",
            "✅ Player funcional con Howler.js",
            "✅ Seekbar y controles de reproducción",
            "✅ Subida de sencillos (creators)",
            "✅ Subida de álbumes (creators)",
            "✅ Visualización de canciones/álbumes"
        ],
        "endpoints": {
            "auth": "/mvp/sprint2/auth",
            "users": "/mvp/sprint2/users",
            "songs": "/mvp/sprint2/songs",
            "albums": "/mvp/sprint2/albums",
            "upload": "/mvp/sprint2/upload"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "sprint": "2"}

