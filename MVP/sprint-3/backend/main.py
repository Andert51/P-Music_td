"""
Sprint 3 MVP - Backend
Autenticación + Canciones/Álbumes + PLAYER + UPLOAD + BÚSQUEDA + SIDEBAR
Base de datos: music_app (compartida)
Endpoints: /mvp/sprint3/*
MODO: Sistema completo con búsqueda, álbumes y subida
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from routers import auth, users, songs, albums, upload
import os

# NO crear tablas (ya existen en BD principal)

app = FastAPI(
    title="P-Music TD - Sprint 3 MVP",
    description="Sistema Completo: Búsqueda + Álbumes + Upload",
    version="3.0.0"
)

# CORS DEBE IR ANTES DE CUALQUIER MIDDLEWARE O MOUNT
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5176",
        "http://127.0.0.1:5176",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Servir archivos estáticos (audio/imágenes) desde la carpeta del proyecto principal
UPLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "src", "backend", "uploads"))

if os.path.exists(UPLOADS_DIR):
    app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")
    print(f"✅ Sirviendo archivos desde: {UPLOADS_DIR}")
else:
    print(f"⚠️ Directorio de uploads no encontrado: {UPLOADS_DIR}")

# Routers con prefijo /mvp/sprint3
app.include_router(auth.router, prefix="/mvp/sprint3/auth", tags=["Sprint3-Auth"])
app.include_router(users.router, prefix="/mvp/sprint3/users", tags=["Sprint3-Users"])
app.include_router(songs.router, prefix="/mvp/sprint3/songs", tags=["Sprint3-Songs"])
app.include_router(albums.router, prefix="/mvp/sprint3/albums", tags=["Sprint3-Albums"])
app.include_router(upload.router, prefix="/mvp/sprint3/upload", tags=["Sprint3-Upload"])

@app.get("/")
async def root():
    return {
        "message": "P-Music TD - Sprint 3 MVP",
        "version": "3.0.0",
        "sprint": "3",
        "features": [
            "✅ Autenticación (Login/Register)",
            "✅ Player funcional con Howler.js",
            "✅ Búsqueda de canciones",
            "✅ Página de álbumes funcional",
            "✅ Subida de sencillos y álbumes (creators)",
            "✅ Sidebar con navegación completa"
        ],
        "endpoints": {
            "auth": "/mvp/sprint3/auth",
            "users": "/mvp/sprint3/users",
            "songs": "/mvp/sprint3/songs",
            "albums": "/mvp/sprint3/albums",
            "upload": "/mvp/sprint3/upload"
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "sprint": "3"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)

