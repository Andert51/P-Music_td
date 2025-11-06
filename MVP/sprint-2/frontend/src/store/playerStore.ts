/**
 * Player Store - Sprint 2
 * Maneja el estado del reproductor con Howler.js
 */

import { create } from 'zustand'
import { Howl } from 'howler'
import type { Song } from '../types'

interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  queue: Song[]
  currentIndex: number
  howl: Howl | null
  
  // Actions
  playSong: (song: Song) => void
  playQueue: (songs: Song[], startIndex: number) => void
  togglePlay: () => void
  nextSong: () => void
  previousSong: () => void
  setVolume: (volume: number) => void
  seek: (time: number) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],
  currentIndex: 0,
  howl: null,

  playSong: (song: Song) => {
    const { howl } = get()
    
    if (howl) {
      howl.unload()
    }

    // Construir URL completa para el audio
    const audioUrl = song.file_path.startsWith('http') 
      ? song.file_path 
      : `http://localhost:8002${song.file_path}`

    const newHowl = new Howl({
      src: [audioUrl],
      html5: true, // HTML5 Audio con CORS configurado
      volume: get().volume,
      format: ['mp3'],
      onloaderror: (_id, error) => {
        console.error('❌ Error cargando audio:', error)
      },
      onend: () => {
        get().nextSong()
      },
      onplayerror: (_id, error) => {
        console.error('❌ Error reproduciendo:', error)
        // Intentar desbloquear y reproducir nuevamente
        newHowl.once('unlock', () => {
          newHowl.play()
        })
      },
    })

    newHowl.play()
    set({ currentSong: song, howl: newHowl, isPlaying: true, queue: [song], currentIndex: 0 })
  },

  playQueue: (songs: Song[], startIndex: number) => {
    if (songs.length === 0) return
    
    const { howl } = get()
    
    if (howl) {
      howl.unload()
    }

    const song = songs[startIndex]
    
    // Construir URL completa para el audio
    const audioUrl = song.file_path.startsWith('http') 
      ? song.file_path 
      : `http://localhost:8002${song.file_path}`

    const newHowl = new Howl({
      src: [audioUrl],
      html5: true, // HTML5 Audio con CORS configurado
      volume: get().volume,
      format: ['mp3'],
      onloaderror: (_id, error) => {
        console.error('❌ Error cargando audio:', error)
      },
      onend: () => {
        get().nextSong()
      },
      onplayerror: (_id, error) => {
        console.error('❌ Error reproduciendo:', error)
        // Intentar desbloquear y reproducir nuevamente
        newHowl.once('unlock', () => {
          newHowl.play()
        })
      },
    })

    newHowl.play()
    set({ 
      currentSong: song, 
      howl: newHowl, 
      isPlaying: true, 
      queue: songs, 
      currentIndex: startIndex 
    })
  },

  togglePlay: () => {
    const { howl, isPlaying } = get()
    
    if (howl) {
      if (isPlaying) {
        howl.pause()
      } else {
        howl.play()
      }
      set({ isPlaying: !isPlaying })
    }
  },

  nextSong: () => {
    const { queue, currentIndex } = get()
    
    if (currentIndex < queue.length - 1) {
      get().playQueue(queue, currentIndex + 1)
    }
  },

  previousSong: () => {
    const { queue, currentIndex, howl } = get()
    
    if (howl && howl.seek() > 3) {
      howl.seek(0)
    } else if (currentIndex > 0) {
      get().playQueue(queue, currentIndex - 1)
    }
  },

  setVolume: (volume: number) => {
    const { howl } = get()
    
    if (howl) {
      howl.volume(volume)
    }
    set({ volume })
  },

  seek: (time: number) => {
    const { howl } = get()
    
    if (howl) {
      howl.seek(time)
    }
  },
}))
