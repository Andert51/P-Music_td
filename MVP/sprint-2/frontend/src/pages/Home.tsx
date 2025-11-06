import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Disc3, Music, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { usePlayerStore } from '../store/playerStore'
import type { Song } from '../types'

interface Album {
  id: number
  title: string
  description: string | null
  cover_image: string | null
  release_date: string | null
}

export default function Home() {
  const navigate = useNavigate()
  const [songs, setSongs] = useState<Song[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const API_URL = 'http://localhost:8002'

  // Obtener acciones del player store
  const { playSong, currentSong, isPlaying } = usePlayerStore()

  useEffect(() => {
    const token = localStorage.getItem('sprint2_token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    
    fetchUserData()
    fetchData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('sprint2_token')
      const response = await axios.get(`${API_URL}/mvp/sprint2/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error al cargar usuario:', error)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [songsRes, albumsRes] = await Promise.all([
        axios.get(`${API_URL}/mvp/sprint2/songs/?limit=12`),
        axios.get(`${API_URL}/mvp/sprint2/albums/?limit=6`)
      ])
      
      setSongs(songsRes.data)
      setAlbums(albumsRes.data)
    } catch (error) {
      console.error('Error al cargar datos:', error)
      toast.error('Error al cargar contenido')
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = async (song: Song) => {
    try {
      // Incrementar contador de reproducciones
      await axios.post(`${API_URL}/mvp/sprint2/songs/${song.id}/play`)
      
      // Usar el player store para reproducir
      playSong(song)
      toast.success(`Reproduciendo: ${song.title}`)
    } catch (error) {
      console.error('Error al reproducir:', error)
      toast.error('Error al reproducir canción')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sprint2_token')
    localStorage.removeItem('sprint2_user')
    toast.success('Sesión cerrada')
    // Usar window.location para forzar recarga
    setTimeout(() => {
      window.location.href = '/login'
    }, 500)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFileUrl = (path: string | null | undefined) => {
    if (!path) return 'https://via.placeholder.com/300x300?text=No+Cover'
    if (path.startsWith('http')) return path
    return `${API_URL}${path}`
  }

  // Helper para obtener cover de canción (soporta cover_image y cover_url)
  const getSongCover = (song: Song) => {
    const coverPath = song.cover_image || song.cover_url
    return getFileUrl(coverPath)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header con usuario */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">P-Music TD</h1>
              <p className="text-sm text-purple-300">Sprint 2 - Player + Upload</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-medium">{user.username}</p>
                <p className="text-sm text-purple-300 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-white/10"
        >
          <h2 className="text-4xl font-bold text-white mb-3">
            ¡Bienvenido a P-Music! 🎵
          </h2>
          <p className="text-purple-200 text-lg">
            Explora las canciones más populares y álbumes destacados
          </p>
        </motion.div>

        {/* Canciones Populares */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Disc3 className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">Canciones Populares</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {songs.map((song) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="relative aspect-square">
                  <img
                    src={getSongCover(song)}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handlePlay(song)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      currentSong?.id === song.id
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-purple-500 hover:bg-purple-600'
                    } transition-all`}>
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </button>
                </div>

                <div className="p-4">
                  <h4 className="text-white font-semibold truncate">{song.title}</h4>
                  <p className="text-purple-300 text-sm truncate">{song.artist}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-purple-400">{formatDuration(song.duration)}</span>
                  </div>
                  {song.genre && (
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                      {song.genre}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {songs.length === 0 && (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-300 text-lg">No hay canciones disponibles aún</p>
            </div>
          )}
        </section>

        {/* Álbumes Destacados */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Disc3 className="w-6 h-6 text-purple-400" />
            <h3 className="text-2xl font-bold text-white">Álbumes Destacados</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/albums/${album.id}`)}
                className="bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <div className="relative aspect-square">
                  <img
                    src={getFileUrl(album.cover_image)}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h4 className="text-white font-bold text-lg truncate">{album.title}</h4>
                  {album.description && (
                    <p className="text-purple-300 text-sm mt-1 line-clamp-2">{album.description}</p>
                  )}
                  {album.release_date && (
                    <p className="text-purple-400 text-xs mt-2">
                      {new Date(album.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {albums.length === 0 && (
            <div className="text-center py-12">
              <Disc3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-300 text-lg">No hay álbumes disponibles aún</p>
            </div>
          )}
        </section>

        {/* Info Sprint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-purple-500/10 backdrop-blur-xl rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-2">📌 Sprint 1 - Fundamentos</h3>
            <p className="text-purple-300">
              ✅ Autenticación | ✅ Ver canciones | ✅ Ver álbumes | ✅ Player básico
            </p>
            <p className="text-purple-400 text-sm mt-2">
              Próximo sprint: Subida de canciones y gestión de álbumes
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

