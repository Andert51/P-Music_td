import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from typing import List
import uuid
import shutil

from database import get_db
from dependencies import get_current_user
from models import User, Song, Album
from datetime import datetime

router = APIRouter(prefix="/upload", tags=["upload"])

# Configuración de directorios con estructura organizada
UPLOAD_DIR = Path("uploads")
SONGS_DIR = UPLOAD_DIR / "songs"
COVERS_SONGS_DIR = UPLOAD_DIR / "covers" / "songs"
COVERS_ALBUMS_DIR = UPLOAD_DIR / "covers" / "albums"
AVATARS_DIR = UPLOAD_DIR / "avatars"

# Crear directorios si no existen con estructura organizada
for directory in [SONGS_DIR, COVERS_SONGS_DIR, COVERS_ALBUMS_DIR, AVATARS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Configuración de tipos de archivo permitidos
ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"]
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
MAX_AUDIO_SIZE = 20 * 1024 * 1024  # 20 MB
MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5 MB


def validate_file_type(file: UploadFile, allowed_types: List[str], file_type: str):
    """Valida el tipo MIME del archivo"""
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"{file_type} debe ser uno de: {', '.join(allowed_types)}"
        )


def validate_file_size(file: UploadFile, max_size: int, file_type: str):
    """Valida el tamaño del archivo"""
    file.file.seek(0, 2)  # Ir al final del archivo
    size = file.file.tell()  # Obtener posición (tamaño)
    file.file.seek(0)  # Volver al inicio
    
    if size > max_size:
        max_size_mb = max_size / (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"{file_type} no debe superar {max_size_mb} MB"
        )


def save_upload_file(upload_file: UploadFile, destination: Path) -> str:
    """Guarda el archivo subido y retorna la ruta relativa con barras correctas para URLs"""
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        # Convertir a string y reemplazar backslashes con forward slashes para URLs
        relative_path = str(destination.relative_to(UPLOAD_DIR))
        return relative_path.replace("\\", "/")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar archivo: {str(e)}")
    finally:
        upload_file.file.close()


@router.post("/song")
async def upload_song(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sube un archivo de audio (canción)
    Solo accesible para creators y admins
    """
    # Verificar permisos
    if current_user.role not in ["creator", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Solo creators y admins pueden subir canciones"
        )
    
    # Validar tipo y tamaño
    validate_file_type(file, ALLOWED_AUDIO_TYPES, "Audio")
    validate_file_size(file, MAX_AUDIO_SIZE, "Audio")
    
    # Generar nombre único
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = SONGS_DIR / unique_filename
    
    # Guardar archivo
    relative_path = save_upload_file(file, file_path)
    
    return {
        "message": "Canción subida exitosamente",
        "filename": unique_filename,
        "path": f"/uploads/{relative_path}",
        "size": file_path.stat().st_size
    }


@router.post("/cover")
async def upload_cover(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sube una imagen de portada (cover)
    Solo accesible para creators y admins
    """
    # Verificar permisos
    if current_user.role not in ["creator", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Solo creators y admins pueden subir covers"
        )
    
    # Validar tipo y tamaño
    validate_file_type(file, ALLOWED_IMAGE_TYPES, "Imagen")
    validate_file_size(file, MAX_IMAGE_SIZE, "Imagen")
    
    # Generar nombre único y guardar en covers/songs (para portadas de canciones)
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = COVERS_SONGS_DIR / unique_filename
    
    # Guardar archivo
    relative_path = save_upload_file(file, file_path)
    
    return {
        "message": "Cover subido exitosamente",
        "filename": unique_filename,
        "path": f"/uploads/{relative_path}",
        "size": file_path.stat().st_size
    }


@router.post("/album-cover")
async def upload_album_cover(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Sube una portada de álbum.
    Solo accesible para creators y admins
    """
    # Verificar permisos
    if current_user.role not in ["creator", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Solo creators y admins pueden subir portadas de álbumes"
        )
    
    # Validar tipo y tamaño
    validate_file_type(file, ALLOWED_IMAGE_TYPES, "Imagen")
    validate_file_size(file, MAX_IMAGE_SIZE, "Imagen")
    
    # Generar nombre único y guardar en covers/albums
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = COVERS_ALBUMS_DIR / unique_filename
    
    # Guardar archivo
    relative_path = save_upload_file(file, file_path)
    
    return {
        "message": "Portada de álbum subida exitosamente",
        "filename": unique_filename,
        "path": f"/uploads/{relative_path}",
        "size": file_path.stat().st_size
    }


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sube una imagen de avatar de usuario
    """
    # Validar tipo y tamaño
    validate_file_type(file, ALLOWED_IMAGE_TYPES, "Imagen")
    validate_file_size(file, MAX_IMAGE_SIZE, "Imagen")
    
    # Generar nombre único
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"user_{current_user.id}_{uuid.uuid4()}.{file_extension}"
    file_path = AVATARS_DIR / unique_filename
    
    # Si el usuario ya tiene un avatar, eliminar el anterior
    if current_user.avatar_url:
        try:
            old_avatar_path = UPLOAD_DIR / current_user.avatar_url.replace("/uploads/", "")
            if old_avatar_path.exists():
                old_avatar_path.unlink()
        except Exception:
            pass  # Ignorar errores al eliminar avatar anterior
    
    # Guardar archivo
    relative_path = save_upload_file(file, file_path)
    
    # Actualizar usuario en BD
    current_user.avatar_url = f"/uploads/{relative_path}"
    db.commit()
    
    return {
        "message": "Avatar subido exitosamente",
        "filename": unique_filename,
        "path": f"/uploads/{relative_path}",
        "avatar_url": current_user.avatar_url
    }


@router.delete("/file/{file_type}/{filename}")
async def delete_file(
    file_type: str,
    filename: str,
    current_user: User = Depends(get_current_user)
):
    """
    Elimina un archivo subido
    Solo accesible para creators y admins
    """
    # Verificar permisos
    if current_user.role not in ["creator", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos para eliminar archivos"
        )
    
    # Determinar directorio según tipo
    type_map = {
        "song": SONGS_DIR,
        "cover_song": COVERS_SONGS_DIR,
        "cover_album": COVERS_ALBUMS_DIR,
        "cover": COVERS_SONGS_DIR,  # Alias para compatibilidad
        "avatar": AVATARS_DIR
    }
    
    if file_type not in type_map:
        raise HTTPException(
            status_code=400,
            detail="Tipo de archivo inválido"
        )
    
    file_path = type_map[file_type] / filename
    
    # Verificar si el archivo existe
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Archivo no encontrado"
        )
    
    # Eliminar archivo
    try:
        file_path.unlink()
        return {"message": "Archivo eliminado exitosamente"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al eliminar archivo: {str(e)}"
        )


@router.post("/album")
async def upload_album(
    album_title: str = Form(...),
    release_year: int = Form(None),
    album_cover: UploadFile = File(...),
    songs: List[UploadFile] = File(...),
    song_titles: List[str] = Form(None),
    song_artists: List[str] = Form(None),
    song_durations: List[int] = Form(None),
    song_genres: List[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sube un álbum completo con múltiples canciones y una portada
    Solo accesible para creators y admins
    """
    # Verificar permisos
    if current_user.role not in ["creator", "admin"]:
        raise HTTPException(
            status_code=403,
            detail="Solo creators y admins pueden subir álbumes"
        )
    
    # Validar que haya al menos una canción
    if not songs or len(songs) == 0:
        raise HTTPException(
            status_code=400,
            detail="Debe incluir al menos una canción"
        )
    
    # Validar que las listas de metadata tengan la misma longitud que las canciones
    num_songs = len(songs)
    if song_titles and len(song_titles) != num_songs:
        raise HTTPException(
            status_code=400,
            detail=f"Se esperan {num_songs} títulos de canciones, se recibieron {len(song_titles)}"
        )
    if song_artists and len(song_artists) != num_songs:
        raise HTTPException(
            status_code=400,
            detail=f"Se esperan {num_songs} artistas, se recibieron {len(song_artists)}"
        )
    if song_durations and len(song_durations) != num_songs:
        raise HTTPException(
            status_code=400,
            detail=f"Se esperan {num_songs} duraciones, se recibieron {len(song_durations)}"
        )
    if song_genres and len(song_genres) != num_songs:
        raise HTTPException(
            status_code=400,
            detail=f"Se esperan {num_songs} géneros, se recibieron {len(song_genres)}"
        )
    
    # Subir portada del álbum
    validate_file_type(album_cover, ALLOWED_IMAGE_TYPES, "Portada de álbum")
    validate_file_size(album_cover, MAX_IMAGE_SIZE, "Portada de álbum")
    
    cover_extension = album_cover.filename.split(".")[-1]
    cover_filename = f"{uuid.uuid4()}.{cover_extension}"
    cover_path = COVERS_ALBUMS_DIR / cover_filename
    cover_relative_path = save_upload_file(album_cover, cover_path)
    
    # Crear álbum en la base de datos
    release_date = datetime(release_year, 1, 1) if release_year else None
    is_approved = current_user.role in ["creator", "admin"]
    
    new_album = Album(
        title=album_title,
        cover_image=f"/uploads/{cover_relative_path}",
        release_date=release_date,
        creator_id=current_user.id,
        is_approved=is_approved
    )
    
    db.add(new_album)
    db.commit()
    db.refresh(new_album)
    
    # Subir y crear canciones
    uploaded_songs = []
    for idx, song_file in enumerate(songs):
        # Validar archivo de audio
        validate_file_type(song_file, ALLOWED_AUDIO_TYPES, f"Canción {idx + 1}")
        validate_file_size(song_file, MAX_AUDIO_SIZE, f"Canción {idx + 1}")
        
        # Guardar archivo de audio
        song_extension = song_file.filename.split(".")[-1]
        song_filename = f"{uuid.uuid4()}.{song_extension}"
        song_path = SONGS_DIR / song_filename
        song_relative_path = save_upload_file(song_file, song_path)
        
        # Obtener metadata de la canción con conversión segura de tipos
        title = song_titles[idx] if song_titles and idx < len(song_titles) else f"Track {idx + 1}"
        artist = song_artists[idx] if song_artists and idx < len(song_artists) else "Unknown Artist"
        
        # Convertir duración a int de forma segura
        try:
            duration = int(song_durations[idx]) if song_durations and idx < len(song_durations) else 180
        except (ValueError, TypeError):
            duration = 180
            
        genre = song_genres[idx] if song_genres and idx < len(song_genres) else None
        
        # Evitar géneros vacíos
        if genre and genre.strip().lower() in ['', 'sin género', 'none']:
            genre = None
        
        # Crear canción en la base de datos
        new_song = Song(
            title=title,
            artist=artist,
            duration=duration,
            genre=genre,
            file_path=f"/uploads/{song_relative_path}",
            cover_url=f"/uploads/{cover_relative_path}",  # Usar la misma portada del álbum
            album_id=new_album.id,
            creator_id=current_user.id,
            is_approved=is_approved
        )
        
        db.add(new_song)
        uploaded_songs.append({
            "title": title,
            "artist": artist,
            "file_path": f"/uploads/{song_relative_path}"
        })
    
    db.commit()
    
    return {
        "message": "Álbum subido exitosamente",
        "album": {
            "id": new_album.id,
            "title": new_album.title,
            "cover_image": new_album.cover_image,
            "release_date": str(new_album.release_date) if new_album.release_date else None
        },
        "songs": uploaded_songs,
        "total_songs": len(uploaded_songs)
    }
