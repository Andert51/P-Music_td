import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Play, Heart, Music, Plus } from 'lucide-react';
import api from '@/lib/axios';
import { Song } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { toast } from 'react-hot-toast';
import { getFileUrl } from '@/lib/utils';
import { AddToPlaylistModal } from '@/components/AddToPlaylistModal';

export const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<{ id: number; title: string } | null>(null);
  const { playQueue, currentSong, isPlaying } = usePlayerStore();

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const delayDebounceFn = setTimeout(() => {
        performSearch();
      }, 500); // Debounce de 500ms

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSongs([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const fetchLikedSongs = async () => {
    try {
      const likedRes = await api.get('/songs/liked/all');
      console.log('Liked songs response (Search):', likedRes.data);
      const likedIds = new Set(likedRes.data.map((song: Song) => song.id));
      console.log('Liked IDs (Search):', Array.from(likedIds));
      setLikedSongs(likedIds);
    } catch (error) {
      console.error('Error al cargar likes (Search):', error);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      setHasSearched(true);
      const response = await api.get('/songs/', {
        params: {
          search: searchQuery,
          approved_only: true,
          order_by: 'play_count',
          limit: 50
        }
      });
      setSongs(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al buscar canciones');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeSong = async (songId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      if (likedSongs.has(songId)) {
        await api.delete(`/songs/${songId}/like`);
        setLikedSongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(songId);
          return newSet;
        });
        toast.success('Eliminado de favoritos');
      } else {
        await api.post(`/songs/${songId}/like`);
        setLikedSongs(prev => new Set(prev).add(songId));
        toast.success('¡Agregado a favoritos!');
      }
    } catch (error: any) {
      console.error('Error al dar like:', error);
      console.error('Response:', error.response?.data);
      
      // Si ya está likeada, actualizar el estado local
      if (error.response?.data?.detail === "Song already liked") {
        setLikedSongs(prev => new Set(prev).add(songId));
        toast.success('¡Agregado a favoritos!');
      } else if (error.response?.status === 401) {
        toast.error('Inicia sesión para guardar favoritos');
      } else {
        toast.error('Error al actualizar favoritos');
      }
    }
  };

  const handlePlaySong = (_song: Song, index: number) => {
    playQueue(songs, index);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header con barra de búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-gruvbox-bg/95 backdrop-blur-md pb-6 pt-2"
      >
        <h1 className="text-5xl font-bold text-gruvbox-fg mb-6">Buscar</h1>
        
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gruvbox-fg4 w-6 h-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="¿Qué quieres escuchar?"
            className="w-full bg-gruvbox-bg1 text-gruvbox-fg placeholder-gruvbox-fg4 pl-14 pr-6 py-4 rounded-xl border-2 border-gruvbox-aqua/20 focus:border-gruvbox-aqua focus:outline-none transition-colors text-lg"
            autoFocus
          />
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gruvbox-aqua"></div>
            <p className="text-gruvbox-fg4">Buscando...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {hasSearched && !loading && songs.length === 0 && (
        <div className="text-center py-20">
          <SearchIcon className="w-20 h-20 text-gruvbox-fg4 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gruvbox-fg mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gruvbox-fg4">
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}

      {/* Results */}
      {songs.length > 0 && !loading && (
        <div>
          <h2 className="text-2xl font-bold text-gruvbox-fg mb-6">
            {songs.length} {songs.length === 1 ? 'resultado' : 'resultados'}
          </h2>
          
          <div className="space-y-2">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`group flex items-center gap-4 p-4 rounded-xl hover:bg-gruvbox-aqua/10 cursor-pointer transition-all border border-transparent hover:border-gruvbox-aqua/30 ${
                  currentSong?.id === song.id && isPlaying ? 'bg-gruvbox-aqua/20 border-gruvbox-aqua/50' : ''
                }`}
              >
                <div 
                  onClick={() => handlePlaySong(song, index)}
                  className="relative w-16 h-16 flex-shrink-0"
                >
                  {song.cover_url ? (
                    <img
                      src={getFileUrl(song.cover_url)}
                      alt={song.title}
                      className="w-full h-full object-cover rounded-lg border-2 border-gruvbox-aqua/20"
                    />
                  ) : (
                    <div className="w-full h-full bg-gruvbox-bg2 rounded-lg border-2 border-gruvbox-aqua/20 flex items-center justify-center">
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
                  <h3 className="font-semibold text-gruvbox-fg truncate group-hover:text-gruvbox-aqua transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-sm text-gruvbox-fg4 truncate group-hover:text-gruvbox-fg3 transition-colors">
                    {song.artist}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleLikeSong(song.id, e)}
                    className={`p-2 transition-opacity ${
                      likedSongs.has(song.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Heart 
                      className={`w-6 h-6 transition-all ${
                        likedSongs.has(song.id) 
                          ? 'text-gruvbox-red fill-gruvbox-red' 
                          : 'text-gruvbox-fg4 hover:text-gruvbox-red'
                      }`}
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
                </div>

                <div className="text-gruvbox-fg3 text-sm font-mono font-semibold">
                  {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !loading && (
        <div className="text-center py-20">
          <SearchIcon className="w-24 h-24 text-gruvbox-aqua/40 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-gruvbox-fg mb-4">
            Encuentra tu música favorita
          </h3>
          <p className="text-gruvbox-fg4 text-lg">
            Busca canciones, artistas o álbumes
          </p>
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
