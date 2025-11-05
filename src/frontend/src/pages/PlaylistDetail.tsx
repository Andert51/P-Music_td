import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Trash2, Music, Globe, Lock, ArrowLeft, Heart, Plus } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { usePlayerStore } from '@/store/playerStore';
import { getFileUrl } from '@/lib/utils';
import { Song } from '@/types';
import { AddToPlaylistModal } from '@/components/AddToPlaylistModal';

interface PlaylistDetail {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  owner_id: number;
  created_at: string;
  songs: Song[];
}

export const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const { playSong, playQueue } = usePlayerStore();

  useEffect(() => {
    if (id) {
      fetchPlaylist();
    }
  }, [id]);

  useEffect(() => {
    if (playlist && playlist.songs.length > 0) {
      checkLikedSongs();
    }
  }, [playlist]);

  const checkLikedSongs = async () => {
    if (!playlist) return;
    try {
      const likedIds = new Set<number>();
      for (const song of playlist.songs) {
        const response = await api.get(`/songs/${song.id}/is-liked`);
        if (response.data.is_liked) {
          likedIds.add(song.id);
        }
      }
      setLikedSongs(likedIds);
    } catch (error) {
      console.error('Error al verificar likes:', error);
    }
  };

  const handleLikeSong = async (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const isLiked = likedSongs.has(song.id);
      if (isLiked) {
        await api.delete(`/songs/${song.id}/like`);
        setLikedSongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(song.id);
          return newSet;
        });
        toast.success('Eliminado de favoritos');
      } else {
        await api.post(`/songs/${song.id}/like`);
        setLikedSongs(prev => new Set(prev).add(song.id));
        toast.success('Agregado a favoritos');
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.detail?.includes('already liked')) {
        toast.error('Esta canción ya está en favoritos');
      } else if (error.response?.status === 401) {
        toast.error('Debes iniciar sesión para dar like');
      } else {
        toast.error('Error al procesar like');
      }
    }
  };

  const handleAddToPlaylist = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSongForPlaylist(song);
  };

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/playlists/${id}`);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar playlist');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSong = async (songId: number) => {
    if (!playlist) return;

    try {
      await api.delete(`/playlists/${playlist.id}/songs/${songId}`);
      setPlaylist({
        ...playlist,
        songs: playlist.songs.filter(song => song.id !== songId)
      });
      toast.success('Canción eliminada de la playlist');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar canción');
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la playlist "${playlist.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/playlists/${playlist.id}`);
      toast.success('Playlist eliminada');
      navigate('/library');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar playlist');
    }
  };

  const handlePlaySong = (song: Song) => {
    if (!playlist) return;
    const songIndex = playlist.songs.findIndex(s => s.id === song.id);
    playQueue(playlist.songs, songIndex);
  };

  const handlePlayAll = () => {
    if (!playlist || playlist.songs.length === 0) return;
    playQueue(playlist.songs, 0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gruvbox-purple"></div>
      </div>
    );
  }

  if (!playlist) {
    return null;
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-gruvbox-purple/20 via-gruvbox-bg0 to-gruvbox-bg0 border-b-2 border-gruvbox-purple/30">
        <div className="container mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate('/library')}
            className="flex items-center space-x-2 text-gruvbox-fg3 hover:text-gruvbox-fg mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Biblioteca</span>
          </button>

          <div className="flex items-end space-x-8">
            {/* Cover */}
            <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-gruvbox-purple/30 to-gruvbox-aqua/30 flex items-center justify-center shadow-2xl flex-shrink-0">
              <Music className="w-32 h-32 text-gruvbox-purple" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-3 text-gruvbox-fg3">
                {playlist.is_public ? (
                  <>
                    <Globe className="w-5 h-5 text-gruvbox-green" />
                    <span>Playlist Pública</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-gruvbox-orange" />
                    <span>Playlist Privada</span>
                  </>
                )}
              </div>

              <h1 className="text-6xl font-black text-gruvbox-fg tracking-tight">
                {playlist.name}
              </h1>

              {playlist.description && (
                <p className="text-xl text-gruvbox-fg3 max-w-2xl">
                  {playlist.description}
                </p>
              )}

              <div className="text-gruvbox-fg4">
                {playlist.songs.length} {playlist.songs.length === 1 ? 'canción' : 'canciones'}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAll}
                  disabled={playlist.songs.length === 0}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  <span>Reproducir Todo</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeletePlaylist}
                  className="btn-secondary flex items-center space-x-2 !border-gruvbox-red/30 hover:!bg-gruvbox-red/10"
                >
                  <Trash2 className="w-5 h-5 text-gruvbox-red" />
                  <span className="text-gruvbox-red">Eliminar Playlist</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="container mx-auto px-6 py-8">
        {playlist.songs.length === 0 ? (
          <div className="text-center py-20">
            <Music className="w-24 h-24 text-gruvbox-fg4 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gruvbox-fg mb-4">
              Playlist vacía
            </h3>
            <p className="text-gruvbox-fg4 text-lg">
              Usa el botón + en cualquier canción para agregarla a esta playlist
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 text-sm font-semibold text-gruvbox-fg4 border-b border-gruvbox-bg2">
              <div className="w-12 text-center">#</div>
              <div>CANCIÓN</div>
              <div className="text-center">DURACIÓN</div>
              <div className="w-32 text-center">ACCIONES</div>
            </div>

            {/* Songs */}
            {playlist.songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handlePlaySong(song)}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-4 rounded-xl hover:bg-gruvbox-bg1 border border-transparent hover:border-gruvbox-purple/30 transition-all cursor-pointer group"
              >
                {/* Number */}
                <div className="w-12 flex items-center justify-center text-gruvbox-fg3 font-mono">
                  {index + 1}
                </div>

                {/* Song Info */}
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-gruvbox-purple/20 flex items-center justify-center flex-shrink-0">
                    {song.cover_url ? (
                      <img
                        src={getFileUrl(song.cover_url)}
                        alt={song.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Music className="w-6 h-6 text-gruvbox-purple" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gruvbox-fg truncate group-hover:text-gruvbox-purple transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-sm text-gruvbox-fg4 truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-center text-gruvbox-fg3 text-sm font-mono font-semibold">
                  {formatDuration(song.duration)}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-1 w-32">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleLikeSong(song, e)}
                    className="p-2 hover:bg-gruvbox-bg2 rounded-full transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        likedSongs.has(song.id) 
                          ? 'fill-gruvbox-red text-gruvbox-red' 
                          : 'text-gruvbox-fg4 hover:text-gruvbox-red'
                      }`}
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleAddToPlaylist(song, e)}
                    className="p-2 hover:bg-gruvbox-bg2 rounded-full transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gruvbox-fg4 hover:text-gruvbox-aqua" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSong(song.id);
                    }}
                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5 text-gruvbox-red hover:text-gruvbox-red/80 transition-colors" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add to Playlist Modal */}
      {selectedSongForPlaylist && (
        <AddToPlaylistModal
          isOpen={!!selectedSongForPlaylist}
          songId={selectedSongForPlaylist.id}
          songTitle={selectedSongForPlaylist.title}
          onClose={() => setSelectedSongForPlaylist(null)}
        />
      )}
    </div>
  );
};
