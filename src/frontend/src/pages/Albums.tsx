import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Calendar, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
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
  songs?: any[];
}

export const Albums: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await api.get('/albums/', { 
        params: { limit: 50, approved_only: true } 
      });
      setAlbums(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar álbumes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gruvbox-aqua"></div>
          <p className="text-gruvbox-fg4">Cargando álbumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold text-gruvbox-fg mb-2">Álbumes</h1>
        <p className="text-gruvbox-fg4 text-lg">Explora colecciones completas de música</p>
      </motion.div>

      {albums.length === 0 ? (
        <div className="text-center py-20">
          <Music className="w-20 h-20 text-gruvbox-fg4 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gruvbox-fg mb-2">No hay álbumes</h3>
          <p className="text-gruvbox-fg4">Aún no se han agregado álbumes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/albums/${album.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gruvbox-purple/20 to-gruvbox-aqua/20 mb-4 shadow-lg shadow-gruvbox-bg0/50">
                {album.cover_image ? (
                  <img
                    src={getFileUrl(album.cover_image)}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-20 h-20 text-gruvbox-fg4" />
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-gruvbox-bg0/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-gruvbox-aqua rounded-full p-4 shadow-xl shadow-gruvbox-aqua/30"
                  >
                    <Play className="w-8 h-8 text-gruvbox-bg0" fill="currentColor" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-gruvbox-fg truncate group-hover:text-gruvbox-aqua transition">
                  {album.title}
                </h3>
                {album.release_date && (
                  <div className="flex items-center space-x-2 text-sm text-gruvbox-fg4">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(album.release_date)}</span>
                  </div>
                )}
                <p className="text-sm text-gruvbox-fg4 truncate">{album.description || 'Album'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
