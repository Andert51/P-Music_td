from database import SessionLocal
from models import Song

db = SessionLocal()
song = db.query(Song).filter(Song.id == 51).first()

print(f'Antes file_path: {song.file_path}')
print(f'Antes cover_url: {song.cover_url}')

# Reemplazar backslashes con forward slashes
song.file_path = song.file_path.replace('\\', '/')
if song.cover_url:
    song.cover_url = song.cover_url.replace('\\', '/')

print(f'\nDespués file_path: {song.file_path}')
print(f'Después cover_url: {song.cover_url}')

db.commit()
print('\n✅ Rutas corregidas!')
