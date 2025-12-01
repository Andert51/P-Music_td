import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Heart, Plus, Album, Music2, Upload, Crown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isCollapsed] = useState(true); // Collapsed by default
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/albums', icon: Album, label: 'Albums' },
    { path: '/library', icon: Library, label: 'Your Library' },
    { path: '/liked', icon: Heart, label: 'Liked Songs' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Mostrar Upload solo para creators y admins
  const showUpload = user && (user.role === 'creator' || user.role === 'admin');

  // Auto expand/collapse on hover
  const shouldExpand = !isCollapsed || isHovered;

  return (
    <motion.div
      initial={{ width: 80 }}
      animate={{ width: shouldExpand ? 240 : 80 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-gradient-to-b from-gruvbox-bg via-gruvbox-bg0 to-gruvbox-bg h-full flex flex-col relative border-r border-gruvbox-aqua/20"
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gruvbox-aqua via-gruvbox-yellow to-gruvbox-purple rounded-lg flex items-center justify-center flex-shrink-0 shadow-xl shadow-gruvbox-aqua/30 animate-pulse">
          <Music2 className="text-gruvbox-bg" size={24} />
        </div>
        <AnimatePresence>
          {shouldExpand && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 
                className="text-2xl font-black whitespace-nowrap animate-rainbow-text"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #8ec07c, #fabd2f, #fe8019, #d3869b, #b16286, #83a598, #8ec07c)',
                  backgroundSize: '200% auto',
                  color: 'transparent',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'rainbow 3s linear infinite',
                }}
              >
                P-Music
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-gruvbox-aqua/20 to-gruvbox-purple/20 text-gruvbox-aqua border border-gruvbox-aqua/40 shadow-lg shadow-gruvbox-aqua/20'
                : 'text-gruvbox-fg4 hover:text-gruvbox-fg hover:bg-gruvbox-bg1'
            }`}
          >
            <item.icon size={22} className="flex-shrink-0" />
            <AnimatePresence>
              {shouldExpand && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>

      {/* Premium Banner - Solo para usuarios normales */}
      {user && user.role === 'user' && (
        <div className="p-3">
          <Link to="/premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-gradient-to-br from-gruvbox-yellow/20 via-gruvbox-orange/20 to-gruvbox-purple/20 backdrop-blur-sm border-2 border-gruvbox-yellow/40 rounded-xl overflow-hidden cursor-pointer group ${
                !shouldExpand ? 'p-3' : 'p-4'
              }`}
            >
              {/* Animated background */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-gruvbox-yellow/10 to-gruvbox-purple/10 rounded-xl"
              />

              {/* Contenido cuando está colapsado - Solo corona */}
              {!shouldExpand && (
                <motion.div
                  className="relative flex justify-center"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Crown className="w-7 h-7 text-gruvbox-yellow drop-shadow-lg" />
                </motion.div>
              )}

              {/* Contenido cuando está expandido - Banner completo */}
              {shouldExpand && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Crown className="w-6 h-6 text-gruvbox-yellow" />
                    </motion.div>
                    <h3 className="font-black text-gruvbox-fg text-sm">Actualiza a Premium</h3>
                  </div>

                  <p className="text-xs text-gruvbox-fg4 mb-3 leading-relaxed">
                    Sin anuncios, calidad HD y descargas ilimitadas
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gruvbox-yellow">
                      Desde $4.99/mes
                    </span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-gruvbox-yellow" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Shine effect */}
              <motion.div
                animate={{ x: [-100, 200] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
            </motion.div>
          </Link>
        </div>
      )}

      {/* Create Playlist Button - Redesigned */}
      <div className="p-3 space-y-2 pb-44">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-gradient-to-r from-gruvbox-aqua/10 to-gruvbox-purple/10 border border-gruvbox-aqua/30 text-gruvbox-aqua hover:shadow-lg hover:shadow-gruvbox-aqua/30 transition-all relative overflow-hidden group ${
            !shouldExpand ? 'justify-center' : ''
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gruvbox-aqua/5 to-gruvbox-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus size={22} className="flex-shrink-0 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
          <AnimatePresence>
            {shouldExpand && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium whitespace-nowrap overflow-hidden relative z-10"
              >
                Create Playlist
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Upload Button - Redesigned (solo para creators/admins) */}
        {showUpload && (
          <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-gradient-to-r from-gruvbox-purple/10 to-gruvbox-orange/10 border border-gruvbox-purple/30 text-gruvbox-purple hover:shadow-lg hover:shadow-gruvbox-purple/30 transition-all relative overflow-hidden group ${
                !shouldExpand ? 'justify-center' : ''
              } ${isActive('/upload') ? 'border-gruvbox-purple/50 shadow-lg shadow-gruvbox-purple/30' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gruvbox-purple/5 to-gruvbox-orange/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Upload size={22} className="flex-shrink-0 relative z-10 group-hover:translate-y-[-2px] transition-transform" />
              <AnimatePresence>
                {shouldExpand && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap overflow-hidden relative z-10"
                  >
                    Upload Music
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Link>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 text-xs text-gray-500 border-t border-cyan/10"
        >
          <p className="mb-1 text-gray-400">© 2025 P-Music</p>
          <p className="text-gray-600">Stream Your Sound</p>
        </motion.div>
      )}
    </motion.div>
  );
};
