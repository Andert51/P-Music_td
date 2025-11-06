/**
 * Albums Page - Sprint 3
 * Página de álbumes con grid
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Music, Calendar, Play } from 'lucide-react'
import api from '../lib/api'

interface Album {
  id: number
  title: string
  description?: string
  cover_image?: string
  release_date?: string
  creator_id: number
  is_approved: boolean
  created_at: string
}

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      setLoading(true)
      const response = await api.get('/albums/', {
        params: { limit: 50, approved_only: true }
      })
      setAlbums(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const getAlbumCover = (album: Album) => {
    if (album.cover_image) {
      return `http://localhost:8003${album.cover_image}`
    }
    return `https://via.placeholder.com/300x300?text=${encodeURIComponent(album.title)}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-gray-400">Cargando álbumes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-5xl font-bold text-white mb-2">Álbumes</h1>
        <p className="text-gray-400 text-lg">Explora colecciones completas de música</p>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-20">
          <Music className="w-20 h-20 text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No hay álbumes</h3>
          <p className="text-gray-400">Aún no se han agregado álbumes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => navigate(`/albums/${album.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 mb-4 shadow-lg">
                <img
                  src={getAlbumCover(album)}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-purple-500 hover:bg-purple-600 rounded-full p-4 shadow-xl transition">
                    <Play className="w-8 h-8 text-white" fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition">
                  {album.title}
                </h3>
                {album.release_date && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(album.release_date)}</span>
                  </div>
                )}
                <p className="text-sm text-gray-400 truncate">{album.description || 'Album'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
