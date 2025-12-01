import { create } from 'zustand';
import { Song } from '@/types';
import { Howl } from 'howler';
import api from '@/lib/axios';

interface AudioCache {
  [songId: number]: Howl;
}

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  currentIndex: number;
  howl: Howl | null;
  audioCache: AudioCache; // Cache de audio precargado
  
  playSong: (song: Song) => void;
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  preloadSongs: (songs: Song[]) => void; // Precargar múltiples canciones
  clearCache: () => void; // Limpiar cache
  recordPlay: (songId: number) => void; // Registrar reproducción
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],
  currentIndex: 0,
  howl: null,
  audioCache: {},

  playSong: (song: Song) => {
    const { howl, audioCache } = get();
    
    if (howl) {
      howl.stop();
    }

    // Verificar si la canción ya está en cache
    let newHowl = audioCache[song.id];
    
    if (newHowl && newHowl.state() === 'loaded') {
      console.log('⚡ Reproducción instantánea desde cache:', song.title);
      
      // Resetear callbacks para la nueva reproducción
      newHowl.off('end');
      newHowl.off('play');
      newHowl.on('end', () => get().nextSong());
      newHowl.on('play', () => {
        console.log('▶️ Reproducción confirmada (cache):', song.title);
        set({ isPlaying: true });
      });
      
      newHowl.seek(0);
      newHowl.volume(get().volume);
      
      // Registrar reproducción antes de reproducir
      get().recordPlay(song.id);
      
      // Reproducir
      const playPromise = newHowl.play();
      
      // Verificar si play() devuelve un ID válido
      if (playPromise !== undefined && playPromise !== null) {
        console.log('🎵 Reproduciendo (ID):', playPromise);
      }
      
      set({ 
        currentSong: song, 
        howl: newHowl, 
        isPlaying: true, 
        queue: [song], 
        currentIndex: 0 
      });
    } else {
      // Crear nuevo Howl si no está en cache
      const audioUrl = song.file_path.startsWith('http') 
        ? song.file_path 
        : `http://127.0.0.1:8000${song.file_path}`;

      newHowl = new Howl({
        src: [audioUrl],
        html5: false, // Web Audio API para visualizador
        preload: true,
        xhr: {
          method: 'GET',
          headers: {},
          withCredentials: false,
        },
        volume: get().volume,
        format: ['mp3'],
        onload: () => {
          console.log('✅ Audio cargado:', song.title);
          const playId = newHowl.play();
          console.log('🎵 Play ID:', playId);
          set({ isPlaying: true });
          // Registrar reproducción
          get().recordPlay(song.id);
        },
        onplay: () => {
          console.log('▶️ Reproducción iniciada:', song.title);
          set({ isPlaying: true });
        },
        onloaderror: (_id, error) => {
          console.error('❌ Error cargando audio:', error);
          console.error('   Archivo:', audioUrl);
          console.error('   Canción:', song.title);
          
          // Limpiar del cache si falla
          const cache = get().audioCache;
          if (cache[song.id]) {
            delete cache[song.id];
            set({ audioCache: { ...cache } });
          }
          
          // Resetear estado
          set({ isPlaying: false, currentSong: null });
          
          // Mostrar toast de error (si está disponible)
          console.warn('⚠️ No se pudo reproducir:', song.title);
        },
        onend: () => {
          get().nextSong();
        },
        onplayerror: (_id, error) => {
          console.error('❌ Error reproduciendo:', error);
          newHowl.once('unlock', () => {
            newHowl.play();
          });
        },
      });

      // Guardar en cache
      set({ 
        currentSong: song, 
        howl: newHowl, 
        isPlaying: false, 
        queue: [song], 
        currentIndex: 0,
        audioCache: { ...audioCache, [song.id]: newHowl }
      });
    }
  },

  playQueue: (songs: Song[], startIndex: number) => {
    const { howl, audioCache } = get();
    
    if (howl) {
      howl.stop();
    }

    const song = songs[startIndex];
    
    // Verificar si la canción ya está en cache
    let newHowl = audioCache[song.id];
    
    if (newHowl && newHowl.state() === 'loaded') {
      console.log('⚡ Reproducción instantánea desde cache:', song.title);
      
      // Resetear callbacks
      newHowl.off('end');
      newHowl.off('play');
      newHowl.on('end', () => get().nextSong());
      newHowl.on('play', () => {
        console.log('▶️ Reproducción confirmada (cache queue):', song.title);
        set({ isPlaying: true });
      });
      
      newHowl.seek(0);
      newHowl.volume(get().volume);
      
      // Registrar reproducción antes de reproducir
      get().recordPlay(song.id);
      
      // Reproducir
      const playPromise = newHowl.play();
      
      // Verificar si play() devuelve un ID válido
      if (playPromise !== undefined && playPromise !== null) {
        console.log('🎵 Reproduciendo queue (ID):', playPromise);
      }
      
      set({ 
        currentSong: song, 
        howl: newHowl, 
        isPlaying: true, 
        queue: songs, 
        currentIndex: startIndex 
      });
      
      // Precargar canciones adyacentes
      get().preloadSongs(songs);
    } else {
      // Crear nuevo Howl
      const audioUrl = song.file_path.startsWith('http') 
        ? song.file_path 
        : `http://127.0.0.1:8000${song.file_path}`;

      newHowl = new Howl({
        src: [audioUrl],
        html5: false, // Web Audio API para visualizador
        preload: true,
        xhr: {
          method: 'GET',
          headers: {},
          withCredentials: false,
        },
        volume: get().volume,
        format: ['mp3'],
        onload: () => {
          console.log('✅ Audio cargado (queue):', song.title);
          const playId = newHowl.play();
          console.log('🎵 Play ID (queue):', playId);
          set({ isPlaying: true });
          // Registrar reproducción
          get().recordPlay(song.id);
          // Precargar canciones adyacentes después de cargar la actual
          get().preloadSongs(songs);
        },
        onplay: () => {
          console.log('▶️ Reproducción iniciada (queue):', song.title);
          set({ isPlaying: true });
        },
        onloaderror: (_id, error) => {
          console.error('❌ Error cargando audio (queue):', error);
          console.error('   Archivo:', audioUrl);
          console.error('   Canción:', song.title);
          
          // Limpiar del cache si falla
          const cache = get().audioCache;
          if (cache[song.id]) {
            delete cache[song.id];
            set({ audioCache: { ...cache } });
          }
          
          // Intentar siguiente canción si hay cola
          const { queue, currentIndex } = get();
          if (currentIndex < queue.length - 1) {
            console.log('⏭️ Saltando a siguiente canción...');
            setTimeout(() => get().nextSong(), 500);
          } else {
            set({ isPlaying: false });
          }
        },
        onend: () => {
          get().nextSong();
        },
        onplayerror: (_id, error) => {
          console.error('❌ Error reproduciendo:', error);
          newHowl.once('unlock', () => {
            newHowl.play();
          });
        },
      });

      set({ 
        currentSong: song, 
        howl: newHowl, 
        isPlaying: false, 
        queue: songs, 
        currentIndex: startIndex,
        audioCache: { ...audioCache, [song.id]: newHowl }
      });
    }
  },

  togglePlay: () => {
    const { howl, isPlaying } = get();
    
    if (howl) {
      if (isPlaying) {
        howl.pause();
      } else {
        howl.play();
      }
      set({ isPlaying: !isPlaying });
    }
  },

  nextSong: () => {
    const { queue, currentIndex, audioCache } = get();
    
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      get().playQueue(queue, nextIndex);
    }
  },

  previousSong: () => {
    const { queue, currentIndex, howl } = get();
    
    if (howl && howl.seek() > 3) {
      howl.seek(0);
    } else if (currentIndex > 0) {
      get().playQueue(queue, currentIndex - 1);
    }
  },

  setVolume: (volume: number) => {
    const { howl } = get();
    
    if (howl) {
      howl.volume(volume);
    }
    set({ volume });
  },

  seek: (time: number) => {
    const { howl } = get();
    
    if (howl) {
      howl.seek(time);
    }
  },

  preloadSongs: (songs: Song[]) => {
    const { currentIndex, audioCache } = get();
    const maxPreload = 5; // Número máximo de canciones a precargar
    
    // Determinar qué canciones precargar
    const songsToPreload: Song[] = [];
    
    // 1. Siguiente canción (máxima prioridad)
    if (currentIndex + 1 < songs.length) {
      songsToPreload.push(songs[currentIndex + 1]);
    }
    
    // 2. Canción anterior
    if (currentIndex > 0) {
      songsToPreload.push(songs[currentIndex - 1]);
    }
    
    // 3. Siguientes 3 canciones
    for (let i = 2; i <= 3 && currentIndex + i < songs.length; i++) {
      songsToPreload.push(songs[currentIndex + i]);
    }
    
    // 4. Canciones aleatorias adicionales hasta maxPreload
    const remainingSlots = maxPreload - songsToPreload.length;
    if (remainingSlots > 0) {
      const availableSongs = songs.filter(song => 
        !songsToPreload.includes(song) && 
        !audioCache[song.id] &&
        song.id !== get().currentSong?.id
      );
      
      // Seleccionar canciones aleatorias
      for (let i = 0; i < Math.min(remainingSlots, availableSongs.length); i++) {
        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        songsToPreload.push(availableSongs[randomIndex]);
        availableSongs.splice(randomIndex, 1);
      }
    }
    
    // Precargar canciones que no están en cache
    songsToPreload.forEach(song => {
      if (!audioCache[song.id]) {
        const audioUrl = song.file_path.startsWith('http') 
          ? song.file_path 
          : `http://127.0.0.1:8000${song.file_path}`;
        
        console.log('🔄 Precargando:', song.title);
        
        const preloadHowl = new Howl({
          src: [audioUrl],
          html5: false, // Web Audio API para visualizador
          preload: true,
          xhr: {
            method: 'GET',
            headers: {},
            withCredentials: false,
          },
          volume: get().volume,
          format: ['mp3'],
          onload: () => {
            console.log('✅ Precargada:', song.title);
          },
          onloaderror: (_id, error) => {
            console.error('❌ Error precargando:', song.title, error);
          },
        });
        
        // Agregar al cache
        set({ 
          audioCache: { ...get().audioCache, [song.id]: preloadHowl }
        });
      }
    });
    
    // Limpiar cache si es muy grande (mantener solo las últimas 10 canciones)
    const cacheSize = Object.keys(get().audioCache).length;
    if (cacheSize > 10) {
      console.log('🧹 Limpiando cache antiguo...');
      const newCache: AudioCache = {};
      const currentSongId = get().currentSong?.id;
      
      // Mantener la canción actual y las precargadas
      const keepIds = [
        currentSongId,
        ...songsToPreload.map(s => s.id)
      ].filter(id => id !== undefined) as number[];
      
      Object.entries(get().audioCache).forEach(([id, howl]) => {
        if (keepIds.includes(Number(id))) {
          newCache[Number(id)] = howl;
        } else {
          howl.unload();
        }
      });
      
      set({ audioCache: newCache });
    }
  },

  clearCache: () => {
    const { audioCache, currentSong } = get();
    
    Object.entries(audioCache).forEach(([id, howl]) => {
      if (Number(id) !== currentSong?.id) {
        howl.unload();
      }
    });
    
    set({ 
      audioCache: currentSong ? { [currentSong.id]: audioCache[currentSong.id] } : {} 
    });
  },

  recordPlay: (songId: number) => {
    // Llamada asíncrona sin bloquear la reproducción
    api.post(`/songs/${songId}/play`)
      .then(() => {
        console.log('✅ Reproducción registrada:', songId);
      })
      .catch((error) => {
        // No detener la reproducción si falla el registro
        console.warn('⚠️ No se pudo registrar reproducción:', error.response?.status || error.message);
      });
  },
}));
