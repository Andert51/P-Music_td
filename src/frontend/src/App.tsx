import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Home } from '@/pages/Home';
import { Albums } from '@/pages/Albums';
import { AlbumDetail } from '@/pages/AlbumDetail';
import { UploadSong } from '@/pages/UploadSong';
import { LikedSongs } from '@/pages/LikedSongs';
import { Search } from '@/pages/Search';
import { Library } from '@/pages/Library';
import { PlaylistDetail } from '@/pages/PlaylistDetail';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#282828',
            color: '#fff',
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="albums" element={<Albums />} />
          <Route path="albums/:id" element={<AlbumDetail />} />
          <Route path="upload" element={<UploadSong />} />
          <Route path="search" element={<Search />} />
          <Route path="library" element={<Library />} />
          <Route path="playlists/:id" element={<PlaylistDetail />} />
          <Route path="liked" element={<LikedSongs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
