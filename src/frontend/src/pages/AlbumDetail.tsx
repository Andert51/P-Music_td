import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Music, Play, Clock, Calendar, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import { Song } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { toast } from 'react-hot-toast';
import { getFileUrl } from '@/lib/utils';

interface Album {
  id: number;
  title: string;
  description?: string;
  cover_image?: string;
  release_date?: string;
  creator_id: number;
  is_approved: boolean;
  created_at: string;
  songs: Song[];
}

export const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue, currentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    if (id) {
      fetchAlbum();
    }
  }, [id]);

  const fetchAlbum = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/albums/${id}`);
      setAlbum(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar el álbum');
      navigate('/albums');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAlbum = () => {
    if (album && album.songs.length > 0) {
      playQueue(album.songs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (album) {
      playQueue(album.songs, index);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTotalDuration = () => {
    if (!album) return 0;
    return album.songs.reduce((total, song) => total + song.duration, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-400">Cargando álbum...</p>
        </div>
      </div>
    );
  }

  if (!album) return null;

  const totalMinutes = Math.floor(getTotalDuration() / 60);

  return (
    <div className="space-y-8 pb-32">
      {/* Back Button */}
      <button
        onClick={() => navigate('/albums')}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver a álbumes</span>
      </button>

      {/* Album Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8"
      >
        <div className="w-64 h-64 rounded-lg overflow-hidden shadow-2xl flex-shrink-0 bg-gradient-to-br from-primary/20 to-purple-500/20">
          {album.cover_image ? (
            <img
              src={getFileUrl(album.cover_image)}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-32 h-32 text-gray-600" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Álbum
          </span>
          <h1 className="text-6xl font-bold text-white">{album.title}</h1>
          {album.description && (
            <p className="text-lg text-gray-400">{album.description}</p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            {album.release_date && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(album.release_date)}</span>
              </div>
            )}
            <span>•</span>
            <span>{album.songs.length} canciones</span>
            <span>•</span>
            <span>{totalMinutes} min</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAlbum}
            className="btn-primary flex items-center space-x-2 mt-6"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            <span>Reproducir álbum</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Songs List */}
      <div className="mt-12">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 pb-2 mb-2 text-sm text-gray-400 border-b border-dark-400">
          <div className="w-12">#</div>
          <div>Título</div>
          <div className="w-20 text-right">Plays</div>
          <div className="w-20 text-right">
            <Clock className="w-4 h-4 inline" />
          </div>
        </div>

        <div className="space-y-1">
          {album.songs.map((song, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => handlePlaySong(index)}
              className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 rounded-lg hover:bg-white/5 cursor-pointer group ${
                currentSong?.id === song.id ? 'bg-primary/10' : ''
              }`}
            >
              <div className="w-12 flex items-center text-gray-400">
                {currentSong?.id === song.id && isPlaying ? (
                  <Music className="w-5 h-5 text-primary animate-pulse" />
                ) : (
                  <>
                    <span className="group-hover:hidden">{index + 1}</span>
                    <Play className="hidden group-hover:block w-5 h-5" fill="currentColor" />
                  </>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold truncate ${currentSong?.id === song.id ? 'text-primary' : 'text-white'}`}>
                  {song.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">{song.artist}</p>
              </div>

              <div className="text-gray-400 text-sm flex items-center w-20 justify-end">
                {song.play_count.toLocaleString()}
              </div>

              <div className="text-gray-400 text-sm flex items-center w-20 justify-end">
                {formatDuration(song.duration)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
