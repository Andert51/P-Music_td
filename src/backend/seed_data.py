"""
Seeder para poblar la base de datos con datos de ejemplo
Ejecutar: python seed_data.py
"""
import sys
from pathlib import Path

# Add backend directory to path
backend_path = Path(__file__).parent
sys.path.append(str(backend_path))

from database import SessionLocal
from models import User, Album, Song, Playlist, PlaylistSong
from auth import get_password_hash
from datetime import datetime, timedelta


def create_sample_data():
    db = SessionLocal()
    
    try:
        # Verificar si ya existen canciones
        existing_songs = db.query(Song).count()
        if existing_songs > 0:
            print("⚠️  La base de datos ya contiene canciones. Saltando seeder...")
            return
        
        print("🌱 Poblando base de datos con datos de ejemplo...")
        
        # =====================================================================
        # USUARIOS
        # =====================================================================
        print("\n👥 Verificando usuarios...")
        
        # Buscar usuarios existentes o crearlos
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                email="admin@music.com",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                is_active=True
            )
            db.add(admin)
        
        creator1 = db.query(User).filter(User.username == "DaftPunk").first()
        if not creator1:
            creator1 = User(
                email="daftpunk@music.com",
                username="DaftPunk",
                hashed_password=get_password_hash("creator123"),
                role="creator",
                is_active=True
            )
            db.add(creator1)
        
        creator2 = db.query(User).filter(User.username == "TheWeeknd").first()
        if not creator2:
            creator2 = User(
                email="theweeknd@music.com",
                username="TheWeeknd",
                hashed_password=get_password_hash("creator123"),
                role="creator",
                is_active=True
            )
            db.add(creator2)
        
        creator3 = db.query(User).filter(User.username == "ImagineDragons").first()
        if not creator3:
            creator3 = User(
                email="imaginedragons@music.com",
                username="ImagineDragons",
                hashed_password=get_password_hash("creator123"),
                role="creator",
                is_active=True
            )
            db.add(creator3)
        
        premium1 = db.query(User).filter(User.username == "MusicLover").first()
        if not premium1:
            premium1 = User(
                email="premium1@music.com",
                username="MusicLover",
                hashed_password=get_password_hash("premium123"),
                role="premium",
                is_active=True
            )
            db.add(premium1)
        
        user1 = db.query(User).filter(User.username == "RegularUser").first()
        if not user1:
            user1 = User(
                email="user1@music.com",
                username="RegularUser",
                hashed_password=get_password_hash("user123"),
                role="user",
                is_active=True
            )
            db.add(user1)
        
        db.commit()
        print("✅ Usuarios verificados")
        
        # =====================================================================
        # ÁLBUMES
        # =====================================================================
        print("\n💿 Creando álbumes...")
        
        # Radiohead
        album_ok_computer = Album(
            title="OK Computer",
            description="The third studio album by English rock band Radiohead",
            release_date=datetime(1997, 5, 21),
            cover_image="https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
            creator_id=creator1.id,
            is_approved=True
        )
        db.add(album_ok_computer)
        
        album_in_rainbows = Album(
            title="In Rainbows",
            description="The seventh studio album by English rock band Radiohead",
            release_date=datetime(2007, 10, 10),
            cover_image="https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
            creator_id=creator1.id,
            is_approved=True
        )
        db.add(album_in_rainbows)
        
        album_the_bends = Album(
            title="The Bends",
            description="The second studio album by English rock band Radiohead",
            release_date=datetime(1995, 3, 13),
            cover_image="https://upload.wikimedia.org/wikipedia/en/8/8b/Radiohead.the.bends.albumart.jpg",
            creator_id=creator1.id,
            is_approved=True
        )
        db.add(album_the_bends)
        
        # Daft Punk
        album_ram = Album(
            title="Random Access Memories",
            description="The fourth studio album by French electronic music duo Daft Punk",
            release_date=datetime(2013, 5, 17),
            cover_image="https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
            creator_id=creator1.id,
            is_approved=True
        )
        db.add(album_ram)
        
        album_discovery = Album(
            title="Discovery",
            description="The second studio album by French electronic music duo Daft Punk",
            release_date=datetime(2001, 3, 12),
            cover_image="https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png",
            creator_id=creator1.id,
            is_approved=True
        )
        db.add(album_discovery)
        
        # The Weeknd
        album_after_hours = Album(
            title="After Hours",
            description="The fourth studio album by Canadian singer The Weeknd",
            release_date=datetime(2020, 3, 20),
            cover_image="https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
            creator_id=creator2.id,
            is_approved=True
        )
        db.add(album_after_hours)
        
        album_starboy = Album(
            title="Starboy",
            description="The third studio album by Canadian singer The Weeknd",
            release_date=datetime(2016, 11, 25),
            cover_image="https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
            creator_id=creator2.id,
            is_approved=True
        )
        db.add(album_starboy)
        
        # Imagine Dragons
        album_night_visions = Album(
            title="Night Visions",
            description="The debut studio album by American pop rock band Imagine Dragons",
            release_date=datetime(2012, 9, 4),
            cover_image="https://upload.wikimedia.org/wikipedia/en/d/da/Imagine_Dragons_Night_Visions.png",
            creator_id=creator3.id,
            is_approved=True
        )
        db.add(album_night_visions)
        
        album_evolve = Album(
            title="Evolve",
            description="The third studio album by American pop rock band Imagine Dragons",
            release_date=datetime(2017, 6, 23),
            cover_image="https://upload.wikimedia.org/wikipedia/en/d/d9/Imagine_Dragons_Evolve.png",
            creator_id=creator3.id,
            is_approved=True
        )
        db.add(album_evolve)
        
        db.commit()
        print("✅ Álbumes creados")
        
        # =====================================================================
        # CANCIONES
        # =====================================================================
        print("\n🎵 Creando canciones...")
        
        # Nota: Usando URLs de ejemplo. En producción, estos serían archivos MP3 reales
        sample_songs = [
            # ===== RADIOHEAD - OK COMPUTER (1997) =====
            {
                "title": "Airbag",
                "artist": "Radiohead",
                "duration": 284,  # 4:44
                "album_id": album_ok_computer.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
                "is_approved": True,
                "play_count": 1523
            },
            {
                "title": "Paranoid Android",
                "artist": "Radiohead",
                "duration": 383,  # 6:23
                "album_id": album_ok_computer.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
                "is_approved": True,
                "play_count": 3421
            },
            {
                "title": "Karma Police",
                "artist": "Radiohead",
                "duration": 261,  # 4:21
                "album_id": album_ok_computer.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
                "is_approved": True,
                "play_count": 2890
            },
            {
                "title": "No Surprises",
                "artist": "Radiohead",
                "duration": 228,  # 3:48
                "album_id": album_ok_computer.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
                "is_approved": True,
                "play_count": 2145
            },
            {
                "title": "Let Down",
                "artist": "Radiohead",
                "duration": 299,  # 4:59
                "album_id": album_ok_computer.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
                "is_approved": True,
                "play_count": 1876
            },
            {
                "title": "Exit Music (For a Film)",
                "artist": "Radiohead",
                "duration": 263,  # 4:23
                "album_id": album_ok_computer.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
                "is_approved": True,
                "play_count": 1654
            },
            
            # ===== RADIOHEAD - IN RAINBOWS (2007) =====
            {
                "title": "15 Step",
                "artist": "Radiohead",
                "duration": 237,  # 3:57
                "album_id": album_in_rainbows.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
                "is_approved": True,
                "play_count": 1432
            },
            {
                "title": "Bodysnatchers",
                "artist": "Radiohead",
                "duration": 242,  # 4:02
                "album_id": album_in_rainbows.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
                "is_approved": True,
                "play_count": 1234
            },
            {
                "title": "Nude",
                "artist": "Radiohead",
                "duration": 254,  # 4:14
                "album_id": album_in_rainbows.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
                "is_approved": True,
                "play_count": 2341
            },
            {
                "title": "Weird Fishes/Arpeggi",
                "artist": "Radiohead",
                "duration": 318,  # 5:18
                "album_id": album_in_rainbows.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
                "is_approved": True,
                "play_count": 2789
            },
            {
                "title": "Reckoner",
                "artist": "Radiohead",
                "duration": 290,  # 4:50
                "album_id": album_in_rainbows.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
                "is_approved": True,
                "play_count": 1987
            },
            {
                "title": "House of Cards",
                "artist": "Radiohead",
                "duration": 323,  # 5:23
                "album_id": album_in_rainbows.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
                "is_approved": True,
                "play_count": 1456
            },
            
            # ===== RADIOHEAD - THE BENDS (1995) =====
            {
                "title": "Planet Telex",
                "artist": "Radiohead",
                "duration": 264,  # 4:24
                "album_id": album_the_bends.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Bends.png",
                "is_approved": True,
                "play_count": 987
            },
            {
                "title": "The Bends",
                "artist": "Radiohead",
                "duration": 244,  # 4:04
                "album_id": album_the_bends.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Bends.png",
                "is_approved": True,
                "play_count": 1234
            },
            {
                "title": "High and Dry",
                "artist": "Radiohead",
                "duration": 256,  # 4:16
                "album_id": album_the_bends.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Bends.png",
                "is_approved": True,
                "play_count": 2145
            },
            {
                "title": "Fake Plastic Trees",
                "artist": "Radiohead",
                "duration": 290,  # 4:50
                "album_id": album_the_bends.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Bends.png",
                "is_approved": True,
                "play_count": 3876
            },
            {
                "title": "Just",
                "artist": "Radiohead",
                "duration": 234,  # 3:54
                "album_id": album_the_bends.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Bends.png",
                "is_approved": True,
                "play_count": 1654
            },
            {
                "title": "Street Spirit (Fade Out)",
                "artist": "Radiohead",
                "duration": 253,  # 4:13
                "album_id": album_the_bends.id,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/8/8e/The_Bends.png",
                "is_approved": True,
                "play_count": 2543
            },
            
            # ===== DAFT PUNK - RANDOM ACCESS MEMORIES =====
            {
                "title": "Get Lucky",
                "artist": "Daft Punk feat. Pharrell Williams",
                "duration": 368,  # 6:08
                "album_id": album_ram.id,
                "creator_id": creator1.id,
                "genre": "Electronic",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
                "is_approved": True,
                "play_count": 5432
            },
            {
                "title": "Instant Crush",
                "artist": "Daft Punk feat. Julian Casablancas",
                "duration": 337,  # 5:37
                "album_id": album_ram.id,
                "creator_id": creator1.id,
                "genre": "Electronic",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
                "is_approved": True,
                "play_count": 3210
            },
            {
                "title": "Lose Yourself to Dance",
                "artist": "Daft Punk feat. Pharrell Williams",
                "duration": 353,  # 5:53
                "album_id": album_ram.id,
                "creator_id": creator1.id,
                "genre": "Electronic",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg",
                "is_approved": True,
                "play_count": 2987
            },
            
            # ===== DAFT PUNK - DISCOVERY =====
            {
                "title": "One More Time",
                "artist": "Daft Punk",
                "duration": 320,  # 5:20
                "album_id": album_discovery.id,
                "creator_id": creator1.id,
                "genre": "Electronic",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png",
                "is_approved": True,
                "play_count": 6543
            },
            {
                "title": "Digital Love",
                "artist": "Daft Punk",
                "duration": 301,  # 5:01
                "album_id": album_discovery.id,
                "creator_id": creator1.id,
                "genre": "Electronic",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png",
                "is_approved": True,
                "play_count": 4321
            },
            {
                "title": "Harder, Better, Faster, Stronger",
                "artist": "Daft Punk",
                "duration": 224,  # 3:44
                "album_id": album_discovery.id,
                "creator_id": creator1.id,
                "genre": "Electronic",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.png",
                "is_approved": True,
                "play_count": 7654
            },
            
            # ===== THE WEEKND - AFTER HOURS =====
            {
                "title": "Blinding Lights",
                "artist": "The Weeknd",
                "duration": 200,  # 3:20
                "album_id": album_after_hours.id,
                "creator_id": creator2.id,
                "genre": "Synth-pop",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
                "is_approved": True,
                "play_count": 9876
            },
            {
                "title": "Save Your Tears",
                "artist": "The Weeknd",
                "duration": 215,  # 3:35
                "album_id": album_after_hours.id,
                "creator_id": creator2.id,
                "genre": "Synth-pop",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
                "is_approved": True,
                "play_count": 7654
            },
            {
                "title": "In Your Eyes",
                "artist": "The Weeknd",
                "duration": 237,  # 3:57
                "album_id": album_after_hours.id,
                "creator_id": creator2.id,
                "genre": "Synth-pop",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
                "is_approved": True,
                "play_count": 5432
            },
            
            # ===== THE WEEKND - STARBOY =====
            {
                "title": "Starboy",
                "artist": "The Weeknd feat. Daft Punk",
                "duration": 230,  # 3:50
                "album_id": album_starboy.id,
                "creator_id": creator2.id,
                "genre": "R&B",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
                "is_approved": True,
                "play_count": 8765
            },
            {
                "title": "I Feel It Coming",
                "artist": "The Weeknd feat. Daft Punk",
                "duration": 269,  # 4:29
                "album_id": album_starboy.id,
                "creator_id": creator2.id,
                "genre": "R&B",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
                "is_approved": True,
                "play_count": 6543
            },
            
            # ===== IMAGINE DRAGONS - NIGHT VISIONS =====
            {
                "title": "Radioactive",
                "artist": "Imagine Dragons",
                "duration": 187,  # 3:07
                "album_id": album_night_visions.id,
                "creator_id": creator3.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/d/da/Imagine_Dragons_Night_Visions.png",
                "is_approved": True,
                "play_count": 8901
            },
            {
                "title": "Demons",
                "artist": "Imagine Dragons",
                "duration": 177,  # 2:57
                "album_id": album_night_visions.id,
                "creator_id": creator3.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/d/da/Imagine_Dragons_Night_Visions.png",
                "is_approved": True,
                "play_count": 7654
            },
            {
                "title": "It's Time",
                "artist": "Imagine Dragons",
                "duration": 240,  # 4:00
                "album_id": album_night_visions.id,
                "creator_id": creator3.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/d/da/Imagine_Dragons_Night_Visions.png",
                "is_approved": True,
                "play_count": 6543
            },
            
            # ===== IMAGINE DRAGONS - EVOLVE =====
            {
                "title": "Believer",
                "artist": "Imagine Dragons",
                "duration": 204,  # 3:24
                "album_id": album_evolve.id,
                "creator_id": creator3.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/d/d9/Imagine_Dragons_Evolve.png",
                "is_approved": True,
                "play_count": 9234
            },
            {
                "title": "Thunder",
                "artist": "Imagine Dragons",
                "duration": 187,  # 3:07
                "album_id": album_evolve.id,
                "creator_id": creator3.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/d/d9/Imagine_Dragons_Evolve.png",
                "is_approved": True,
                "play_count": 8765
            },
            {
                "title": "Whatever It Takes",
                "artist": "Imagine Dragons",
                "duration": 201,  # 3:21
                "album_id": album_evolve.id,
                "creator_id": creator3.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/d/d9/Imagine_Dragons_Evolve.png",
                "is_approved": True,
                "play_count": 7321
            },
            
            # ===== SENCILLOS (Sin álbum) =====
            {
                "title": "Creep",
                "artist": "Radiohead",
                "duration": 238,  # 3:58
                "album_id": None,
                "creator_id": creator1.id,
                "genre": "Alternative Rock",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/c/c7/Radiohead.creep.single.cover.jpg",
                "is_approved": True,
                "play_count": 12345
            },
            {
                "title": "Shape of You",
                "artist": "Ed Sheeran",
                "duration": 233,  # 3:53
                "album_id": None,
                "creator_id": creator2.id,
                "genre": "Pop",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png",
                "is_approved": True,
                "play_count": 11234
            },
            {
                "title": "Levitating",
                "artist": "Dua Lipa",
                "duration": 203,  # 3:23
                "album_id": None,
                "creator_id": creator2.id,
                "genre": "Disco-pop",
                "file_path": "/uploads/songs/sample.mp3",
                "cover_url": "https://i.scdn.co/image/ab67616d0000b273be841ba4bc24340152e3a79a",
                "is_approved": True,
                "play_count": 10123
            },
        ]
        
        songs = []
        for song_data in sample_songs:
            song = Song(**song_data)
            db.add(song)
            songs.append(song)
        
        db.commit()
        print(f"✅ {len(songs)} canciones creadas")
        
        # =====================================================================
        # PLAYLISTS
        # =====================================================================
        print("\n📝 Creando playlists...")
        
        playlist1 = Playlist(
            name="Summer Vibes",
            description="Perfect songs for summer",
            cover_image="https://i.scdn.co/image/ab67706c0000bebb22a634b1f2704df22e4e002f",
            is_public=True,
            owner_id=premium1.id
        )
        db.add(playlist1)
        
        playlist2 = Playlist(
            name="Workout Mix",
            description="High energy tracks for your workout",
            cover_image="https://i.scdn.co/image/ab67706c0000bebb1fc2f7421eb10c8a8cae734e",
            is_public=True,
            owner_id=user1.id
        )
        db.add(playlist2)
        
        playlist3 = Playlist(
            name="Chill Vibes",
            description="Relaxing music to unwind",
            cover_image="https://i.scdn.co/image/ab67706c0000bebbe7866f0bb49ca8e85c67eeee",
            is_public=True,
            owner_id=premium1.id
        )
        db.add(playlist3)
        
        db.commit()
        print("✅ Playlists creadas")
        
        # =====================================================================
        # AGREGAR CANCIONES A PLAYLISTS
        # =====================================================================
        print("\n🔗 Agregando canciones a playlists...")
        
        # Summer Vibes
        db.add(PlaylistSong(playlist_id=playlist1.id, song_id=songs[0].id, position=1))
        db.add(PlaylistSong(playlist_id=playlist1.id, song_id=songs[3].id, position=2))
        db.add(PlaylistSong(playlist_id=playlist1.id, song_id=songs[9].id, position=3))
        db.add(PlaylistSong(playlist_id=playlist1.id, song_id=songs[10].id, position=4))
        
        # Workout Mix
        db.add(PlaylistSong(playlist_id=playlist2.id, song_id=songs[6].id, position=1))
        db.add(PlaylistSong(playlist_id=playlist2.id, song_id=songs[7].id, position=2))
        db.add(PlaylistSong(playlist_id=playlist2.id, song_id=songs[11].id, position=3))
        
        # Chill Vibes
        db.add(PlaylistSong(playlist_id=playlist3.id, song_id=songs[1].id, position=1))
        db.add(PlaylistSong(playlist_id=playlist3.id, song_id=songs[2].id, position=2))
        db.add(PlaylistSong(playlist_id=playlist3.id, song_id=songs[5].id, position=3))
        db.add(PlaylistSong(playlist_id=playlist3.id, song_id=songs[8].id, position=4))
        
        db.commit()
        print("✅ Canciones agregadas a playlists")
        
        # =====================================================================
        # RESUMEN
        # =====================================================================
        print("\n" + "="*70)
        print("✅ ¡Datos de ejemplo creados exitosamente!")
        print("="*70)
        print("\n📊 RESUMEN:")
        print(f"   👥 Usuarios: {db.query(User).count()}")
        print(f"   💿 Álbumes: {db.query(Album).count()}")
        print(f"   🎵 Canciones: {db.query(Song).count()}")
        print(f"   📝 Playlists: {db.query(Playlist).count()}")
        
        print("\n🔐 CREDENCIALES DE PRUEBA:")
        print("   Admin:")
        print("      Email: admin@music.com")
        print("      Password: admin123")
        print("\n   Creator:")
        print("      Email: daftpunk@music.com")
        print("      Password: creator123")
        print("\n   Premium User:")
        print("      Email: premium1@music.com")
        print("      Password: premium123")
        print("\n   Regular User:")
        print("      Email: user1@music.com")
        print("      Password: user123")
        print("\n" + "="*70)
        
    except Exception as e:
        print(f"\n❌ Error al crear datos: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("🌱 Music Streaming App - Database Seeder")
    print("="*70)
    create_sample_data()
