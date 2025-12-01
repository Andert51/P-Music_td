import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Volume2, Sparkles, Gift, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdBannerProps {
  variant?: 'horizontal' | 'vertical' | 'square';
}

export const AdBanner: React.FC<AdBannerProps> = ({ variant = 'horizontal' }) => {
  const ads = [
    {
      title: '¡Actualiza a Premium!',
      description: 'Sin anuncios, calidad HD y más',
      cta: 'Ver planes',
      link: '/premium',
      gradient: 'from-gruvbox-yellow via-gruvbox-orange to-gruvbox-red',
      icon: Sparkles,
    },
    {
      title: 'Música sin límites',
      description: 'Escucha en HD sin interrupciones',
      cta: 'Prueba Premium',
      link: '/premium',
      gradient: 'from-gruvbox-aqua via-gruvbox-yellow to-gruvbox-purple',
      icon: Volume2,
    },
    {
      title: '30 días gratis',
      description: 'Premium sin costo inicial',
      cta: 'Comenzar ahora',
      link: '/premium',
      gradient: 'from-gruvbox-purple via-gruvbox-orange to-gruvbox-yellow',
      icon: Gift,
    },
    {
      title: 'Sin anuncios para siempre',
      description: 'Únete a Premium hoy',
      cta: 'Actualizar',
      link: '/premium',
      gradient: 'from-gruvbox-orange via-gruvbox-red to-gruvbox-purple',
      icon: Zap,
    },
  ];

  const randomAd = ads[Math.floor(Math.random() * ads.length)];
  const Icon = randomAd.icon;

  if (variant === 'vertical') {
    return (
      <Link to={randomAd.link}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative bg-gradient-to-br ${randomAd.gradient} p-6 rounded-xl overflow-hidden cursor-pointer group`}
        >
          {/* Animated background */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
          />

          {/* Label */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-gruvbox-bg/80 backdrop-blur-sm rounded text-[10px] font-bold text-gruvbox-fg4 uppercase">
            Anuncio
          </div>

          {/* Content */}
          <div className="relative space-y-3">
            <Icon className="w-10 h-10 text-gruvbox-bg" />
            <h3 className="text-xl font-black text-gruvbox-bg">{randomAd.title}</h3>
            <p className="text-sm text-gruvbox-bg/80">{randomAd.description}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 px-4 py-2 bg-gruvbox-bg text-gruvbox-fg font-bold rounded-lg inline-flex items-center gap-2 group-hover:shadow-lg"
            >
              {randomAd.cta}
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Shine effect */}
          <motion.div
            animate={{ x: [-100, 200] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        </motion.div>
      </Link>
    );
  }

  if (variant === 'square') {
    return (
      <Link to={randomAd.link}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className={`relative aspect-square bg-gradient-to-br ${randomAd.gradient} rounded-xl overflow-hidden cursor-pointer group`}
        >
          {/* Label */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-gruvbox-bg/80 backdrop-blur-sm rounded text-[10px] font-bold text-gruvbox-fg4 uppercase z-10">
            Ad
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Icon className="w-12 h-12 text-gruvbox-bg mb-3" />
            <h3 className="text-lg font-black text-gruvbox-bg mb-2">{randomAd.title}</h3>
            <p className="text-xs text-gruvbox-bg/80 mb-3">{randomAd.description}</p>
          </div>

          {/* Shine effect */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/20"
          />
        </motion.div>
      </Link>
    );
  }

  // Horizontal (default)
  return (
    <Link to={randomAd.link}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`relative bg-gradient-to-r ${randomAd.gradient} p-4 rounded-xl overflow-hidden cursor-pointer group flex items-center gap-4`}
      >
        {/* Label */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-gruvbox-bg/80 backdrop-blur-sm rounded text-[10px] font-bold text-gruvbox-fg4 uppercase">
          Patrocinado
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className="w-12 h-12 text-gruvbox-bg" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-gruvbox-bg">{randomAd.title}</h3>
          <p className="text-sm text-gruvbox-bg/80 truncate">{randomAd.description}</p>
        </div>

        {/* CTA */}
        <motion.div
          whileHover={{ x: 3 }}
          className="flex-shrink-0"
        >
          <div className="px-4 py-2 bg-gruvbox-bg text-gruvbox-fg font-bold rounded-lg text-sm">
            {randomAd.cta}
          </div>
        </motion.div>

        {/* Shine effect */}
        <motion.div
          animate={{ x: [-100, 200] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
      </motion.div>
    </Link>
  );
};
