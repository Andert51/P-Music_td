import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AlbumDetail from './pages/AlbumDetail'
import Albums from './pages/Albums'
import Search from './pages/Search'
import LikedSongs from './pages/LikedSongs'
import Playlists from './pages/Playlists'
import Layout from './components/Layout'
import Player from './components/Player'
import NowPlayingPanel from './components/NowPlayingPanel'

function App() {
  const token = localStorage.getItem('sprint3_token')
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false)

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
        
        {/* Rutas protegidas */}
        <Route element={<Layout />}>
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/search" element={token ? <Search /> : <Navigate to="/login" />} />
          <Route path="/liked" element={token ? <LikedSongs /> : <Navigate to="/login" />} />
          <Route path="/playlists" element={token ? <Playlists /> : <Navigate to="/login" />} />
          <Route path="/albums" element={token ? <Albums /> : <Navigate to="/login" />} />
          <Route path="/albums/:id" element={token ? <AlbumDetail /> : <Navigate to="/login" />} />
          <Route path="/upload" element={token ? <div className="p-8 text-center text-white"><h1 className="text-3xl font-bold">Upload - Coming Soon</h1><p className="text-gray-400 mt-4">Esta página se completará próximamente</p></div> : <Navigate to="/login" />} />
        </Route>
      </Routes>
      
      {/* Player global - se muestra en todas las páginas cuando hay una canción */}
      {token && <Player />}
      
      {/* Now Playing Panel - panel lateral derecho */}
      {token && <NowPlayingPanel isOpen={nowPlayingOpen} onToggle={() => setNowPlayingOpen(!nowPlayingOpen)} />}
    </BrowserRouter>
  )
}

export default App
