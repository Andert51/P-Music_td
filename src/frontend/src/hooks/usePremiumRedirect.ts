import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

/**
 * Hook para redirigir aleatoriamente a usuarios Free a la página de Premium
 * cuando hacen click en elementos de la página
 */
export const usePremiumRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    // Solo afecta a usuarios Free
    if (!user || user.role !== 'user') return;

    const handleClick = (e: MouseEvent) => {
      // 25% de probabilidad de redirección
      const shouldRedirect = Math.random() < 0.25;
      
      if (shouldRedirect) {
        // Excluir ciertos elementos críticos
        const target = e.target as HTMLElement;
        const isPlayerControl = target.closest('[data-player-control]');
        const isPremiumButton = target.closest('a[href="/premium"]');
        const isLogout = target.closest('[data-logout]');
        
        // No redirigir si es un control crítico
        if (isPlayerControl || isPremiumButton || isLogout) return;

        e.preventDefault();
        e.stopPropagation();
        
        toast('¡Actualiza a Premium para una experiencia sin interrupciones!', {
          icon: '👑',
          duration: 3000,
          style: {
            background: '#fabd2f',
            color: '#282828',
            fontWeight: 'bold',
          },
        });

        setTimeout(() => {
          navigate('/premium');
        }, 500);
      }
    };

    // Agregar listener con capture para interceptar clicks antes
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [user, navigate]);
};
