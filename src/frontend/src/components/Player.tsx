import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart, Plus } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { getFileUrl } from '@/lib/utils';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { AddToPlaylistModal } from './AddToPlaylistModal';

interface PlayerProps {
  onOpenNowPlaying: () => void;
}

export const Player: React.FC<PlayerProps> = ({ onOpenNowPlaying }) => {
  const { currentSong, isPlaying, volume, togglePlay, nextSong, previousSong, setVolume, howl } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  // Check if current song is liked
  useEffect(() => {
    const checkLiked = async () => {
      if (!currentSong) return;
      try {
        const response = await api.get(`/songs/${currentSong.id}/is-liked`);
        setIsLiked(response.data.is_liked);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    checkLiked();
  }, [currentSong]);

  useEffect(() => {
    if (!howl || isSeeking) return;
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

  const handleLikeSong = async () => {
    if (!currentSong) return;
    
    try {
      if (isLiked) {
        await api.delete(`/songs/${currentSong.id}/like`);
        setIsLiked(false);
        toast.success('Eliminado de favoritos');
      } else {
        await api.post(`/songs/${currentSong.id}/like`);
        setIsLiked(true);
        toast.success('¡Agregado a favoritos!');
      }
    } catch (error: any) {
      console.error('Error al dar like:', error);
      if (error.response?.data?.detail === "Song already liked") {
        setIsLiked(true);
        toast.success('¡Agregado a favoritos!');
      } else if (error.response?.status === 401) {
        toast.error('Inicia sesión para guardar favoritos');
      } else {
        toast.error('Error al actualizar favoritos');
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setVolume(isMuted ? 0.7 : 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const newTime = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(newTime) && howl && howl.state() === 'loaded') {
      howl.seek(newTime);
      setCurrentTime(newTime);
    }
    setTimeout(() => setIsSeeking(false), 50);
  };

  if (!currentSong) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-80 bg-gradient-to-t from-gruvbox-bg via-gruvbox-bg0 to-gruvbox-bg0/95 backdrop-blur-xl border-t border-gruvbox-aqua/20 px-8 py-5 z-20"
      style={{ boxShadow: '0 -10px 40px rgba(142, 192, 124, 0.15)' }}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {/* Song Info */}
          <div className="flex items-center space-x-5 flex-1 min-w-0">
            <motion.div 
              onClick={onOpenNowPlaying}
              className="relative group cursor-pointer flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={getFileUrl(currentSong.cover_url)} 
                alt={currentSong.title} 
                className="w-20 h-20 rounded-xl shadow-xl border-2 border-gruvbox-aqua/30" 
              />
              <div className="absolute inset-0 ring-2 ring-gruvbox-aqua/0 group-hover:ring-gruvbox-aqua/60 rounded-xl transition-all" />
            </motion.div>
            
            <div className="min-w-0 flex-1">
              <h4 className="text-gruvbox-fg font-bold truncate text-lg hover:text-gruvbox-aqua transition-colors cursor-pointer">
                {currentSong.title}
              </h4>
              <p className="text-gruvbox-fg4 text-base truncate hover:text-gruvbox-fg transition-colors cursor-pointer">
                {currentSong.artist}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLikeSong}
              className="p-2.5"
            >
              <Heart 
                className={`w-7 h-7 transition-colors ${
                  isLiked ? 'fill-gruvbox-red text-gruvbox-red' : 'text-gruvbox-fg4 hover:text-gruvbox-red'
                }`} 
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPlaylistModal(true)}
              className="p-2.5"
            >
              <Plus className="w-7 h-7 text-gruvbox-fg4 hover:text-gruvbox-aqua transition-colors" />
            </motion.button>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center flex-1 max-w-2xl px-8">
            <div className="flex items-center space-x-7 mb-4">
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={previousSong}
                className="text-gruvbox-fg hover:text-gruvbox-aqua transition-colors"
              >
                <SkipBack className="w-7 h-7" fill="currentColor" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="relative bg-gradient-to-br from-gruvbox-aqua via-gruvbox-yellow to-gruvbox-orange p-4 rounded-full shadow-xl hover:shadow-2xl transition-all group border-2 border-gruvbox-aqua/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-aqua to-gruvbox-orange rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-gruvbox-bg relative z-10" fill="currentColor" />
                ) : (
                  <Play className="w-7 h-7 text-gruvbox-bg relative z-10 ml-0.5" fill="currentColor" />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSong}
                className="text-gruvbox-fg hover:text-gruvbox-aqua transition-colors"
              >
                <SkipForward className="w-7 h-7" fill="currentColor" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center space-x-4 w-full">
              <span className="text-base text-gruvbox-fg font-mono w-14 text-right font-bold">
                {formatTime(currentTime)}
              </span>
              
              <motion.div 
                className="flex-1 h-4 bg-gruvbox-bg2/80 rounded-full cursor-pointer group relative border border-gruvbox-aqua/20"
                style={{ overflow: 'visible' }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gruvbox-aqua/10 to-gruvbox-purple/10 rounded-full blur-sm" />
                
                {/* Hover effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-gruvbox-aqua/20 to-gruvbox-purple/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" 
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%'],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
                
                {/* Progress fill */}
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-gruvbox-aqua via-gruvbox-yellow to-gruvbox-orange rounded-full"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: '0 0 20px rgba(142, 192, 124, 0.9), 0 0 30px rgba(250, 189, 47, 0.6), 0 2px 4px rgba(0,0,0,0.3)',
                    overflow: 'visible'
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(142, 192, 124, 0.9), 0 0 30px rgba(250, 189, 47, 0.6)',
                      '0 0 25px rgba(142, 192, 124, 1), 0 0 40px rgba(250, 189, 47, 0.8)',
                      '0 0 20px rgba(142, 192, 124, 0.9), 0 0 30px rgba(250, 189, 47, 0.6)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
                </motion.div>

                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  onMouseUp={handleSeekEnd}
                  onTouchEnd={handleSeekEnd}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                />
              </motion.div>
              
              <span className="text-base text-gruvbox-fg font-mono w-14 font-bold">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <motion.button 
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute} 
              className="text-gruvbox-fg hover:text-gruvbox-aqua transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-7 h-7" />
              ) : (
                <Volume2 className="w-7 h-7" />
              )}
            </motion.button>
            
            <motion.div 
              className="w-36 h-4 bg-gruvbox-bg2/80 rounded-full overflow-visible cursor-pointer relative border border-gruvbox-purple/20"
              whileHover={{ scale: 1.01 }}
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-gruvbox-aqua/10 to-gruvbox-red/10 rounded-full blur-sm" />
              
              {/* Volume fill */}
              <motion.div 
                className="h-full bg-gradient-to-r from-gruvbox-aqua via-gruvbox-purple to-gruvbox-red rounded-full"
                style={{ 
                  width: `${volume * 100}%`,
                  boxShadow: '0 0 15px rgba(142, 192, 124, 0.8), 0 2px 4px rgba(0,0,0,0.3)'
                }}
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(142, 192, 124, 0.8)',
                    '0 0 20px rgba(211, 134, 155, 1)',
                    '0 0 15px rgba(142, 192, 124, 0.8)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </motion.div>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Add to Playlist Modal */}
    {currentSong && showPlaylistModal && (
      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        songId={currentSong.id}
        songTitle={currentSong.title}
        onClose={() => setShowPlaylistModal(false)}
      />
    )}
    </>
  );
};
