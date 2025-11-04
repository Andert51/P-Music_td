from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import Album, User, UserRole
from schemas import AlbumCreate, AlbumResponse
from dependencies import get_current_user, require_role

router = APIRouter(prefix="/albums", tags=["albums"])


@router.get("/", response_model=List[AlbumResponse])
async def get_albums(
    skip: int = 0,
    limit: int = 50,
    approved_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Album)
    if approved_only:
        query = query.filter(Album.is_approved == True)
    
    albums = query.offset(skip).limit(limit).all()
    return albums


@router.get("/{album_id}", response_model=AlbumResponse)
async def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found"
        )
    return album


@router.post("/", response_model=AlbumResponse, status_code=status.HTTP_201_CREATED)
async def create_album(
    album: AlbumCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.CREATOR, UserRole.ADMIN]))
):
    # Los creators y admins aprueban automáticamente sus propios álbumes
    is_approved = current_user.role in [UserRole.CREATOR, UserRole.ADMIN]
    
    new_album = Album(
        title=album.title,
        description=album.description,
        release_date=album.release_date,
        creator_id=current_user.id,
        is_approved=is_approved
    )
    
    db.add(new_album)
    db.commit()
    db.refresh(new_album)
    
    return new_album


@router.patch("/{album_id}/approve")
async def approve_album(
    album_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN]))
):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found"
        )
    
    album.is_approved = True
    db.commit()
    
    return {"message": "Album approved successfully", "album": album}


@router.put("/{album_id}")
async def update_album(
    album_id: int,
    album_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Actualiza un álbum existente. Solo el creador o un admin puede actualizar.
    """
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found"
        )
    
    # Verificar permisos
    if album.creator_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this album"
        )
    
    # Actualizar campos si se proporcionan
    if 'title' in album_data:
        album.title = album_data['title']
    if 'description' in album_data:
        album.description = album_data['description']
    if 'cover_image' in album_data:
        album.cover_image = album_data['cover_image']
    if 'cover_url' in album_data:  # Alias para cover_image
        album.cover_image = album_data['cover_url']
    if 'release_date' in album_data:
        album.release_date = album_data['release_date']
    
    db.commit()
    db.refresh(album)
    
    return album


@router.delete("/{album_id}")
async def delete_album(
    album_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    album = db.query(Album).filter(Album.id == album_id).first()
    if not album:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Album not found"
        )
    
    if album.creator_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this album"
        )
    
    db.delete(album)
    db.commit()
    
    return {"message": "Album deleted successfully"}
