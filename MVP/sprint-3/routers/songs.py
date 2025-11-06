"""
Router de Canciones - Sprint 3
Endpoints: /mvp/sprint3/songs/*
Incluye búsqueda, filtros y ordenamiento
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import Song
from schemas import SongResponse

router = APIRouter()

@router.get("/", response_model=List[SongResponse])
async def get_songs(
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None, min_length=1),
    album_id: Optional[int] = None,
    approved_only: bool = True,
    order_by: str = Query("play_count", regex="^(play_count|created_at|title)$"),
    db: Session = Depends(get_db)
):
    """
    Sprint 3: Obtiene canciones con búsqueda y filtros
    - search: Busca en título y artista (case-insensitive)
    - album_id: Filtra por álbum
    - approved_only: Solo canciones aprobadas
    - order_by: Ordenar por play_count, created_at o title
    - limit: Máximo de resultados (1-100)
    """
    query = db.query(Song)
    
    # Filtro de aprobación
    if approved_only:
        query = query.filter(Song.is_approved == True)
    
    # Filtro de álbum
    if album_id:
        query = query.filter(Song.album_id == album_id)
    
    # Búsqueda por título o artista (case-insensitive)
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (Song.title.ilike(search_term)) | 
            (Song.artist.ilike(search_term))
        )
    
    # Ordenamiento
    if order_by == "play_count":
        query = query.order_by(Song.play_count.desc())
    elif order_by == "created_at":
        query = query.order_by(Song.created_at.desc())
    elif order_by == "title":
        query = query.order_by(Song.title.asc())
    
    # Limitar resultados
    songs = query.limit(limit).all()
    
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
