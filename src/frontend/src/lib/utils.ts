/**
 * Convierte una URL relativa de archivo a una URL absoluta del backend
 */
export const getFileUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder-album.jpg';
  
  // Si ya es una URL completa (http/https), devolverla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Si es una ruta relativa que empieza con /uploads, agregar el dominio del backend
  if (path.startsWith('/uploads')) {
    return `http://127.0.0.1:8000${path}`;
  }
  
  // Por defecto, asumir que es una ruta del backend
  return `http://127.0.0.1:8000${path}`;
};

/**
 * Formatea duración en segundos a formato mm:ss
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formatea número de reproducciones
 */
export const formatPlayCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
