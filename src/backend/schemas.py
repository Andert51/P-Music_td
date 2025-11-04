from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    PREMIUM = "premium"
    CREATOR = "creator"
    ADMIN = "admin"


class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.USER


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    profile_picture: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class SongBase(BaseModel):
    title: str
    artist: str
    duration: int
    album_id: Optional[int] = None
    genre: Optional[str] = None


class SongCreate(SongBase):
    file_path: str
    cover_url: Optional[str] = None


class SongResponse(SongBase):
    id: int
    cover_url: Optional[str] = None
    file_path: str
    creator_id: int
    is_approved: bool
    play_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class AlbumBase(BaseModel):
    title: str
    description: Optional[str] = None
    release_date: Optional[datetime] = None


class AlbumCreate(AlbumBase):
    pass


class AlbumResponse(AlbumBase):
    id: int
    cover_image: Optional[str] = None
    creator_id: int
    is_approved: bool
    created_at: datetime
    songs: List[SongResponse] = []
    
    class Config:
        from_attributes = True


class PlaylistBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = True


class PlaylistCreate(PlaylistBase):
    pass


class PlaylistResponse(PlaylistBase):
    id: int
    cover_image: Optional[str] = None
    owner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PlaylistWithSongs(PlaylistResponse):
    songs: List[SongResponse] = []
    
    class Config:
        from_attributes = True
