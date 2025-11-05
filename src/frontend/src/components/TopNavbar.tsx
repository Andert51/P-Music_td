import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export const TopNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-gruvbox-bg via-gruvbox-bg0 to-gruvbox-bg border-b border-gruvbox-aqua/20 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="bg-gruvbox-bg1 hover:bg-gruvbox-aqua/20 rounded-full p-2.5 transition-all border border-gruvbox-aqua/20 hover:border-gruvbox-aqua/50 shadow-lg hover:shadow-gruvbox-aqua/30"
        >
          <ChevronLeft size={22} className="text-gruvbox-fg4 hover:text-gruvbox-aqua" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(1)}
          className="bg-gruvbox-bg1 hover:bg-gruvbox-aqua/20 rounded-full p-2.5 transition-all border border-gruvbox-aqua/20 hover:border-gruvbox-aqua/50 shadow-lg hover:shadow-gruvbox-aqua/30"
        >
          <ChevronRight size={22} className="text-gruvbox-fg4 hover:text-gruvbox-aqua" />
        </motion.button>
      </div>

      {/* Search Button - Simple Icon Button */}
      <div className="flex-1 flex justify-center mx-8">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/search')}
          className="bg-gruvbox-bg1 hover:bg-gruvbox-aqua/20 rounded-full p-4 transition-all border-2 border-gruvbox-aqua/20 hover:border-gruvbox-aqua/60 shadow-lg hover:shadow-gruvbox-aqua/30 group"
          title="Buscar música"
        >
          <Search size={24} className="text-gruvbox-fg4 group-hover:text-gruvbox-aqua transition-colors" />
        </motion.button>
      </div>

      {/* User Menu */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 bg-gruvbox-bg1 hover:bg-gruvbox-bg2 rounded-full px-5 py-2.5 transition-colors border-2 border-gruvbox-aqua/20 hover:border-gruvbox-purple/40 shadow-lg hover:shadow-gruvbox-purple/30"
        >
          <motion.div 
            className="w-9 h-9 bg-gradient-to-br from-gruvbox-aqua via-gruvbox-yellow to-gruvbox-purple rounded-full flex items-center justify-center shadow-xl"
            animate={{
              boxShadow: [
                '0 0 15px rgba(142, 192, 124, 0.5)',
                '0 0 20px rgba(211, 134, 155, 0.6)',
                '0 0 15px rgba(142, 192, 124, 0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <User size={20} className="text-gruvbox-bg" />
          </motion.div>
          <span className="font-bold text-gruvbox-fg">{user?.username || 'Usuario'}</span>
        </motion.button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-56 bg-gruvbox-bg1 rounded-lg shadow-2xl border-2 border-gruvbox-aqua/30 overflow-hidden backdrop-blur-xl"
          >
            <Link
              to="/profile"
              className="block px-4 py-3 hover:bg-gruvbox-aqua/20 transition-colors text-gruvbox-fg hover:text-gruvbox-aqua font-semibold"
              onClick={() => setShowUserMenu(false)}
            >
              <div className="flex items-center gap-3">
                <User size={18} />
                <span>Perfil</span>
              </div>
            </Link>
            
            <div className="border-t border-gruvbox-aqua/20">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-gruvbox-red/20 transition-colors text-gruvbox-red hover:text-gruvbox-red font-semibold"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} />
                  <span>Cerrar sesión</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
