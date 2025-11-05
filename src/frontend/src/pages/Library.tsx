import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Music, Lock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface Playlist {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  owner_id: number;
  created_at: string;
}

export const Library: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await api.get('/playlists/my');
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      toast.error('Ingresa un nombre para la playlist');
      return;
    }

    try {
      const response = await api.post('/playlists/', {
        name: newPlaylistName,
        description: newPlaylistDescription,
        is_public: isPublic
      });

      setPlaylists([...playlists, response.data]);
      toast.success('Playlist creada');
      setShowCreateModal(false);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setIsPublic(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear playlist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gruvbox-aqua"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black text-gruvbox-fg mb-3 tracking-tight">
            Tu Biblioteca
          </h1>
          <p className="text-gruvbox-fg3 text-lg">
            {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>

        {/* Create Playlist Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Playlist</span>
        </motion.button>
      </div>

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <div className="text-center py-20">
          <Music className="w-24 h-24 text-gruvbox-fg4 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-gruvbox-fg mb-4">
            No tienes playlists aún
          </h3>
          <p className="text-gruvbox-fg4 text-lg mb-8">
            Crea tu primera playlist y empieza a coleccionar tu música favorita
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Crear Playlist</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlists/${playlist.id}`}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                className="bg-gruvbox-bg1 rounded-2xl p-4 border-2 border-gruvbox-bg2 hover:border-gruvbox-purple/50 transition-all shadow-lg hover:shadow-2xl cursor-pointer group"
              >
                {/* Cover */}
                <div className="aspect-square rounded-xl bg-gradient-to-br from-gruvbox-purple/30 to-gruvbox-aqua/30 mb-4 flex items-center justify-center relative overflow-hidden">
                  <Music className="w-16 h-16 text-gruvbox-purple group-hover:scale-125 transition-transform duration-300" />
                  
                  {/* Privacy Badge */}
                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-gruvbox-bg0/80 backdrop-blur-sm">
                    {playlist.is_public ? (
                      <Globe className="w-4 h-4 text-gruvbox-green" />
                    ) : (
                      <Lock className="w-4 h-4 text-gruvbox-orange" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-bold text-gruvbox-fg mb-1 truncate group-hover:text-gruvbox-purple transition-colors">
                    {playlist.name}
                  </h3>
                  {playlist.description && (
                    <p className="text-sm text-gruvbox-fg4 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gruvbox-bg1 rounded-2xl shadow-2xl z-50 border-2 border-gruvbox-purple/30"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gruvbox-fg mb-6">
                Crear Playlist Nueva
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gruvbox-fg mb-2">
                    Nombre de la playlist *
                  </label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Mi playlist"
                    className="input w-full"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gruvbox-fg mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    placeholder="Describe tu playlist..."
                    className="input w-full min-h-[80px]"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublicLib"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-gruvbox-purple/30 bg-gruvbox-bg2 checked:bg-gruvbox-purple transition-colors"
                  />
                  <label htmlFor="isPublicLib" className="text-sm text-gruvbox-fg cursor-pointer">
                    Hacer pública esta playlist
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreatePlaylist}
                    className="flex-1 btn-primary"
                  >
                    Crear Playlist
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};
