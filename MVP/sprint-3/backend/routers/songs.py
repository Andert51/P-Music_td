"""
Router de Canciones - Sprint 2
Endpoints: /mvp/sprint2/songs/*
Lectura de canciones con filtros (por álbum, etc.)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import Song
from schemas import SongResponse

router = APIRouter()

@router.get("/", response_model=List[SongResponse])
async def get_songs(
    limit: int = 20,
    album_id: int = None,
    db: Session = Depends(get_db)
):
    """
    Sprint 2: Obtiene canciones con filtros opcionales
    - limit: número máximo de canciones
    - album_id: filtrar por álbum específico
    """
    query = db.query(Song).filter(Song.is_approved == True)
    
    # Filtrar por álbum si se proporciona
    if album_id:
        query = query.filter(Song.album_id == album_id)
    
    songs = query.order_by(Song.play_count.desc()).limit(limit).all()
    
    return songs

@router.get("/{song_id}", response_model=SongResponse)
async def get_song(song_id: int, db: Session = Depends(get_db)):
    """
    Obtener una canción específica por ID
    """
    song = db.query(Song).filter(Song.id == song_id).first()
    
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    return song

@router.post("/{song_id}/play")
async def increment_play_count(song_id: int, db: Session = Depends(get_db)):
    """
    Incrementar contador de reproducciones
    """
    song = db.query(Song).filter(Song.id == song_id).first()
    
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    song.play_count += 1
    db.commit()
    
    return {"message": "Play count incremented", "play_count": song.play_count}
