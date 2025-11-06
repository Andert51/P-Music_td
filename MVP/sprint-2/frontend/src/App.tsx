import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AlbumDetail from './pages/AlbumDetail'
import Layout from './components/Layout'
import Player from './components/Player'

function App() {
  const token = localStorage.getItem('sprint2_token')

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
          <Route path="/albums/:id" element={token ? <AlbumDetail /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
      
      {/* Player global - se muestra en todas las páginas cuando hay una canción */}
      {token && <Player />}
    </BrowserRouter>
  )
}

export default App
