"""
Router de Upload - Sprint 2
Endpoints: /mvp/sprint2/upload/*
Subida de canciones y álbumes (solo creators y admins)
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path
import uuid
import shutil
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import User, Song, Album
from auth_utils import get_current_active_user
from datetime import datetime

router = APIRouter()

# Configuración de directorios (usar los del proyecto principal)
UPLOAD_BASE = Path(__file__).parent.parent.parent.parent.parent / "src" / "backend" / "uploads"
SONGS_DIR = UPLOAD_BASE / "songs"
COVERS_SONGS_DIR = UPLOAD_BASE / "covers" / "songs"
COVERS_ALBUMS_DIR = UPLOAD_BASE / "covers" / "albums"

# Crear directorios si no existen
for directory in [SONGS_DIR, COVERS_SONGS_DIR, COVERS_ALBUMS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Tipos permitidos
ALLOWED_AUDIO = ["audio/mpeg", "audio/mp3", "audio/wav"]
ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
MAX_AUDIO_SIZE = 20 * 1024 * 1024  # 20 MB
MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5 MB


def validate_file(file: UploadFile, allowed_types: List[str], max_size: int, name: str):
    """Valida tipo y tamaño de archivo"""
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"{name} debe ser: {', '.join(allowed_types)}")
    
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    
    if size > max_size:
        raise HTTPException(status_code=400, detail=f"{name} no debe superar {max_size / (1024 * 1024)} MB")


def save_file(file: UploadFile, dest_dir: Path) -> str:
    """Guarda archivo y retorna path relativo"""
    try:
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = dest_dir / filename
        
        with filepath.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Retornar path relativo desde uploads/
        relative = filepath.relative_to(UPLOAD_BASE)
        return f"/uploads/{str(relative).replace(chr(92), '/')}"  # Reemplazar backslash
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar: {str(e)}")
    finally:
        file.file.close()


@router.post("/single")
async def upload_single(
    title: str = Form(...),
    artist: str = Form(...),
    duration: int = Form(...),
    genre: Optional[str] = Form(None),
    audio_file: UploadFile = File(...),
    cover_file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Subir un sencillo (canción individual)
    Solo accesible para creators y admins
    """
    # Verificar permisos
    if current_user.role not in ["creator", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo creators y admins pueden subir canciones"
        )
    
    # Validar archivos
    validate_file(audio_file, ALLOWED_AUDIO, MAX_AUDIO_SIZE, "Audio")
    
    # Guardar audio
    audio_path = save_file(audio_file, SONGS_DIR)
    
    # Guardar cover (opcional)
    cover_path = None
    if cover_file:
        validate_file(cover_file, ALLOWED_IMAGES, MAX_IMAGE_SIZE, "Cover")
        cover_path = save_file(cover_file, COVERS_SONGS_DIR)
    
    # Crear canción en BD
    new_song = Song(
        title=title,
        artist=artist,
        duration=duration,
        file_path=audio_path,
        cover_url=cover_path,
        genre=genre,
        creator_id=current_user.id,
        is_approved=False,  # Pendiente de aprobación
        play_count=0
    )
    
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    
    return {
        "message": "✅ Sencillo subido exitosamente (pendiente de aprobación)",
        "song": {
            "id": new_song.id,
            "title": new_song.title,
            "artist": new_song.artist,
            "duration": new_song.duration,
            "file_path": new_song.file_path,
            "cover_url": new_song.cover_url,
            "genre": new_song.genre,
            "is_approved": new_song.is_approved
        }
    }


@router.post("/album")
async def upload_album(
    album_title: str = Form(...),
    album_description: Optional[str] = Form(None),
    release_date: Optional[str] = Form(None),
    songs_data: str = Form(...),  # JSON string con info de canciones
    album_cover: Optional[UploadFile] = File(None),
    audio_files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Subir un álbum completo con múltiples canciones
    Solo accesible para creators y admins
    """
    # Verificar permisos
    if current_user.role not in ["creator", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo creators y admins pueden subir álbumes"
        )
    
    import json
    try:
        songs_info = json.loads(songs_data)
    except:
        raise HTTPException(status_code=400, detail="songs_data debe ser JSON válido")
    
    # Validar que coincidan cantidad de archivos y datos
    if len(audio_files) != len(songs_info):
        raise HTTPException(
            status_code=400,
            detail=f"Número de archivos ({len(audio_files)}) no coincide con songs_data ({len(songs_info)})"
        )
    
    # Guardar cover del álbum
    cover_path = None
    if album_cover:
        validate_file(album_cover, ALLOWED_IMAGES, MAX_IMAGE_SIZE, "Album Cover")
        cover_path = save_file(album_cover, COVERS_ALBUMS_DIR)
    
    # Crear álbum
    release_dt = None
    if release_date:
        try:
            release_dt = datetime.fromisoformat(release_date.replace('Z', '+00:00'))
        except:
            pass
    
    new_album = Album(
        title=album_title,
        description=album_description,
        cover_image=cover_path,
        release_date=release_dt,
        creator_id=current_user.id,
        is_approved=False
    )
    
    db.add(new_album)
    db.commit()
    db.refresh(new_album)
    
    # Subir canciones del álbum
    uploaded_songs = []
    for i, (audio_file, song_info) in enumerate(zip(audio_files, songs_info)):
        validate_file(audio_file, ALLOWED_AUDIO, MAX_AUDIO_SIZE, f"Audio {i+1}")
        
        audio_path = save_file(audio_file, SONGS_DIR)
        
        new_song = Song(
            title=song_info.get("title", f"Track {i+1}"),
            artist=song_info.get("artist", current_user.username),
            duration=song_info.get("duration", 0),
            file_path=audio_path,
            cover_url=cover_path,  # Usar cover del álbum
            genre=song_info.get("genre"),
            album_id=new_album.id,
            creator_id=current_user.id,
            is_approved=False,
            play_count=0
        )
        
        db.add(new_song)
        uploaded_songs.append(new_song)
    
    db.commit()
    
    return {
        "message": f"✅ Álbum '{album_title}' subido exitosamente (pendiente de aprobación)",
        "album": {
            "id": new_album.id,
            "title": new_album.title,
            "description": new_album.description,
            "cover_image": new_album.cover_image,
            "is_approved": new_album.is_approved,
            "songs_count": len(uploaded_songs)
        },
        "songs": [{"id": s.id, "title": s.title, "artist": s.artist} for s in uploaded_songs]
    }


@router.get("/my-uploads")
async def get_my_uploads(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Obtener canciones subidas por el usuario actual"""
    songs = db.query(Song)\
        .filter(Song.creator_id == current_user.id)\
        .order_by(Song.created_at.desc())\
        .all()
    
    albums = db.query(Album)\
        .filter(Album.creator_id == current_user.id)\
        .order_by(Album.created_at.desc())\
        .all()
    
    return {
        "songs": [
            {
                "id": s.id,
                "title": s.title,
                "artist": s.artist,
                "is_approved": s.is_approved,
                "play_count": s.play_count,
                "created_at": s.created_at
            } for s in songs
        ],
        "albums": [
            {
                "id": a.id,
                "title": a.title,
                "is_approved": a.is_approved,
                "created_at": a.created_at
            } for a in albums
        ]
    }
