/**
 * Now Playing Panel - Sprint 3
 * Panel lateral derecho que muestra la canción actual
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Music, Heart, Radio, Disc3, ListMusic, ChevronRight } from 'lucide-react'
import { usePlayerStore } from '../store/playerStore'

interface NowPlayingPanelProps {
  isOpen: boolean
  onToggle: () => void
}

export default function NowPlayingPanel({ isOpen, onToggle }: NowPlayingPanelProps) {
  const { currentSong, queue, currentIndex, howl, isPlaying, playQueue } = usePlayerStore()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!howl) return
    const interval = setInterval(() => {
      setCurrentTime(howl.seek() as number)
      setDuration(howl.duration())
    }, 100)
    return () => clearInterval(interval)
  }, [howl])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const getCoverUrl = (path: string | null | undefined) => {
    if (!path) return 'https://via.placeholder.com/300x300?text=No+Cover'
    if (path.startsWith('http')) return path
    return `http://localhost:8003${path}`
  }

  // Botón toggle para móvil/tablet
  const toggleButton = (
    <button
      onClick={onToggle}
      className="fixed top-20 right-0 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-l-xl shadow-lg transition-all lg:hidden"
      aria-label="Toggle Now Playing"
    >
      <ChevronRight className={`w-5 h-5 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
    </button>
  )

  if (!currentSong) {
    return (
      <>
        {toggleButton}
        <motion.div 
          initial={{ x: 300 }}
          animate={{ x: isOpen ? 0 : 300 }}
          className="fixed top-16 right-0 bottom-20 w-80 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 border-l border-purple-500/20 flex flex-col items-center justify-center p-8 z-40 lg:translate-x-0"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
              <Radio className="w-16 h-16 text-purple-400/40" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl opacity-50 animate-pulse" />
          </div>
          <p className="text-gray-400 text-sm mt-6 text-center">No hay música reproduciéndose</p>
        </motion.div>
      </>
    )
  }

  const coverUrl = getCoverUrl(currentSong.cover_image || currentSong.cover_url)

  return (
    <>
      {toggleButton}
      <motion.div 
        initial={{ x: 300 }}
        animate={{ x: isOpen ? 0 : 300 }}
        className="fixed top-16 right-0 bottom-20 w-80 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 border-l border-purple-500/20 flex flex-col overflow-hidden z-40 lg:translate-x-0"
      >
        {/* Header */}
        <div className="p-4 border-b border-purple-500/20">
          <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Disc3 className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
            Now Playing
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            {/* Album Cover */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="relative"
            >
              <motion.div 
                className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/30"
                animate={{ 
                  boxShadow: [
                    '0 20px 60px rgba(168, 85, 247, 0.4)',
                    '0 25px 70px rgba(236, 72, 153, 0.5)',
                    '0 20px 60px rgba(168, 85, 247, 0.4)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {coverUrl ? (
                  <img 
                    src={coverUrl} 
                    alt={currentSong.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Cover'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Music className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Song Info */}
            <div className="text-center space-y-3">
              <motion.h1 
                className="text-2xl font-black text-white leading-tight"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentSong.title}
              </motion.h1>
              <p className="text-lg text-purple-400 font-semibold">{currentSong.artist}</p>
              {currentSong.genre && (
                <span className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300">
                  {currentSong.genre}
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${progress}%` }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full transition-all ${
                  isLiked 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                aria-label="Like"
              >
                <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button
                className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all"
                aria-label="Add to playlist"
              >
                <ListMusic className="w-5 h-5" />
              </button>
            </div>

            {/* Queue */}
            {queue.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">
                  En cola ({queue.length})
                </h3>
                <div className="space-y-2">
                  {queue.slice(currentIndex + 1, currentIndex + 4).map((song, idx) => (
                    <div
                      key={song.id}
                      onClick={() => playQueue(queue, currentIndex + 1 + idx)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer transition group"
                    >
                      <div className="w-10 h-10 rounded bg-gray-800 flex-shrink-0 overflow-hidden">
                        <img 
                          src={getCoverUrl(song.cover_image || song.cover_url)} 
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate group-hover:text-purple-400">
                          {song.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
