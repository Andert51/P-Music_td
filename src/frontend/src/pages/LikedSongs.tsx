import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Music, Plus } from 'lucide-react';
import api from '@/lib/axios';
import { Song } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { toast } from 'react-hot-toast';
import { getFileUrl } from '@/lib/utils';
import { AddToPlaylistModal } from '@/components/AddToPlaylistModal';

export const LikedSongs: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<{ id: number; title: string } | null>(null);
  const { playQueue, currentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/songs/liked/all');
      setSongs(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar canciones favoritas');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (songId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/songs/${songId}/like`);
      setSongs(prev => prev.filter(song => song.id !== songId));
      toast.success('Eliminado de favoritos');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar de favoritos');
    }
  };

  const handlePlaySong = (_song: Song, index: number) => {
    playQueue(songs, index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gruvbox-red"></div>
          <p className="text-gruvbox-fg4">Cargando canciones favoritas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gruvbox-red via-gruvbox-purple to-gruvbox-orange p-12 rounded-3xl relative overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(251, 73, 52, 0.4)' }}
      >
        <div className="relative z-10 flex items-end gap-8">
          <div className="w-48 h-48 bg-gradient-to-br from-gruvbox-red/30 to-gruvbox-purple/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border-4 border-white/20">
            <Heart className="w-24 h-24 text-white fill-white" />
          </div>
          
          <div>
            <p className="text-white/80 font-semibold mb-2 uppercase tracking-wider text-sm">Playlist</p>
            <h1 className="text-7xl font-black text-white mb-4 drop-shadow-lg">
              Favoritas
            </h1>
            <p className="text-white/90 text-lg font-semibold">
              {songs.length} {songs.length === 1 ? 'canción' : 'canciones'}
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 w-96 h-96 bg-gruvbox-yellow/20 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Songs List */}
      {songs.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-20 h-20 text-gruvbox-fg4 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gruvbox-fg mb-2">No hay canciones favoritas</h3>
          <p className="text-gruvbox-fg4">Empieza a agregar canciones que te gusten</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gruvbox-fg">Tus Canciones</h2>
          </div>
          
          <div className="space-y-2">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`group flex items-center gap-4 p-4 rounded-xl hover:bg-gruvbox-red/10 cursor-pointer transition-all border border-transparent hover:border-gruvbox-red/30 ${
                  currentSong?.id === song.id && isPlaying ? 'bg-gruvbox-red/20 border-gruvbox-red/50' : ''
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center text-gruvbox-fg3 font-bold text-lg">
                  {index + 1}
                </div>
                
                <div 
                  onClick={() => handlePlaySong(song, index)}
                  className="relative w-16 h-16 flex-shrink-0"
                >
                  {song.cover_url ? (
                    <img
                      src={getFileUrl(song.cover_url)}
                      alt={song.title}
                      className="w-full h-full object-cover rounded-lg border-2 border-gruvbox-red/20"
                    />
                  ) : (
                    <div className="w-full h-full bg-gruvbox-bg2 rounded-lg border-2 border-gruvbox-red/20 flex items-center justify-center">
                      <Music className="w-8 h-8 text-gruvbox-fg4" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <Play size={24} fill="white" className="text-white" />
                  </div>
                </div>

                <div 
                  onClick={() => handlePlaySong(song, index)}
                  className="flex-1 min-w-0"
                >
                  <h3 className="font-semibold text-gruvbox-fg truncate group-hover:text-gruvbox-red transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gruvbox-fg4 truncate group-hover:text-gruvbox-fg3 transition-colors">
                    {song.artist}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleUnlike(song.id, e)}
                  className="p-2 opacity-100 transition-opacity"
                >
                  <Heart 
                    className="w-6 h-6 text-gruvbox-red fill-gruvbox-red hover:opacity-70 transition-opacity" 
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSong({ id: song.id, title: song.title });
                    setShowPlaylistModal(true);
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="w-6 h-6 text-gruvbox-fg4 hover:text-gruvbox-aqua transition-colors" />
                </motion.button>

                <div className="text-gruvbox-fg3 text-sm font-mono font-semibold">
                  {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add to Playlist Modal */}
      {selectedSong && (
        <AddToPlaylistModal
          isOpen={showPlaylistModal}
          onClose={() => {
            setShowPlaylistModal(false);
            setSelectedSong(null);
          }}
          songId={selectedSong.id}
          songTitle={selectedSong.title}
        />
      )}
    </div>
  );
};
