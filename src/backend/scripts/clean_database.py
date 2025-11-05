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
from models import User, Song, Album, Playlist, PlaylistSong, LikedSong, UserRole
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
    """Limpia todos los datos de la base de datos respetando foreign keys"""
    
    print("\n🧹 Limpiando base de datos...")
    
    # ORDEN IMPORTANTE: Eliminar primero las tablas que dependen de otras
    
    # 1. Eliminar todas las relaciones de playlists (depende de playlists y songs)
    deleted_playlist_songs = db.query(PlaylistSong).delete()
    print(f"   🗑️  {deleted_playlist_songs} relaciones playlist-canción eliminadas")
    
    # 2. Eliminar todos los likes (depende de users y songs)
    deleted_liked_songs = db.query(LikedSong).delete()
    print(f"   🗑️  {deleted_liked_songs} canciones con like eliminadas")
    
    # 3. Eliminar todas las playlists (depende de users)
    deleted_playlists = db.query(Playlist).delete()
    print(f"   🗑️  {deleted_playlists} playlists eliminadas")
    
    # 4. Eliminar todas las canciones (depende de albums y users)
    deleted_songs = db.query(Song).delete()
    print(f"   🗑️  {deleted_songs} canciones eliminadas")
    
    # 5. Eliminar todos los álbumes (depende de users)
    deleted_albums = db.query(Album).delete()
    print(f"   🗑️  {deleted_albums} álbumes eliminados")
    
    # 6. Eliminar todos los usuarios (no depende de nada)
    deleted_users = db.query(User).delete()
    print(f"   🗑️  {deleted_users} usuarios eliminados")
    
    db.commit()
    print("✅ Base de datos limpiada completamente")



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
        print("\n� RESUMEN:")
        print("   🗑️  Base de datos completamente limpiada")
        print("   🗑️  Todos los archivos uploads eliminados")
        print("   📁 Estructura de directorios recreada")
        print("\n�💡 Próximos pasos:")
        print("   1. Ejecuta: python src/backend/scripts/seed_database.py")
        print("   2. Inicia sesión con las credenciales del seeder")
        print("   3. Comienza a subir canciones y álbumes frescos")
        
    except Exception as e:
        print(f"\n❌ Error durante la limpieza: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    main()
