from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import Playlist, PlaylistSong, User, Song
from schemas import PlaylistCreate, PlaylistResponse, PlaylistWithSongs
from dependencies import get_current_user

router = APIRouter(prefix="/playlists", tags=["playlists"])


@router.get("/", response_model=List[PlaylistResponse])
async def get_playlists(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlists = db.query(Playlist).filter(
        (Playlist.is_public == True) | (Playlist.owner_id == current_user.id)
    ).offset(skip).limit(limit).all()
    return playlists


@router.get("/my", response_model=List[PlaylistResponse])
async def get_my_playlists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlists = db.query(Playlist).filter(Playlist.owner_id == current_user.id).all()
    return playlists


@router.get("/{playlist_id}", response_model=PlaylistWithSongs)
async def get_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    if not playlist.is_public and playlist.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this playlist"
        )
    
    playlist_songs = db.query(Song).join(PlaylistSong).filter(
        PlaylistSong.playlist_id == playlist_id
    ).order_by(PlaylistSong.position).all()
    
    return {**playlist.__dict__, "songs": playlist_songs}


@router.post("/", response_model=PlaylistResponse, status_code=status.HTTP_201_CREATED)
async def create_playlist(
    playlist: PlaylistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_playlist = Playlist(
        name=playlist.name,
        description=playlist.description,
        is_public=playlist.is_public,
        owner_id=current_user.id
    )
    
    db.add(new_playlist)
    db.commit()
    db.refresh(new_playlist)
    
    return new_playlist


@router.post("/{playlist_id}/songs/{song_id}")
async def add_song_to_playlist(
    playlist_id: int,
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    if playlist.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this playlist"
        )
    
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    existing = db.query(PlaylistSong).filter(
        PlaylistSong.playlist_id == playlist_id,
        PlaylistSong.song_id == song_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song already in playlist"
        )
    
    max_position = db.query(PlaylistSong).filter(
        PlaylistSong.playlist_id == playlist_id
    ).count()
    
    playlist_song = PlaylistSong(
        playlist_id=playlist_id,
        song_id=song_id,
        position=max_position
    )
    
    db.add(playlist_song)
    db.commit()
    
    return {"message": "Song added to playlist successfully"}


@router.delete("/{playlist_id}/songs/{song_id}")
async def remove_song_from_playlist(
    playlist_id: int,
    song_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    if playlist.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this playlist"
        )
    
    playlist_song = db.query(PlaylistSong).filter(
        PlaylistSong.playlist_id == playlist_id,
        PlaylistSong.song_id == song_id
    ).first()
    
    if not playlist_song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not in playlist"
        )
    
    db.delete(playlist_song)
    db.commit()
    
    return {"message": "Song removed from playlist successfully"}


@router.delete("/{playlist_id}")
async def delete_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id).first()
    if not playlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Playlist not found"
        )
    
    if playlist.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this playlist"
        )
    
    db.delete(playlist)
    db.commit()
    
    return {"message": "Playlist deleted successfully"}
