from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import Song, User, UserRole, LikedSong
from schemas import SongCreate, SongResponse
from dependencies import get_current_user, require_role

router = APIRouter(prefix="/songs", tags=["songs"])


@router.get("/", response_model=List[SongResponse])
async def get_songs(
    skip: int = 0,
    limit: int = 50,
    approved_only: bool = True,
    order_by: str = "play_count",  # play_count, created_at, title
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene lista de canciones con filtros y ordenamiento
    - order_by: play_count (default), created_at, title
    - search: busca por título o artista
    """
    query = db.query(Song)
    
    if approved_only:
        query = query.filter(Song.is_approved == True)
    
    # Búsqueda por título o artista
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Song.title.ilike(search_term)) | (Song.artist.ilike(search_term))
        )
    
    # Ordenamiento
    if order_by == "play_count":
        query = query.order_by(Song.play_count.desc())
    elif order_by == "created_at":
        query = query.order_by(Song.created_at.desc())
    elif order_by == "title":
        query = query.order_by(Song.title.asc())
    else:
        query = query.order_by(Song.play_count.desc())  # Default
    
    songs = query.offset(skip).limit(limit).all()
    return songs


@router.get("/{song_id}", response_model=SongResponse)
async def get_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    return song


@router.post("/", response_model=SongResponse, status_code=status.HTTP_201_CREATED)
async def create_song(
    song: SongCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.CREATOR, UserRole.ADMIN]))
):
    """
    Crea una nueva canción
    El file_path y cover_url deben ser obtenidos primero usando /upload/song y /upload/cover
    """
    # Los creators y admins aprueban automáticamente sus propias canciones
    is_approved = current_user.role in [UserRole.CREATOR, UserRole.ADMIN]
    
    new_song = Song(
        title=song.title,
        artist=song.artist,
        duration=song.duration,
        album_id=song.album_id,
        creator_id=current_user.id,
        file_path=song.file_path,
        cover_url=song.cover_url,
        genre=song.genre if hasattr(song, 'genre') else None,
        is_approved=is_approved
    )
    
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    
    return new_song


@router.patch("/{song_id}/approve")
async def approve_song(
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    song.is_approved = True
    db.commit()
    
    return {"message": "Song approved successfully", "song": song}


@router.delete("/{song_id}")
async def delete_song(
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    if song.creator_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this song"
        )
    
    db.delete(song)
    db.commit()
    
    return {"message": "Song deleted successfully"}


@router.post("/{song_id}/play")
async def increment_play_count(
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Incrementa el contador de reproducciones de una canción"""
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    song.play_count += 1
    db.commit()
    
    return {"message": "Play count incremented", "play_count": song.play_count}


@router.post("/{song_id}/like")
async def like_song(
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Agrega una canción a favoritos del usuario"""
    # Verificar que la canción existe
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    # Verificar si ya está en favoritos
    existing_like = db.query(LikedSong).filter(
        LikedSong.user_id == current_user.id,
        LikedSong.song_id == song_id
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song already liked"
        )
    
    # Agregar a favoritos
    new_like = LikedSong(
        user_id=current_user.id,
        song_id=song_id
    )
    
    db.add(new_like)
    db.commit()
    
    return {"message": "Song liked successfully", "song_id": song_id}


@router.delete("/{song_id}/like")
async def unlike_song(
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Elimina una canción de favoritos del usuario"""
    liked_song = db.query(LikedSong).filter(
        LikedSong.user_id == current_user.id,
        LikedSong.song_id == song_id
    ).first()
    
    if not liked_song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not in liked songs"
        )
    
    db.delete(liked_song)
    db.commit()
    
    return {"message": "Song unliked successfully", "song_id": song_id}


@router.get("/liked/all", response_model=List[SongResponse])
async def get_liked_songs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obtiene todas las canciones favoritas del usuario"""
    liked_songs = db.query(Song).join(LikedSong).filter(
        LikedSong.user_id == current_user.id
    ).order_by(LikedSong.liked_at.desc()).offset(skip).limit(limit).all()
    
    return liked_songs


@router.get("/{song_id}/is-liked")
async def check_if_liked(
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verifica si una canción está en favoritos del usuario"""
    liked = db.query(LikedSong).filter(
        LikedSong.user_id == current_user.id,
        LikedSong.song_id == song_id
    ).first()
    
    return {"is_liked": liked is not None, "song_id": song_id}


@router.post("/{song_id}/play")
async def increment_play_count(
    song_id: int,
    db: Session = Depends(get_db)
):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    song.play_count += 1
    db.commit()
    
    return {"message": "Play count incremented", "play_count": song.play_count}
