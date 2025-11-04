import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-dark-200/50 backdrop-blur-md sticky top-0 z-10 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="bg-dark-300 rounded-full p-2 hover:bg-dark-400 transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(1)}
            className="bg-dark-300 rounded-full p-2 hover:bg-dark-400 transition"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition"
          >
            <Bell className="w-6 h-6" />
          </motion.button>

          <div className="flex items-center space-x-3 bg-dark-300 rounded-full px-4 py-2">
            <User className="w-5 h-5 text-white" />
            <span className="text-white font-medium">{user?.username}</span>
            <span className="text-xs bg-primary px-2 py-1 rounded-full text-white">
              {user?.role}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition"
          >
            <LogOut className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
