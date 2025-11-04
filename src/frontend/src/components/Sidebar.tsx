import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, Music, Disc3, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Disc3, label: 'Albums', path: '/albums' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  const libraryItems = [
    { icon: Plus, label: 'Create Playlist', path: '/create-playlist' },
    { icon: Heart, label: 'Liked Songs', path: '/liked' },
  ];

  // Mostrar Upload solo para creators y admins
  const showUpload = user && (user.role === 'creator' || user.role === 'admin');

  return (
    <div className="bg-dark-200 h-screen w-64 flex flex-col p-6">
      <Link to="/" className="flex items-center space-x-2 mb-8">
        <Music className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold text-white">Music Stream</span>
      </Link>

      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ x: 5 }}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-dark-300 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </nav>

      <div className="space-y-2">
        {showUpload && (
          <Link to="/upload">
            <motion.div
              whileHover={{ x: 5 }}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors mb-4 ${
                isActive('/upload')
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-dark-300 text-white hover:bg-dark-400'
              }`}
            >
              <Upload className="w-6 h-6" />
              <span className="font-semibold">Upload Music</span>
            </motion.div>
          </Link>
        )}

        {libraryItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ x: 5 }}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-dark-300 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-dark-400">
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Upgrade to Premium</h3>
          <p className="text-sm text-gray-300 mb-3">
            Enjoy ad-free music and offline listening
          </p>
          <button className="btn-primary w-full text-sm py-2">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};
