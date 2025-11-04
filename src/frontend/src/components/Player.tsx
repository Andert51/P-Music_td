import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { getFileUrl } from '@/lib/utils';

interface PlayerProps {
  onOpenNowPlaying: () => void;
}

export const Player: React.FC<PlayerProps> = ({ onOpenNowPlaying }) => {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    togglePlay, 
    nextSong, 
    previousSong, 
    setVolume, 
    howl
  } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false); // Para pausar la actualización automática

  useEffect(() => {
    if (!howl || isSeeking) return; // No actualizar si el usuario está buscando

    const interval = setInterval(() => {
      setCurrentTime(howl.seek() as number);
      setDuration(howl.duration());
    }, 100);

    return () => clearInterval(interval);
  }, [howl, isSeeking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    // Solo actualizar la UI mientras arrastra
    setIsSeeking(true);
    setCurrentTime(newTime);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const newTime = parseFloat((e.target as HTMLInputElement).value);
    
    if (isNaN(newTime) || !howl) {
      setIsSeeking(false);
      return;
    }
    
    // Verificar que el audio esté listo
    if (howl.state() !== 'loaded') {
      setIsSeeking(false);
      return;
    }
    
    // Aplicar seek
    howl.seek(newTime);
    setCurrentTime(newTime);
    
    setTimeout(() => {
      setIsSeeking(false);
    }, 50);
  };

  if (!currentSong) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-dark-200 border-t border-dark-400 px-4 py-3"
    >
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div 
            onClick={onOpenNowPlaying}
            className="relative group cursor-pointer"
          >
            <img
              src={getFileUrl(currentSong.cover_url)}
              alt={currentSong.title}
              className="w-14 h-14 rounded-md transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-semibold truncate">{currentSong.title}</h4>
            <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 max-w-2xl">
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={previousSong}
              className="text-gray-400 hover:text-white transition"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="bg-white rounded-full p-2 hover:scale-110 transition"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 text-black" fill="currentColor" />
              )}
            </motion.button>
            
            <button
              onClick={nextSong}
              className="text-gray-400 hover:text-white transition"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              onMouseUp={handleSeekMouseUp}
              onTouchEnd={handleSeekMouseUp}
              className="flex-1 h-1 bg-dark-400 rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-110"
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-1 justify-end">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-dark-400 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
              [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>
    </motion.div>
  );
};
