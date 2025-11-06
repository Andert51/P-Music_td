/**
 * Liked Songs Page - Sprint 3
 * Página de canciones favoritas (UI placeholder)
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Play, Music } from 'lucide-react'
import { usePlayerStore } from '../store/playerStore'
import type { Song } from '../types'

export default function LikedSongs() {
  const [songs] = useState<Song[]>([]) // Placeholder vacío
  const { playQueue, currentSong, isPlaying } = usePlayerStore()

  const handlePlaySong = (_song: Song, index: number) => {
    playQueue(songs, index)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCoverUrl = (path: string | null | undefined) => {
    if (!path) return 'https://via.placeholder.com/300x300?text=No+Cover'
    if (path.startsWith('http')) return path
    return `http://localhost:8003${path}`
  }

  return (
    <div className="space-y-8 pb-32 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-600 via-purple-600 to-red-600 p-12 rounded-3xl relative overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(251, 73, 52, 0.4)' }}
      >
        <div className="relative z-10 flex items-end gap-8">
          <div className="w-48 h-48 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border-4 border-white/20 shadow-2xl">
            <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
          </div>
          
          <div>
            <p className="text-white/80 font-semibold mb-2 uppercase tracking-wider text-sm">Playlist</p>
            <h1 className="text-7xl font-black text-white mb-4 drop-shadow-lg">
              Favoritas
            </h1>
            <p className="text-white/90 text-lg font-medium">
              {songs.length} canciones favoritas
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl" />
      </motion.div>

      {/* Empty State */}
      {songs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6">
            <Heart className="w-16 h-16 text-pink-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No tienes canciones favoritas</h3>
          <p className="text-gray-400 text-center max-w-md">
            Comienza a darle me gusta a las canciones que más te gusten para verlas aquí
          </p>
        </motion.div>
      )}

      {/* Songs List (cuando haya canciones) */}
      {songs.length > 0 && (
        <div className="space-y-2">
          {songs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handlePlaySong(song, index)}
              className={`flex items-center gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition cursor-pointer group ${
                currentSong?.id === song.id && isPlaying ? 'bg-gray-800/70' : ''
              }`}
            >
              {/* Number / Play Icon */}
              <div className="w-8 text-center">
                <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                <Play className="w-5 h-5 text-white hidden group-hover:block mx-auto" fill="currentColor" />
              </div>

              {/* Cover */}
              <div className="relative w-14 h-14 flex-shrink-0">
                <img
                  src={getCoverUrl(song.cover_image || song.cover_url)}
                  alt={song.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold truncate ${
                  currentSong?.id === song.id && isPlaying ? 'text-purple-400' : 'text-white'
                }`}>
                  {song.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>

              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="p-2 rounded-full text-pink-500 hover:bg-gray-700 transition"
                aria-label="Remove from favorites"
              >
                <Heart className="w-5 h-5" fill="currentColor" />
              </button>

              {/* Duration */}
              <div className="text-sm text-gray-400 w-16 text-right">
                {formatDuration(song.duration)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
