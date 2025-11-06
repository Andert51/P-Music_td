/**
 * Search Page - Sprint 3
 * Búsqueda de canciones con debounce
 */

import { useState, useEffect } from 'react'
import { Search as SearchIcon, Play, Music } from 'lucide-react'
import api from '../lib/api'
import { usePlayerStore } from '../store/playerStore'
import type { Song } from '../types'

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { playQueue, currentSong, isPlaying } = usePlayerStore()

  useEffect(() => {
    if (searchQuery.trim()) {
      const delayDebounceFn = setTimeout(() => {
        performSearch()
      }, 500) // Debounce de 500ms

      return () => clearTimeout(delayDebounceFn)
    } else {
      setSongs([])
      setHasSearched(false)
    }
  }, [searchQuery])

  const performSearch = async () => {
    try {
      setLoading(true)
      setHasSearched(true)
      const response = await api.get('/songs/', {
        params: {
          search: searchQuery,
          approved_only: true,
          order_by: 'play_count',
          limit: 50
        }
      })
      setSongs(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaySong = (_song: Song, index: number) => {
    playQueue(songs, index)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSongCover = (song: Song) => {
    const coverPath = song.cover_image || song.cover_url
    
    if (!coverPath) {
      return `https://via.placeholder.com/300x300?text=${encodeURIComponent(song.title)}`
    }
    
    // Si ya es una URL completa, devolverla tal cual
    if (coverPath.startsWith('http')) {
      return coverPath
    }
    
    // Construir URL completa desde el backend
    return `http://localhost:8003${coverPath}`
  }

  return (
    <div className="space-y-8 pb-32 p-8">
      {/* Header con barra de búsqueda */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-md pb-6 pt-2">
        <h1 className="text-5xl font-bold text-white mb-6">Buscar</h1>

        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué quieres escuchar?"
            className="w-full bg-gray-800 text-white placeholder-gray-400 pl-14 pr-6 py-4 rounded-xl border-2 border-purple-500/20 focus:border-purple-500 focus:outline-none transition-colors text-lg"
            autoFocus
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            <p className="text-gray-400">Buscando...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {hasSearched && !loading && songs.length === 0 && (
        <div className="text-center py-20">
          <SearchIcon className="w-20 h-20 text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-400">
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && songs.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Resultados para "{searchQuery}"
          </h2>

          <div className="space-y-2">
            {songs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => handlePlaySong(song, index)}
                className={`flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800 transition cursor-pointer group ${
                  currentSong?.id === song.id && isPlaying ? 'bg-gray-800' : ''
                }`}
              >
                {/* Cover */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img
                    src={getSongCover(song)}
                    alt={song.title}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${
                    currentSong?.id === song.id && isPlaying ? 'text-purple-400' : 'text-white'
                  }`}>
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{song.artist || 'Unknown Artist'}</p>
                </div>

                {/* Duration */}
                <div className="text-sm text-gray-400">
                  {formatDuration(song.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !loading && (
        <div className="text-center py-20">
          <Music className="w-20 h-20 text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Encuentra tu música favorita
          </h3>
          <p className="text-gray-400">
            Busca canciones, artistas o álbumes
          </p>
        </div>
      )}
    </div>
  )
}
