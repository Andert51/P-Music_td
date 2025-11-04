import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid
import shutil

from database import get_db
from dependencies import get_current_user
from models import User, Song

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
