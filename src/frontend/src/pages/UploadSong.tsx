import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, Image, AlertCircle, CheckCircle, X } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export const UploadSong: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState<'select' | 'metadata' | 'complete'>('select');
  
  // Files
  const [songFile, setSongFile] = useState<File | null>(null);
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

  const handleSongFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleUpload = async () => {
    if (!songFile) {
      toast.error('Selecciona un archivo MP3');
      return;
    }

    if (!title || !artist) {
      toast.error('Completa el título y artista');
      return;
    }

    if (uploadType === 'album' && !albumId && !newAlbumTitle) {
      toast.error('Proporciona un título de álbum o selecciona uno existente');
      return;
    }

    setUploading(true);

    try {
      let finalAlbumId = albumId ? parseInt(albumId) : null;

      // Si es tipo álbum y no tiene ID existente, crear nuevo álbum
      if (uploadType === 'album' && !albumId && newAlbumTitle) {
        const releaseDate = new Date(parseInt(releaseYear), 0, 1); // Jan 1 del año
        const albumResponse = await api.post('/albums/', {
          title: newAlbumTitle,
          description: `Álbum de ${artist}`,
          release_date: releaseDate.toISOString(),
        });
        finalAlbumId = albumResponse.data.id;
        toast.success(`Álbum "${newAlbumTitle}" creado`);
      }

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

        coverUrl = coverResponse.data.path; // ✅ Usar 'path' no 'url'

        // Si creamos un nuevo álbum y hay cover, actualizar el álbum con el cover
        if (finalAlbumId && uploadType === 'album' && !albumId) {
          await api.put(`/albums/${finalAlbumId}`, {
            cover_url: coverUrl,  // El backend acepta cover_url como alias de cover_image
          });
        }
      }

      // 3. Crear la canción en la base de datos
      await api.post('/songs/', {
        title,
        artist,
        genre: genre || null,
        album_id: uploadType === 'single' ? null : finalAlbumId,
        file_path: songResponse.data.path, // ✅ Usar 'path' no 'url'
        cover_url: coverUrl,
        duration: 180, // Por defecto, se puede calcular con librería en frontend
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

      {/* Step Indicator */}
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

      {/* File Upload Section */}
      {step === 'select' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Song File */}
          <div className="bg-dark-200 rounded-xl p-8 border-2 border-dashed border-dark-400 hover:border-primary transition">
            <input
              type="file"
              accept=".mp3"
              onChange={handleSongFileChange}
              className="hidden"
              id="song-upload"
            />
            <label htmlFor="song-upload" className="cursor-pointer block">
              <div className="text-center space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                {songFile ? (
                  <>
                    <div className="flex items-center justify-center space-x-3">
                      <Music className="w-6 h-6 text-primary" />
                      <span className="text-white font-medium">{songFile.name}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {(songFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-white">
                      Arrastra tu archivo MP3 aquí
                    </h3>
                    <p className="text-gray-400">o haz click para seleccionar</p>
                    <p className="text-sm text-gray-500">Máximo 20MB</p>
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
                    Cover Image (Opcional)
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {coverFile ? coverFile.name : 'Selecciona una imagen'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Recomendado: 1000x1000px, máx. 5MB
                  </p>
                </div>
              </div>
            </label>
          </div>

          <button
            onClick={() => setStep('metadata')}
            disabled={!songFile}
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
              Género
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="input w-full"
              placeholder="Ej: Alternative Rock"
            />
          </div>

          {/* Upload Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tipo de lanzamiento *
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUploadType('single')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  uploadType === 'single'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Music className="w-5 h-5 mx-auto mb-1" />
                <span className="font-medium">Sencillo</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadType('album')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  uploadType === 'album'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Music className="w-5 h-5 mx-auto mb-1" />
                <span className="font-medium">Álbum</span>
              </button>
            </div>
          </div>

          {/* Album Fields (only if album type) */}
          {uploadType === 'album' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
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
                  O selecciona un álbum existente
                </label>
                <input
                  type="number"
                  value={albumId}
                  onChange={(e) => setAlbumId(e.target.value)}
                  className="input w-full"
                  placeholder="ID del álbum existente (opcional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si proporcionas un ID de álbum existente, se ignorará el nuevo álbum
                </p>
              </div>
            </motion.div>
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
              disabled={uploading || !title || !artist || (uploadType === 'album' && !albumId && !newAlbumTitle)}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Subiendo...' : 'Subir Canción'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
