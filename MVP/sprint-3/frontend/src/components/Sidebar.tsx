import { Home, Search, Heart, ListMusic, Music, Upload } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/', active: true },
    { icon: Search, label: 'Buscar', path: '/search', active: true },
    { icon: Heart, label: 'Favoritas', path: '/liked', active: true },
    { icon: ListMusic, label: 'Playlists', path: '/playlists', active: true },
    { icon: Music, label: 'Álbumes', path: '/albums', active: true },
    { icon: Upload, label: 'Subir', path: '/upload', active: true },
  ]

  const userStr = localStorage.getItem('sprint3_user')
  const user = userStr ? JSON.parse(userStr) : null
  const canUpload = user && (user.role === 'creator' || user.role === 'admin')

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-purple-500/20 p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              P-Music TD
            </h1>
            <p className="text-xs text-gray-500">Sprint 3 MVP</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          const isUploadRoute = item.path === '/upload'
          const isDisabled = isUploadRoute && !canUpload

          return (
            <Link
              key={item.path}
              to={isDisabled ? '#' : item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg' 
                  : isDisabled
                  ? 'text-gray-600 opacity-50 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }
              `}
              onClick={(e) => isDisabled && e.preventDefault()}
              title={isDisabled ? 'Solo creadores y admins' : ''}
            >
              <Icon className={`w-5 h-5 transition-transform ${!isActive && !isDisabled ? 'group-hover:scale-110' : ''}`} />
              <span>{item.label}</span>
              {isUploadRoute && !canUpload && (
                <span className="ml-auto text-xs px-2 py-0.5 bg-gray-700 rounded-full">(Creator)</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Info */}
      <div className="mt-4 px-3 py-4 border-t border-bg-light">
        <p className="text-xs text-fg-dark">
          MVP Sprint 1<br />
          Solo Autenticación funcional
        </p>
      </div>
    </aside>
  )
}
