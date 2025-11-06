"""
Schemas Pydantic para Sprint 1
Compatibles con el proyecto principal
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserRole:
    USER = "user"
    PREMIUM = "premium"
    CREATOR = "creator"
    ADMIN = "admin"

# --- Auth Schemas ---
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(default="user")

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    profile_picture: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[str] = None


# --- Song Schemas ---
class SongResponse(BaseModel):
    id: int
    title: str
    artist: str
    duration: int
    file_path: str
    cover_url: Optional[str] = None
    genre: Optional[str] = None
    album_id: Optional[int] = None
    play_count: int
    is_approved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# --- Album Schemas ---
class AlbumResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    release_date: Optional[datetime] = None
    creator_id: int
    is_approved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

