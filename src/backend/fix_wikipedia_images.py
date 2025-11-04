from database import SessionLocal
from models import Album, Song

db = SessionLocal()

# Buscar álbumes con imágenes de Wikipedia
albums = db.query(Album).all()
broken = [a for a in albums if a.cover_image and 'wikipedia.org' in a.cover_image]

print(f'\n📊 Álbumes con imágenes de Wikipedia: {len(broken)}\n')

# URLs correctas de Spotify CDN o fuentes confiables
fixes = {
    "Random Access Memories": "https://i.scdn.co/image/ab67616d0000b273b33d46dfa2635a47eebf63b2",
    "The Bends": "https://i.scdn.co/image/ab67616d0000b273c6e954e792d2b1a26da93d31",
    "Night Visions": "https://i.scdn.co/image/ab67616d0000b273407bd04707c463bbb3410737",
    "Evolve": "https://i.scdn.co/image/ab67616d0000b273a1c5acb2e25e75f02b0a7ce3",
    "Creep": "https://i.scdn.co/image/ab67616d0000b273df55e326ed144ab4f5d1cddb",  # Single
}

for album in broken:
    print(f'❌ {album.title}: {album.cover_image}')
    if album.title in fixes:
        album.cover_image = fixes[album.title]
        print(f'   ✅ Actualizado a: {fixes[album.title]}')

# También actualizar las canciones asociadas
for album in broken:
    if album.title in fixes:
        songs = db.query(Song).filter(Song.album_id == album.id).all()
        for song in songs:
            if song.cover_url and 'wikipedia.org' in song.cover_url:
                song.cover_url = fixes[album.title]
                print(f'   📝 Actualizada canción: {song.title}')

db.commit()
print(f'\n✅ {len(broken)} álbumes actualizados!')
