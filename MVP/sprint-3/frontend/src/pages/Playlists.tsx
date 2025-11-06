/**
 * Playlists Page - Sprint 3
 * Página de playlists del usuario (UI placeholder)
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ListMusic, Plus, Play, Music2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Playlist {
  id: number
  name: string
  description: string
  song_count: number
  cover_image?: string
}

export default function Playlists() {
  const navigate = useNavigate()
  const [playlists] = useState<Playlist[]>([]) // Placeholder vacío

  return (
    <div className="space-y-8 pb-32 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-bold text-white"
        >
          Tus Playlists
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
        >
          <Plus className="w-5 h-5" />
          Crear Playlist
        </motion.button>
      </div>

      {/* Empty State */}
      {playlists.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
            <ListMusic className="w-16 h-16 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No tienes playlists aún</h3>
          <p className="text-gray-400 text-center max-w-md mb-6">
            Crea tu primera playlist para organizar tu música favorita
          </p>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Playlist
          </button>
        </motion.div>
      )}

      {/* Playlists Grid */}
      {playlists.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/playlists/${playlist.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg group-hover:shadow-2xl transition-all">
                {playlist.cover_image ? (
                  <img
                    src={playlist.cover_image}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="w-20 h-20 text-white/50" />
                  </div>
                )}

                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold truncate group-hover:text-purple-400 transition">
                  {playlist.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {playlist.song_count} canciones
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
