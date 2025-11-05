import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Music } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

interface Playlist {
  id: number;
  name: string;
  description?: string;
  is_public: boolean;
  owner_id: number;
}

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: number;
  songTitle: string;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  songId,
  songTitle
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen]);

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

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      await api.post(`/playlists/${playlistId}/songs/${songId}`);
      toast.success('Canción agregada a la playlist');
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response?.data?.detail === 'Song already in playlist') {
        toast.error('La canción ya está en esta playlist');
      } else {
        toast.error('Error al agregar canción');
      }
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

      // Agregar la canción a la nueva playlist
      await api.post(`/playlists/${response.data.id}/songs/${songId}`);
      
      toast.success('Playlist creada y canción agregada');
      setShowCreateForm(false);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setIsPublic(false);
      fetchPlaylists();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear playlist');
    }
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] overflow-y-auto bg-gruvbox-bg1 rounded-2xl shadow-2xl z-50 border-2 border-gruvbox-aqua/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gruvbox-bg2">
              <div>
                <h2 className="text-2xl font-bold text-gruvbox-fg">
                  Agregar a playlist
                </h2>
                <p className="text-sm text-gruvbox-fg4 mt-1 truncate">
                  {songTitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gruvbox-bg2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gruvbox-fg4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gruvbox-aqua"></div>
                </div>
              ) : showCreateForm ? (
                // Create Playlist Form
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
                      id="isPublic"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-gruvbox-aqua/30 bg-gruvbox-bg2 checked:bg-gruvbox-aqua transition-colors"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gruvbox-fg cursor-pointer">
                      Hacer pública esta playlist
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreatePlaylist}
                      className="flex-1 btn-primary"
                    >
                      Crear y agregar
                    </button>
                  </div>
                </div>
              ) : (
                // Playlists List
                <div className="space-y-2">
                  {/* Create New Button */}
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full flex items-center space-x-3 p-4 rounded-xl bg-gruvbox-bg2 hover:bg-gruvbox-aqua/10 border-2 border-dashed border-gruvbox-aqua/30 hover:border-gruvbox-aqua/60 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gruvbox-aqua/20 flex items-center justify-center group-hover:bg-gruvbox-aqua/30 transition-colors">
                      <Plus className="w-6 h-6 text-gruvbox-aqua" />
                    </div>
                    <span className="font-semibold text-gruvbox-fg">
                      Crear playlist nueva
                    </span>
                  </button>

                  {/* Existing Playlists */}
                  {playlists.length === 0 ? (
                    <div className="text-center py-8">
                      <Music className="w-12 h-12 text-gruvbox-fg4 mx-auto mb-3" />
                      <p className="text-gruvbox-fg4">
                        No tienes playlists aún
                      </p>
                    </div>
                  ) : (
                    playlists.map((playlist) => (
                      <button
                        key={playlist.id}
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        className="w-full flex items-center space-x-3 p-4 rounded-xl bg-gruvbox-bg2 hover:bg-gruvbox-aqua/10 border border-transparent hover:border-gruvbox-aqua/30 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gruvbox-purple/20 flex items-center justify-center">
                          <Music className="w-6 h-6 text-gruvbox-purple" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-gruvbox-fg group-hover:text-gruvbox-aqua transition-colors">
                            {playlist.name}
                          </h4>
                          {playlist.description && (
                            <p className="text-sm text-gruvbox-fg4 truncate">
                              {playlist.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
