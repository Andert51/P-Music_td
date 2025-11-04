from database import SessionLocal
from models import Song
import os

db = SessionLocal()
song = db.query(Song).filter(Song.id == 51).first()

print(f'\n📀 Canción: {song.title}')
print(f'🎤 Artista: {song.artist}')
print(f'📁 File path: {song.file_path}')
print(f'🖼️  Cover: {song.cover_url}')

# Verificar si el archivo existe
file_path = song.file_path.lstrip('/')
file_exists = os.path.exists(file_path)
print(f'\n✅ Archivo existe: {file_exists}')

if file_exists:
    size_kb = os.path.getsize(file_path) / 1024
    print(f'📊 Tamaño: {size_kb:.2f} KB ({size_kb / 1024:.2f} MB)')
else:
    print(f'❌ El archivo no se encuentra en: {file_path}')
    # Intentar con ruta absoluta
    abs_path = os.path.abspath(file_path)
    print(f'   Ruta absoluta: {abs_path}')

# Listar archivos en uploads/songs
print(f'\n📂 Archivos en uploads/songs:')
songs_dir = 'uploads/songs'
if os.path.exists(songs_dir):
    files = os.listdir(songs_dir)
    print(f'   Total: {len(files)} archivos')
    for f in files[-5:]:
        size = os.path.getsize(os.path.join(songs_dir, f)) / 1024
        print(f'   - {f} ({size:.2f} KB)')
