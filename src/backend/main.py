from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from routes import auth, users, songs, playlists, albums, upload
from database import engine, Base
from config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Music Streaming API",
    description="Spotify-like music streaming platform API",
    version="1.0.0"
)

# CORS debe estar ANTES de los routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],  # Importante para audio streaming
)

# Crear directorio de uploads si no existe
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Middleware personalizado para CORS en archivos estáticos
@app.middleware("http")
async def add_cors_to_static_files(request: Request, call_next):
    response = await call_next(request)
    
    # Añadir headers CORS a archivos estáticos (uploads)
    if request.url.path.startswith("/uploads"):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Expose-Headers"] = "Content-Length, Content-Range"
        response.headers["Accept-Ranges"] = "bytes"
    
    return response

# Montar directorio de archivos estáticos
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(songs.router)
app.include_router(playlists.router)
app.include_router(albums.router)
app.include_router(upload.router)


@app.get("/")
async def root():
    return {
        "message": "Music Streaming API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=True
    )
