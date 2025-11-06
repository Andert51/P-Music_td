"""
Sprint 1 MVP - Backend
Sistema de autenticación + visualización de canciones/álbumes
Base de datos: music_app (PRINCIPAL - compartida con proyecto final)
Endpoints: /mvp/sprint1/*
MODO: Lectura de canciones/álbumes existentes + autenticación
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import engine, Base
from routers import auth, users, songs, albums
import os

# NO crear tablas (ya existen en BD principal)
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="P-Music TD - Sprint 1 MVP",
    description="Autenticación + Canciones + Álbumes (usa BD principal)",
    version="1.0.0"
)

# CORS para frontend (puerto 5174 del Sprint 1)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",  # Sprint 1 frontend
        "http://localhost:5173",  # Proyecto final
        "http://localhost:3000"
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

# Routers con prefijo /mvp/sprint1
app.include_router(auth.router, prefix="/mvp/sprint1/auth", tags=["Sprint1-Auth"])
app.include_router(users.router, prefix="/mvp/sprint1/users", tags=["Sprint1-Users"])
app.include_router(songs.router, prefix="/mvp/sprint1/songs", tags=["Sprint1-Songs"])
app.include_router(albums.router, prefix="/mvp/sprint1/albums", tags=["Sprint1-Albums"])

@app.get("/")
async def root():
    return {
        "message": "P-Music TD - Sprint 1 MVP",
        "version": "1.0.0",
        "sprint": "1",
        "features": [
            "Autenticación (Login/Register)",
            "Visualización de canciones populares",
            "Visualización de álbumes",
            "Player básico (play/pause)"
        ],
        "endpoints": {
            "auth": "/mvp/sprint1/auth",
            "users": "/mvp/sprint1/users",
            "songs": "/mvp/sprint1/songs",
            "albums": "/mvp/sprint1/albums"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "sprint": "1"}

