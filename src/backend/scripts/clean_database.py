"""
Script para limpiar la base de datos de todos los datos de prueba.
Elimina todas las canciones, álbumes, playlists, y usuarios excepto los básicos.
"""

import sys
import os
from pathlib import Path

# Agregar el directorio raíz al path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import User, Song, Album, Playlist, PlaylistSong, UserRole
import shutil


def clean_uploads_directory():
    """Limpia el directorio uploads excepto .gitkeep"""
    uploads_dir = backend_dir / "uploads"
    
    if uploads_dir.exists():
        for item in uploads_dir.iterdir():
            if item.name == ".gitkeep":
                continue
            
            try:
                if item.is_dir():
                    shutil.rmtree(item)
                    print(f"🗑️  Eliminado directorio: {item.name}")
                else:
                    item.unlink()
                    print(f"🗑️  Eliminado archivo: {item.name}")
            except Exception as e:
                print(f"❌ Error eliminando {item.name}: {e}")
    
    # Recrear estructura organizada
    (uploads_dir / "songs").mkdir(exist_ok=True)
    (uploads_dir / "covers" / "songs").mkdir(parents=True, exist_ok=True)
    (uploads_dir / "covers" / "albums").mkdir(parents=True, exist_ok=True)
    (uploads_dir / "avatars").mkdir(exist_ok=True)
    
    print("✅ Estructura de uploads reorganizada:")
    print("   📁 uploads/")
    print("   ├── 📁 songs/")
    print("   ├── 📁 covers/")
    print("   │   ├── 📁 songs/")
    print("   │   └── 📁 albums/")
    print("   └── 📁 avatars/")


def clean_database(db: Session):
    """Limpia todos los datos de la base de datos"""
    
    print("\n🧹 Limpiando base de datos...")
    
    # 1. Eliminar todas las relaciones de playlists
    deleted_playlist_songs = db.query(PlaylistSong).delete()
    print(f"   🗑️  {deleted_playlist_songs} relaciones playlist-canción eliminadas")
    
    # 2. Eliminar todas las playlists
    deleted_playlists = db.query(Playlist).delete()
    print(f"   🗑️  {deleted_playlists} playlists eliminadas")
    
    # 3. Eliminar todas las canciones
    deleted_songs = db.query(Song).delete()
    print(f"   🗑️  {deleted_songs} canciones eliminadas")
    
    # 4. Eliminar todos los álbumes
    deleted_albums = db.query(Album).delete()
    print(f"   🗑️  {deleted_albums} álbumes eliminados")
    
    # 5. Eliminar todos los usuarios
    deleted_users = db.query(User).delete()
    print(f"   🗑️  {deleted_users} usuarios eliminados")
    
    db.commit()
    print("✅ Base de datos limpiada")


def main():
    print("=" * 60)
    print("🧹 LIMPIEZA COMPLETA DE BASE DE DATOS Y ARCHIVOS")
    print("=" * 60)
    
    response = input("\n⚠️  Esto eliminará TODOS los datos. ¿Continuar? (yes/no): ")
    
    if response.lower() != "yes":
        print("❌ Operación cancelada")
        return
    
    db = SessionLocal()
    
    try:
        # Limpiar base de datos
        clean_database(db)
        
        # Limpiar archivos
        print("\n🧹 Limpiando archivos uploads...")
        clean_uploads_directory()
        
        print("\n" + "=" * 60)
        print("✅ LIMPIEZA COMPLETADA")
        print("=" * 60)
        print("\n💡 Ejecuta 'python scripts/seed_database.py' para crear datos iniciales")
        
    except Exception as e:
        print(f"\n❌ Error durante la limpieza: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
