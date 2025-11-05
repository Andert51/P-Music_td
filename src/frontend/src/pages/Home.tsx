import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Flame, History, Heart, Sparkles, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/axios';
import { Song, Album } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { toast } from 'react-hot-toast';
import { getFileUrl } from '@/lib/utils';

export const Home: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { playQueue, currentSong, isPlaying } = usePlayerStore();
  const floatingOrbs = useRef<(HTMLDivElement | null)[]>([]);

  // Simple floating animation with CSS
  useEffect(() => {
    floatingOrbs.current.forEach((orb, index) => {
      if (!orb) return;
      
      const duration = 8 + Math.random() * 4;
      const delay = index * 0.5;
      
      orb.style.animation = `float-${index % 3} ${duration}s ease-in-out ${delay}s infinite`;
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [songsRes, albumsRes] = await Promise.all([
        api.get('/songs/', { params: { limit: 12, approved_only: true } }),
        api.get('/albums/', { params: { limit: 6 } })
      ]);
      setSongs(songsRes.data);
      setAlbums(albumsRes.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar contenido');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (_song: Song, index: number) => {
    playQueue(songs, index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32">
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(8)].map((_, i) => {
          const sizes = [150, 200, 250, 180, 220, 280, 160, 240];
          const positions = [
            { left: '10%', top: '20%' },
            { left: '80%', top: '15%' },
            { left: '5%', top: '70%' },
            { left: '90%', top: '60%' },
            { left: '45%', top: '10%' },
            { left: '70%', top: '85%' },
            { left: '20%', top: '50%' },
            { left: '60%', top: '40%' },
          ];
          
          return (
            <div
              key={i}
              ref={(el) => {
                if (el) floatingOrbs.current[i] = el;
              }}
              className="absolute rounded-full blur-3xl animate-breathe"
              style={{
                width: sizes[i] + 'px',
                height: sizes[i] + 'px',
                left: positions[i].left,
                top: positions[i].top,
                background: [
                  'radial-gradient(circle, rgba(142, 192, 124, 0.3), transparent)',
                  'radial-gradient(circle, rgba(211, 134, 155, 0.3), transparent)',
                  'radial-gradient(circle, rgba(131, 165, 152, 0.3), transparent)',
                  'radial-gradient(circle, rgba(250, 189, 47, 0.3), transparent)',
                  'radial-gradient(circle, rgba(254, 128, 25, 0.3), transparent)',
                ][i % 5],
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + i}s`,
              }}
            />
          );
        })}
      </div>

      {/* Hero Section - Gruvbox Style with Better Visibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gruvbox-aqua via-gruvbox-purple to-gruvbox-blue p-16 z-10"
        style={{ boxShadow: '0 20px 60px rgba(142, 192, 124, 0.4)' }}
      >
        <div className="relative z-10">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-black text-gruvbox-bg drop-shadow-lg mb-6"
          >
            Descubre nueva música
          </motion.h1>
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-gruvbox-bg/90 font-semibold mb-10 max-w-2xl drop-shadow"
          >
            Explora millones de canciones, álbumes y artistas
          </motion.p>
          <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gruvbox-bg text-gruvbox-fg font-bold px-10 py-5 rounded-full hover:shadow-2xl hover:shadow-gruvbox-bg/50 transition-all flex items-center gap-3 border-4 border-gruvbox-bg/30"
          >
            <Play size={24} fill="currentColor" className="text-gruvbox-aqua" />
            <span className="text-lg">Reproducir ahora</span>
          </motion.button>
        </div>
        
        {/* Decorative animated elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-gruvbox-yellow/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-gruvbox-orange/20 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Quick Access Cards - Larger & More Aesthetic */}
      <div className="grid grid-cols-3 gap-8">
        {/* Tendencias Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.98 }}
          className="relative group bg-gradient-to-br from-gruvbox-bg1 to-gruvbox-bg2 rounded-3xl p-10 border-2 border-gruvbox-aqua/30 cursor-pointer overflow-hidden transition-all"
          style={{ minHeight: '220px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-aqua/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 w-32 h-32 bg-gruvbox-aqua/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          
          <Flame className="w-16 h-16 text-gruvbox-aqua mb-6 relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" strokeWidth={2.5} />
          <h3 className="text-2xl font-bold mb-3 relative z-10 text-gruvbox-fg">Tendencias</h3>
          <p className="text-gruvbox-fg4 relative z-10 text-base">Lo más popular ahora</p>
          
          <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sparkles className="w-24 h-24 text-gruvbox-aqua" />
          </div>
        </motion.div>

        {/* Recientes Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -8 }}
          whileTap={{ scale: 0.98 }}
          className="relative group bg-gradient-to-br from-gruvbox-bg1 to-gruvbox-bg2 rounded-3xl p-10 border-2 border-gruvbox-purple/30 cursor-pointer overflow-hidden transition-all"
          style={{ minHeight: '220px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 w-32 h-32 bg-gruvbox-purple/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          
          <History className="w-16 h-16 text-gruvbox-purple mb-6 relative z-10 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300" strokeWidth={2.5} />
          <h3 className="text-2xl font-bold mb-3 relative z-10 text-gruvbox-fg">Recientes</h3>
          <p className="text-gruvbox-fg4 relative z-10 text-base">Tu música reciente</p>
          
          <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Music className="w-24 h-24 text-gruvbox-purple" />
          </div>
        </motion.div>

        {/* Favoritas Card */}
        <Link to="/liked">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            className="relative group bg-gradient-to-br from-gruvbox-bg1 to-gruvbox-bg2 rounded-3xl p-10 border-2 border-gruvbox-red/30 cursor-pointer overflow-hidden transition-all"
            style={{ minHeight: '220px' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-red/10 via-gruvbox-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 right-4 w-32 h-32 bg-gruvbox-red/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <Heart className="w-16 h-16 text-gruvbox-red mb-6 relative z-10 group-hover:scale-125 group-hover:fill-gruvbox-red transition-all duration-300" strokeWidth={2.5} />
            <h3 className="text-2xl font-bold mb-3 relative z-10 text-gruvbox-fg">Favoritas</h3>
            <p className="text-gruvbox-fg4 relative z-10 text-base">Canciones que amas</p>
            
            <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-24 h-24 text-gruvbox-red" />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Albums Section */}
      {albums.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gruvbox-fg">Álbumes Destacados</h2>
            <Link to="/albums" className="text-gruvbox-aqua hover:text-gruvbox-yellow font-semibold transition-colors">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {albums.map((album) => (
              <Link key={album.id} to={`/albums/${album.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gruvbox-bg2 border-2 border-gruvbox-aqua/20 group-hover:border-gruvbox-aqua/60 transition-colors">
                    <img
                      src={getFileUrl(album.cover_image) || 'https://via.placeholder.com/300'}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.div 
                        initial={{ y: 8 }}
                        whileHover={{ y: 0 }}
                        className="bg-gradient-to-br from-gruvbox-aqua to-gruvbox-purple rounded-full p-4 shadow-2xl"
                      >
                        <Play size={24} fill="white" className="text-white" />
                      </motion.div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gruvbox-fg truncate group-hover:text-gruvbox-aqua transition-colors">{album.title}</h3>
                  <p className="text-sm text-gruvbox-fg4 truncate">Álbum</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Songs Section */}
      {songs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gruvbox-fg">Canciones Populares</h2>
          </div>
          <div className="space-y-2">
            {songs.slice(0, 10).map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group flex items-center gap-4 p-4 rounded-xl hover:bg-gruvbox-aqua/10 cursor-pointer transition-all border border-transparent hover:border-gruvbox-aqua/30 ${
                  currentSong?.id === song.id && isPlaying ? 'bg-gruvbox-aqua/20 border-gruvbox-aqua/50' : ''
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center text-gruvbox-fg3 font-bold text-lg">
                  {index + 1}
                </div>
                
                <div 
                  onClick={() => handlePlaySong(song, index)}
                  className="relative w-16 h-16 flex-shrink-0"
                >
                  <img
                    src={getFileUrl(song.cover_url) || 'https://via.placeholder.com/100'}
                    alt={song.title}
                    className="w-full h-full object-cover rounded-lg border-2 border-gruvbox-aqua/20"
                  />
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
                  <p className="text-sm text-gruvbox-fg4 truncate group-hover:text-gruvbox-fg3 transition-colors">{song.artist}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success('¡Agregado a favoritos!');
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart 
                    className="w-6 h-6 text-gruvbox-fg4 hover:text-gruvbox-red hover:fill-gruvbox-red transition-all" 
                  />
                </motion.button>

                <div className="text-gruvbox-fg3 text-sm font-mono font-semibold">
                  {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
