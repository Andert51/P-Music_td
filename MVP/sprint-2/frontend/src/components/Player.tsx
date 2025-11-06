/**
 * Player Component - Sprint 2
 * Reproductor de música con controles completos
 */

import { useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { usePlayerStore } from '../store/playerStore'

const Player = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    togglePlay,
    nextSong,
    previousSong,
    setVolume,
    howl,
  } = usePlayerStore()

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)

  // Actualizar tiempo y duración cada 100ms
  useEffect(() => {
    if (!howl || isSeeking) return
    const interval = setInterval(() => {
      setCurrentTime(howl.seek() as number)
      setDuration(howl.duration())
    }, 100)
    return () => clearInterval(interval)
  }, [howl, isSeeking])

  // Formatear tiempo (segundos -> MM:SS)
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Manejar cambio en seekbar (mientras se arrastra)
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true)
    setCurrentTime(parseFloat(e.target.value))
  }

  // Aplicar seek cuando se suelta el mouse
  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const newTime = parseFloat((e.target as HTMLInputElement).value)
    if (!isNaN(newTime) && howl && howl.state() === 'loaded') {
      howl.seek(newTime)
      setCurrentTime(newTime)
    }
    setTimeout(() => setIsSeeking(false), 50)
  }

  // Manejar cambio de volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
  }

  // Toggle mute
  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0)
    } else {
      setVolume(0.7)
    }
  }

  if (!currentSong) return null

  // Construir URL de la imagen de portada (soporta cover_image o cover_url)
  const coverPath = currentSong.cover_image || currentSong.cover_url
  const coverUrl = coverPath
    ? (coverPath.startsWith('http') ? coverPath : `http://localhost:8002${coverPath}`)
    : 'https://via.placeholder.com/300x300?text=No+Cover'

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 border-t border-purple-500/20 backdrop-blur-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Info de la canción */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={coverUrl}
              alt={currentSong.title}
              className="w-14 h-14 rounded-lg object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Cover'
              }}
            />
            <div className="min-w-0">
              <h3 className="text-white font-semibold truncate">
                {currentSong.title}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Controles de reproducción */}
          <div className="flex flex-col items-center gap-2 flex-[2]">
            <div className="flex items-center gap-4">
              <button
                onClick={previousSong}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Anterior"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 flex items-center justify-center shadow-lg hover:shadow-purple-500/50 transition-all"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white fill-white" />
                ) : (
                  <Play size={20} className="text-white fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={nextSong}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Siguiente"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Barra de progreso */}
            <div className="flex items-center gap-2 w-full max-w-xl">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer player-seekbar"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${progress}%, #374151 ${progress}%, #374151 100%)`,
                }}
              />
              <span className="text-xs text-gray-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Control de volumen */}
          <div className="flex items-center gap-3 min-w-[140px] justify-end">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Volumen"
            >
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            {/* Slider de volumen horizontal - siempre visible */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                  volume * 100
                }%, #374151 ${volume * 100}%, #374151 100%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Estilos para los sliders */}
      <style>{`
        .player-seekbar::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .player-seekbar::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}

export default Player
