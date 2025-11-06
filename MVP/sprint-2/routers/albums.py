"""
Router de Álbumes - Sprint 1
Endpoints: /mvp/sprint1/albums/*
Solo lectura de álbumes existentes (simplificado)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import Album, Song
from schemas import AlbumResponse, SongResponse

router = APIRouter()

@router.get("/", response_model=List[AlbumResponse])
async def get_albums(
    limit: int = 12,
    db: Session = Depends(get_db)
):
    """
    Sprint 1: Obtiene los álbumes más recientes
    Simplificado - solo muestra álbumes ordenados por fecha
    """
    albums = db.query(Album)\
        .order_by(Album.created_at.desc())\
        .limit(limit)\
        .all()
    
    return albums

@router.get("/{album_id}", response_model=AlbumResponse)
async def get_album(album_id: int, db: Session = Depends(get_db)):
    """
    Obtener un álbum específico por ID
    """
    album = db.query(Album).filter(Album.id == album_id).first()
    
    if not album:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found"
        )
    
    return album

@router.get("/{album_id}/songs", response_model=List[SongResponse])
async def get_album_songs(album_id: int, db: Session = Depends(get_db)):
    """
    Obtener canciones de un álbum
    """
    album = db.query(Album).filter(Album.id == album_id).first()
    
    if not album:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found"
        )
    
    songs = db.query(Song)\
        .filter(Song.album_id == album_id)\
        .filter(Song.is_approved == True)\
        .order_by(Song.track_number)\
        .all()
    
    return songs
