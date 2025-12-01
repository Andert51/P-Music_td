import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Heart, Radio, Disc3, Crown, ShieldAlert } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useAuthStore } from '@/store/authStore';
import { getFileUrl } from "@/lib/utils";
import { CircularAudioVisualizer } from "./CircularAudioVisualizer";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface NowPlayingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NowPlayingPanel: React.FC<NowPlayingPanelProps> = () => {
  const { currentSong, queue, currentIndex, howl, isPlaying } = usePlayerStore();
  const { token, user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  useEffect(() => {
    if (!howl) return;
    const interval = setInterval(() => {
      setCurrentTime(howl.seek() as number);
      setDuration(howl.duration());
    }, 100);
    return () => clearInterval(interval);
  }, [howl]);

  // Verificar si la canción está en favoritos
  useEffect(() => {
    if (!currentSong || !token) return;
    
    const checkLikedStatus = async () => {
      try {
        const response = await api.get(`/songs/${currentSong.id}/is-liked`);
        setIsLiked(response.data.is_liked);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    
    checkLikedStatus();
  }, [currentSong, token]);

  const handleToggleLike = async () => {
    if (!currentSong || !token || isLoadingLike) return;
    
    setIsLoadingLike(true);
    try {
      if (isLiked) {
        await api.delete(`/songs/${currentSong.id}/like`);
        setIsLiked(false);
        toast.success('Eliminado de favoritos');
      } else {
        await api.post(`/songs/${currentSong.id}/like`);
        setIsLiked(true);
        toast.success('Agregado a favoritos');
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Error al actualizar favoritos';
      toast.error(message);
    } finally {
      setIsLoadingLike(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentSong) {
    return (
      <div className="w-80 bg-gradient-to-b from-gruvbox-bg via-gruvbox-bg0 to-gruvbox-bg border-l border-gruvbox-aqua/20 flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gruvbox-aqua/10 to-gruvbox-purple/10 flex items-center justify-center">
            <Radio className="w-16 h-16 text-gruvbox-aqua/40" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gruvbox-aqua/20 to-gruvbox-purple/20 blur-2xl opacity-50 animate-pulse" />
        </div>
        <p className="text-gruvbox-fg4 text-sm mt-6 text-center">No hay música reproduciéndose</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-gruvbox-bg via-gruvbox-bg0 to-gruvbox-bg border-l border-gruvbox-aqua/20 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gruvbox-aqua/20 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gruvbox-aqua uppercase tracking-wider flex items-center gap-2">
          <Disc3 className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
          Now Playing
        </h2>
        {user && (
          user.role === 'user' ? (
            <span className="px-2 py-1 bg-gruvbox-fg4/20 text-gruvbox-fg4 text-[10px] font-bold rounded uppercase flex items-center gap-1 border border-gruvbox-fg4/30">
              <ShieldAlert className="w-3 h-3" />
              Free
            </span>
          ) : (
            <span className="px-2 py-1 bg-gruvbox-yellow/20 text-gruvbox-yellow text-[10px] font-bold rounded uppercase flex items-center gap-1 border border-gruvbox-yellow/40">
              <Crown className="w-3 h-3" />
              Premium
            </span>
          )
        )}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6">
          {/* Album Cover with Rotation Animation */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="relative"
          >
            <motion.div 
              className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-gruvbox-aqua/30"
              animate={{ 
                boxShadow: [
                  '0 20px 60px rgba(142, 192, 124, 0.4)',
                  '0 25px 70px rgba(211, 134, 155, 0.5)',
                  '0 20px 60px rgba(142, 192, 124, 0.4)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {currentSong.cover_url ? (
                <img 
                  src={getFileUrl(currentSong.cover_url)} 
                  alt={currentSong.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gruvbox-aqua/20 to-gruvbox-purple/20 flex items-center justify-center">
                  <Music className="w-24 h-24 text-gruvbox-fg4" />
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Song Info */}
          <div className="text-center space-y-3">
            <motion.h1 
              className="text-2xl font-black text-gruvbox-fg leading-tight"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentSong.title}
            </motion.h1>
            <p className="text-lg text-gruvbox-aqua font-semibold">{currentSong.artist}</p>
            
            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleLike}
              disabled={isLoadingLike}
              className="mx-auto disabled:opacity-50"
            >
              <Heart 
                className={`w-8 h-8 transition-all ${
                  isLiked ? 'fill-gruvbox-red text-gruvbox-red drop-shadow-[0_0_8px_rgba(251,73,52,0.8)]' : 'text-gruvbox-fg4 hover:text-gruvbox-red'
                }`} 
              />
            </motion.button>
          </div>

          {/* Circular Audio Visualizer - Estilo NCS */}
          <div className="relative bg-gruvbox-bg1 rounded-xl p-8 border border-gruvbox-aqua/20 flex items-center justify-center">
            <CircularAudioVisualizer howl={howl} isPlaying={isPlaying} />
          </div>

          {/* Progress Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gruvbox-fg3 font-mono font-bold">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 bg-gruvbox-bg2 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-gruvbox-aqua via-gruvbox-yellow to-gruvbox-orange rounded-full"
                style={{ width: `${progress}%` }}
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(142, 192, 124, 0.6)',
                    '0 0 15px rgba(250, 189, 47, 0.8)',
                    '0 0 10px rgba(142, 192, 124, 0.6)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Queue Info */}
          <div className="bg-gruvbox-bg1 rounded-xl p-4 border border-gruvbox-aqua/20">
            <h3 className="text-xs font-bold text-gruvbox-aqua uppercase tracking-wider mb-3">En Cola</h3>
            <div className="space-y-2">
              {queue.slice(currentIndex + 1, currentIndex + 4).map((song, idx) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="text-gruvbox-fg4 font-mono font-bold w-5">{idx + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-gruvbox-fg truncate font-semibold">{song.title}</p>
                    <p className="text-gruvbox-fg4 text-xs truncate">{song.artist}</p>
                  </div>
                </motion.div>
              ))}
              {queue.length <= currentIndex + 1 && (
                <p className="text-gruvbox-fg4 text-xs text-center py-2">No hay más canciones en cola</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
