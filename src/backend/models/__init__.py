from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import Base


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
    
    playlists = relationship("Playlist", back_populates="owner", cascade="all, delete-orphan")
    albums = relationship("Album", back_populates="creator", cascade="all, delete-orphan")
    songs = relationship("Song", back_populates="creator", cascade="all, delete-orphan")
    liked_songs = relationship("LikedSong", back_populates="user", cascade="all, delete-orphan")


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
    
    creator = relationship("User", back_populates="albums")
    songs = relationship("Song", back_populates="album", cascade="all, delete-orphan")


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
    
    creator = relationship("User", back_populates="songs")
    album = relationship("Album", back_populates="songs")
    playlist_songs = relationship("PlaylistSong", back_populates="song", cascade="all, delete-orphan")
    liked_by = relationship("LikedSong", back_populates="song", cascade="all, delete-orphan")


class Playlist(Base):
    __tablename__ = "playlists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    cover_image = Column(String, nullable=True)
    is_public = Column(Boolean, default=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner = relationship("User", back_populates="playlists")
    playlist_songs = relationship("PlaylistSong", back_populates="playlist", cascade="all, delete-orphan")


class PlaylistSong(Base):
    __tablename__ = "playlist_songs"
    
    id = Column(Integer, primary_key=True, index=True)
    playlist_id = Column(Integer, ForeignKey("playlists.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    position = Column(Integer, nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    
    playlist = relationship("Playlist", back_populates="playlist_songs")
    song = relationship("Song", back_populates="playlist_songs")


class LikedSong(Base):
    __tablename__ = "liked_songs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    liked_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="liked_songs")
    song = relationship("Song", back_populates="liked_by")
