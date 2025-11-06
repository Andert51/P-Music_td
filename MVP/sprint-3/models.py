"""
Modelos de datos para Sprint 1
IMPORTANTE: Usa los mismos modelos que el proyecto principal (music_app)
Sprint 1 trabaja con las tablas: users, songs, albums
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base
import enum

class UserRole(str, enum.Enum):
    USER = "user"
    PREMIUM = "premium"
    CREATOR = "creator"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True)
    profile_picture = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<User {self.username} ({self.role})>"


class Album(Base):
    __tablename__ = "albums"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    cover_image = Column(String, nullable=True)
    release_date = Column(DateTime, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Album {self.title}>"


class Song(Base):
    __tablename__ = "songs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    artist = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    file_path = Column(String, nullable=False)
    cover_url = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_approved = Column(Boolean, default=False)
    play_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Song {self.title} by {self.artist}>"

