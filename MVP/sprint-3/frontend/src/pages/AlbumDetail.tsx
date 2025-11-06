import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Play, Clock, Calendar, ArrowLeft } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { usePlayerStore } from '../store/playerStore'
import api from '../lib/api'
import type { Song } from '../types'

interface Album {
  id: number
  title: string
  description?: string
  cover_image?: string
  release_date?: string
  user_id: number
  created_at: string
}

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [album, setAlbum] = useState<Album | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  const { playQueue, currentSong, isPlaying } = usePlayerStore()

  useEffect(() => {
    if (id) {
      fetchAlbum()
      fetchAlbumSongs()
    }
  }, [id])

  const fetchAlbum = async () => {
    try {
      const response = await api.get(`/albums/${id}`)
      setAlbum(response.data)
    } catch (error) {
      console.error('Error al cargar álbum:', error)
      toast.error('Error al cargar álbum')
    }
  }

  const fetchAlbumSongs = async () => {
    try {
      setLoading(true)
      // Obtener todas las canciones del álbum
      const response = await api.get(`/songs/?album_id=${id}`)
      setSongs(response.data)
    } catch (error) {
      console.error('Error al cargar canciones:', error)
      toast.error('Error al cargar canciones')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAlbum = () => {
    if (songs.length > 0) {
      playQueue(songs, 0)
      toast.success(`Reproduciendo álbum: ${album?.title}`)
    }
  }

  const handlePlaySong = (index: number) => {
    playQueue(songs, index)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFileUrl = (path: string | null | undefined) => {
    if (!path) return 'https://via.placeholder.com/300x300?text=No+Cover'
    if (path.startsWith('http')) return path
    return `http://localhost:8003${path}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Álbum no encontrado</div>
      </div>
    )
  }

  const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-32">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>
      </div>

      {/* Album Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end gap-8 mb-8">
          {/* Album Cover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0"
          >
            <img
              src={getFileUrl(album.cover_image)}
              alt={album.title}
              className="w-64 h-64 rounded-2xl shadow-2xl object-cover"
            />
          </motion.div>

          {/* Album Info */}
          <div className="flex-1">
            <p className="text-purple-300 text-sm font-medium mb-2">ÁLBUM</p>
            <h1 className="text-6xl font-bold text-white mb-4">{album.title}</h1>
            {album.description && (
              <p className="text-gray-300 text-lg mb-4">{album.description}</p>
            )}
            <div className="flex items-center gap-4 text-gray-400">
              {album.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(album.release_date).getFullYear()}</span>
                </div>
              )}
              <span>•</span>
              <span>{songs.length} canciones</span>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayAlbum}
          className="mb-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full flex items-center gap-3 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition-all"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>Reproducir álbum</span>
        </motion.button>

        {/* Songs List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Canciones</h2>
          </div>

          <div className="divide-y divide-white/5">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePlaySong(index)}
                className={`px-6 py-4 flex items-center gap-4 hover:bg-white/10 cursor-pointer transition-colors ${
                  currentSong?.id === song.id ? 'bg-purple-500/20' : ''
                }`}
              >
                {/* Track Number / Play Button */}
                <div className="w-8 text-center">
                  {currentSong?.id === song.id && isPlaying ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                  )}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold truncate ${
                    currentSong?.id === song.id ? 'text-purple-400' : 'text-white'
                  }`}>
                    {song.title}
                  </h4>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>

                {/* Duration */}
                <span className="text-sm text-gray-400">
                  {formatDuration(song.duration)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
