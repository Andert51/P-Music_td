import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Music, RefreshCw } from 'lucide-react';
import api from '@/lib/axios';
import { Song } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { toast } from 'react-hot-toast';
import { getFileUrl } from '@/lib/utils';

export const Home: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { playQueue, currentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/songs/', { 
        params: { limit: 50, approved_only: true } 
      });
      setSongs(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar canciones');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (_song: Song, index: number) => {
    playQueue(songs, index);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent rounded-2xl p-8 mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Bienvenido a Music Streaming
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Descubre y disfruta de millones de canciones
            </p>
          </div>
          <button
            onClick={() => {
              fetchSongs();
              toast.success('Canciones actualizadas');
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => songs.length > 0 && handlePlaySong(songs[0], 0)}
          className="btn-primary flex items-center space-x-2"
        >
          <Play className="w-5 h-5" fill="currentColor" />
          <span>Reproducir</span>
        </motion.button>
      </motion.div>

      {songs.length === 0 ? (
        <div className="text-center py-20">
          <Music className="w-20 h-20 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No hay canciones</h3>
          <p className="text-gray-400">Aún no se han agregado canciones.</p>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Todas las canciones</h2>
          <div className="grid grid-cols-1 gap-2">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handlePlaySong(song, index)}
                className={`group flex items-center space-x-4 p-4 rounded-lg hover:bg-white/5 cursor-pointer ${
                  currentSong?.id === song.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="w-12 text-gray-400">
                  {currentSong?.id === song.id && isPlaying ? (
                    <Music className="w-5 h-5 text-primary animate-pulse" />
                  ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                  )}
                  <Play className="hidden group-hover:block w-5 h-5" fill="currentColor" />
                </div>
                <div className="w-14 h-14 rounded bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  {song.cover_url ? (
                    <img src={getFileUrl(song.cover_url)} alt={song.title} className="w-full h-full object-cover rounded" />
                  ) : (
                    <Music className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${currentSong?.id === song.id ? 'text-primary' : 'text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
                <div className="text-gray-400 text-sm flex items-center space-x-4">
                  <span>{song.play_count} plays</span>
                  <span>{formatDuration(song.duration)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
