from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import Song, User, UserRole
from schemas import SongCreate, SongResponse
from dependencies import get_current_user, require_role

router = APIRouter(prefix="/songs", tags=["songs"])


@router.get("/", response_model=List[SongResponse])
async def get_songs(
    skip: int = 0,
    limit: int = 50,
    approved_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Song)
    if approved_only:
        query = query.filter(Song.is_approved == True)
    
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
