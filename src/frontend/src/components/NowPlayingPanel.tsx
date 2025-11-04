import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Heart, MoreVertical, Share2, ListMusic, Clock } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { getFileUrl } from '@/lib/utils';

interface NowPlayingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NowPlayingPanel: React.FC<NowPlayingPanelProps> = ({ isOpen, onClose }) => {
  const { currentSong, queue, currentIndex, howl } = usePlayerStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!howl) return;

    const interval = setInterval(() => {
      setCurrentTime(howl.seek() as number);
      setDuration(howl.duration());
    }, 100);

    return () => clearInterval(interval);
  }, [howl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-gradient-to-b from-dark-100 to-dark-300 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-dark-100/95 backdrop-blur-lg p-4 border-b border-dark-400 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-white">Now Playing</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Main Content */}
            <div className="p-6 space-y-6">
              {/* Album Art */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl"
              >
                {currentSong.cover_url ? (
                  <img
                    src={getFileUrl(currentSong.cover_url)}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <Music className="w-32 h-32 text-gray-600" />
                  </div>
                )}

                {/* Progress Ring Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="48"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - progress / 100) }}
                      transition={{ duration: 0.1 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1db954" />
                        <stop offset="100%" stopColor="#1ed760" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>

              {/* Song Info */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-white">{currentSong.title}</h1>
                <p className="text-lg text-gray-400">{currentSong.artist}</p>
                {currentSong.genre && (
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                    {currentSong.genre}
                  </span>
                )}
              </div>

              {/* Time Display */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center space-x-6">
                <button className="p-3 hover:bg-white/10 rounded-full transition">
                  <Heart className="w-6 h-6 text-gray-400 hover:text-primary" />
                </button>
                <button className="p-3 hover:bg-white/10 rounded-full transition">
                  <Share2 className="w-6 h-6 text-gray-400" />
                </button>
                <button className="p-3 hover:bg-white/10 rounded-full transition">
                  <MoreVertical className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Queue Section */}
              {queue.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <ListMusic className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-white">Next in Queue</h3>
                    <span className="text-sm text-gray-500">({queue.length} songs)</span>
                  </div>

                  <div className="space-y-2">
                    {queue.slice(currentIndex + 1, currentIndex + 6).map((song, idx) => (
                      <motion.div
                        key={song.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded bg-dark-400 flex items-center justify-center flex-shrink-0">
                          {song.cover_url ? (
                            <img
                              src={getFileUrl(song.cover_url)}
                              alt={song.title}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <Music className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate group-hover:text-primary transition">
                            {song.title}
                          </h4>
                          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(song.duration)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {queue.length > currentIndex + 6 && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      +{queue.length - currentIndex - 6} more songs
                    </p>
                  )}
                </div>
              )}

              {/* Lyrics Section (Placeholder) */}
              <div className="mt-8 p-6 bg-dark-400/50 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Lyrics</h3>
                <p className="text-gray-400 text-sm italic">
                  Lyrics not available for this song.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
