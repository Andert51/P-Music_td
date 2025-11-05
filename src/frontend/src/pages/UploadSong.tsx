import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, Image, AlertCircle, CheckCircle, X, Disc3 } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export const UploadSong: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<'type' | 'select' | 'metadata' | 'complete'>('type');
  
  // Files
  const [songFile, setSongFile] = useState<File | null>(null);
  const [singleDuration, setSingleDuration] = useState<number>(180); // Duración del single
  const [songFiles, setSongFiles] = useState<File[]>([]); // Para álbumes
  const [songDurations, setSongDurations] = useState<number[]>([]); // Duraciones en segundos
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [songPreview, setSongPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');
  
  // Metadata
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [uploadType, setUploadType] = useState<'single' | 'album'>('single');
  const [albumId, setAlbumId] = useState<string>('');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState<string>(new Date().getFullYear().toString());

  // Verificar permisos
  if (!user || (user.role !== 'creator' && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Acceso Denegado</h2>
          <p className="text-gray-400">Solo creators y admins pueden subir canciones</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Función para calcular duración de un archivo de audio
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'metadata';
      
      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(audio.duration);
      };
      
      audio.onerror = () => {
        window.URL.revokeObjectURL(audio.src);
        reject(new Error('Error al cargar audio'));
      };
      
      audio.src = window.URL.createObjectURL(file);
    });
  };

  const handleSongFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.mp3')) {
        toast.error('Solo se permiten archivos MP3');
        return;
      }
      if (file.size > 20 * 1024 * 1024) { // 20MB
        toast.error('El archivo es muy grande (máx. 20MB)');
        return;
      }
      setSongFile(file);
      setSongPreview(URL.createObjectURL(file));
      
      // Extraer metadata básica del nombre del archivo
      const fileName = file.name.replace('.mp3', '');
      if (!title) setTitle(fileName);
      
      // Calcular duración del archivo
      toast.success('Calculando duración...');
      try {
        const duration = await getAudioDuration(file);
        setSingleDuration(Math.floor(duration));
        toast.success(`Duración: ${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`);
      } catch (error) {
        console.error('Error al calcular duración:', error);
        setSingleDuration(180);
        toast.error('No se pudo calcular la duración, usando 3:00 por defecto');
      }
    }
  };

  const handleMultipleSongsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.name.endsWith('.mp3')) {
          toast.error(`${file.name} no es un archivo MP3 válido`);
          continue;
        }
        if (file.size > 20 * 1024 * 1024) {
          toast.error(`${file.name} es muy grande (máx. 20MB)`);
          continue;
        }
        validFiles.push(file);
      }
      setSongFiles(validFiles);
      
      // Calcular duraciones de las canciones
      if (validFiles.length > 0) {
        toast.success(`${validFiles.length} canciones seleccionadas, calculando duraciones...`);
        
        const durations: number[] = [];
        for (const file of validFiles) {
          try {
            const duration = await getAudioDuration(file);
            durations.push(Math.floor(duration)); // Redondear a segundos enteros
          } catch (error) {
            console.error('Error al calcular duración:', error);
            durations.push(180); // Fallback a 3 minutos
          }
        }
        setSongDurations(durations);
        toast.success(`Duraciones calculadas correctamente`);
      }
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('La imagen es muy grande (máx. 5MB)');
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAlbum = async () => {
    if (!coverFile) {
      toast.error('Selecciona una portada para el álbum');
      return;
    }

    if (songFiles.length === 0) {
      toast.error('Selecciona al menos una canción');
      return;
    }

    if (!newAlbumTitle || !artist) {
      toast.error('Completa el título del álbum y artista');
      return;
    }

    setUploading(true);

    try {
      // Crear FormData para el álbum completo
      const formData = new FormData();
      formData.append('album_title', newAlbumTitle);
      formData.append('album_cover', coverFile);
      formData.append('release_year', releaseYear);
      
      // Agregar todas las canciones
      songFiles.forEach((file) => {
        formData.append('songs', file);
      });

      // Agregar metadata de cada canción (arrays paralelos)
      songFiles.forEach((file, index) => {
        const fileName = file.name.replace('.mp3', '');
        formData.append('song_titles', fileName);
        formData.append('song_artists', artist);
        // Usar la duración calculada o 180 por defecto
        const duration = songDurations[index] || 180;
        formData.append('song_durations', duration.toString());
        formData.append('song_genres', genre || 'Sin género');
      });

      const response = await api.post('/upload/album', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStep('complete');
      toast.success(`¡Álbum "${newAlbumTitle}" subido con ${songFiles.length} canciones!`);
      
      // Limpiar formulario
      setSongFiles([]);
      setCoverFile(null);
      setCoverPreview('');
      setNewAlbumTitle('');
      setArtist('');
      setGenre('');
      setReleaseYear(new Date().getFullYear().toString());

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.detail || 'Error al subir el álbum');
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    // Si es álbum, usar la función específica
    if (uploadType === 'album') {
      return handleUploadAlbum();
    }

    // Lógica para sencillo
    if (!songFile) {
      toast.error('Selecciona un archivo MP3');
      return;
    }

    if (!title || !artist) {
      toast.error('Completa el título y artista');
      return;
    }

    setUploading(true);

    try {
      // 1. Subir el archivo MP3
      const songFormData = new FormData();
      songFormData.append('file', songFile);

      const songResponse = await api.post('/upload/song', songFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      let coverUrl = null;

      // 2. Subir cover si existe
      if (coverFile) {
        const coverFormData = new FormData();
        coverFormData.append('file', coverFile);

        const coverResponse = await api.post('/upload/cover', coverFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        coverUrl = coverResponse.data.path;
      }

      // 3. Crear la canción en la base de datos (sencillo sin álbum)
      await api.post('/songs/', {
        title,
        artist,
        genre: genre || null,
        album_id: null,
        file_path: songResponse.data.path,
        cover_url: coverUrl,
        duration: singleDuration,
      });

      setStep('complete');
      toast.success('¡Canción subida exitosamente!');

    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.detail || 'Error al subir la canción');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSongFile(null);
    setCoverFile(null);
    setSongPreview('');
    setCoverPreview('');
    setTitle('');
    setArtist('');
    setGenre('');
    setUploadType('single');
    setAlbumId('');
    setNewAlbumTitle('');
    setReleaseYear(new Date().getFullYear().toString());
    setStep('select');
  };

  if (step === 'complete') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-24 h-24 text-primary mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">¡Canción Subida!</h2>
          <p className="text-gray-400">
            Tu canción "{title}" ha sido subida exitosamente y está pendiente de aprobación.
          </p>
          <div className="flex space-x-4 justify-center">
            <button onClick={resetForm} className="btn-primary">
              Subir otra canción
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              Ir al inicio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-5xl font-bold text-white mb-2">Upload Music</h1>
        <p className="text-gray-400 text-lg">Comparte tu música con el mundo</p>
      </motion.div>

      {/* Type Selection Screen */}
      {step === 'type' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8 py-12"
        >
          {/* Single Option */}
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setUploadType('single');
              setStep('select');
            }}
            className="relative group bg-gradient-to-br from-gruvbox-bg1 to-gruvbox-bg2 rounded-3xl p-12 border-2 border-gruvbox-aqua/30 cursor-pointer overflow-hidden transition-all hover:border-gruvbox-aqua/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-aqua/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 right-4 w-32 h-32 bg-gruvbox-aqua/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <Music className="w-20 h-20 text-gruvbox-aqua mb-6 relative z-10 group-hover:scale-125 transition-all duration-300" strokeWidth={2} />
            <h3 className="text-3xl font-bold mb-4 relative z-10 text-gruvbox-fg">Sencillo</h3>
            <p className="text-gruvbox-fg4 relative z-10 text-lg leading-relaxed">
              Sube una canción individual con su portada. Perfecto para singles y tracks independientes.
            </p>
            
            <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Music className="w-32 h-32 text-gruvbox-aqua" />
            </div>
          </motion.div>

          {/* Album Option */}
          <motion.div
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setUploadType('album');
              setStep('select');
            }}
            className="relative group bg-gradient-to-br from-gruvbox-bg1 to-gruvbox-bg2 rounded-3xl p-12 border-2 border-gruvbox-purple/30 cursor-pointer overflow-hidden transition-all hover:border-gruvbox-purple/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-4 right-4 w-32 h-32 bg-gruvbox-purple/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <Disc3 className="w-20 h-20 text-gruvbox-purple mb-6 relative z-10 group-hover:scale-125 group-hover:rotate-180 transition-all duration-500" strokeWidth={2} />
            <h3 className="text-3xl font-bold mb-4 relative z-10 text-gruvbox-fg">Álbum</h3>
            <p className="text-gruvbox-fg4 relative z-10 text-lg leading-relaxed">
              Sube un álbum completo con múltiples canciones y una portada compartida.
            </p>
            
            <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Disc3 className="w-32 h-32 text-gruvbox-purple" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Step Indicator */}
      {step !== 'type' && (
        <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center space-x-2 ${step === 'select' ? 'text-primary' : 'text-gray-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'select' ? 'bg-primary' : 'bg-gray-700'}`}>
            1
          </div>
          <span className="font-medium">Archivos</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-700"></div>
        <div className={`flex items-center space-x-2 ${step === 'metadata' ? 'text-primary' : 'text-gray-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'metadata' ? 'bg-primary' : 'bg-gray-700'}`}>
            2
          </div>
          <span className="font-medium">Metadata</span>
        </div>
        </div>
      )}

      {/* File Upload Section */}
      {step === 'select' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Song File(s) */}
          <div className="bg-dark-200 rounded-xl p-8 border-2 border-dashed border-dark-400 hover:border-primary transition">
            <input
              type="file"
              accept=".mp3"
              multiple={uploadType === 'album'}
              onChange={uploadType === 'album' ? handleMultipleSongsChange : handleSongFileChange}
              className="hidden"
              id="song-upload"
            />
            <label htmlFor="song-upload" className="cursor-pointer block">
              <div className="text-center space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                {uploadType === 'single' && songFile ? (
                  <>
                    <div className="flex items-center justify-center space-x-3">
                      <Music className="w-6 h-6 text-primary" />
                      <span className="text-white font-medium">{songFile.name}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {(songFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : uploadType === 'album' && songFiles.length > 0 ? (
                  <>
                    <div className="flex items-center justify-center space-x-3">
                      <Disc3 className="w-6 h-6 text-primary" />
                      <span className="text-white font-medium">{songFiles.length} canciones seleccionadas</span>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2 mt-4">
                      {songFiles.map((file, index) => (
                        <div key={index} className="text-sm text-gray-400 flex items-center justify-between px-4">
                          <span className="truncate">{file.name}</span>
                          <span className="ml-2">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-white">
                      {uploadType === 'album' ? 'Arrastra tus archivos MP3 aquí' : 'Arrastra tu archivo MP3 aquí'}
                    </h3>
                    <p className="text-gray-400">o haz click para seleccionar</p>
                    <p className="text-sm text-gray-500">
                      {uploadType === 'album' ? 'Selecciona múltiples canciones' : 'Máximo 20MB por archivo'}
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Cover Image */}
          <div className="bg-dark-200 rounded-xl p-8">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverFileChange}
              className="hidden"
              id="cover-upload"
            />
            <label htmlFor="cover-upload" className="cursor-pointer block">
              <div className="flex items-center space-x-6">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-dark-400 flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {uploadType === 'album' ? 'Cover del Álbum *' : 'Cover Image (Opcional)'}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {coverFile ? coverFile.name : 'Selecciona una imagen'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Recomendado: 1000x1000px, máx. 5MB
                  </p>
                  {uploadType === 'album' && !coverFile && (
                    <p className="text-xs text-gruvbox-orange mt-1">* Requerido para álbumes</p>
                  )}
                </div>
              </div>
            </label>
          </div>

          <button
            onClick={() => setStep('metadata')}
            disabled={
              uploadType === 'single' ? !songFile : 
              uploadType === 'album' ? (songFiles.length === 0 || !coverFile) : 
              true
            }
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar →
          </button>
        </motion.div>
      )}

      {/* Metadata Section */}
      {step === 'metadata' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-dark-200 rounded-xl p-8 space-y-6"
        >
          {/* Campos condicionales según tipo de subida */}
          {uploadType === 'album' ? (
            // Campos para Álbum
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título del álbum *
                </label>
                <input
                  type="text"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  className="input w-full"
                  placeholder="Ej: OK Computer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artista *
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="input w-full"
                  placeholder="Ej: Radiohead"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Año de lanzamiento *
                </label>
                <input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="input w-full"
                  placeholder="Ej: 1997"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Género (opcional)
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="input w-full"
                  placeholder="Ej: Alternative Rock"
                />
              </div>

              <div className="bg-gruvbox-bg0/50 border border-gruvbox-aqua/30 rounded-lg p-4">
                <p className="text-sm text-gruvbox-fg4">
                  📀 <span className="text-gruvbox-aqua font-medium">{songFiles.length} canciones</span> serán subidas en este álbum
                </p>
              </div>
            </>
          ) : (
            // Campos para Sencillo
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título de la canción *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full"
                  placeholder="Ej: Paranoid Android"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artista *
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="input w-full"
                  placeholder="Ej: Radiohead"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Género (opcional)
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="input w-full"
                  placeholder="Ej: Alternative Rock"
                />
              </div>
            </>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => setStep('select')}
              className="btn-secondary flex-1"
              disabled={uploading}
            >
              ← Volver
            </button>
            <button
              onClick={handleUpload}
              disabled={
                uploading || 
                !artist || 
                (uploadType === 'single' && !title) ||
                (uploadType === 'album' && (!newAlbumTitle || !releaseYear || songFiles.length === 0))
              }
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Subiendo...' : uploadType === 'album' ? 'Subir Álbum' : 'Subir Canción'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
