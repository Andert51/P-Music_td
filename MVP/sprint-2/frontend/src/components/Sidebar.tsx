import { Home, Music, Heart, Library, Upload } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/', active: true },
    { icon: Music, label: 'Álbumes', path: '/albums', active: false },
    { icon: Heart, label: 'Favoritas', path: '/liked', active: false },
    { icon: Library, label: 'Biblioteca', path: '/library', active: false },
    { icon: Upload, label: 'Subir', path: '/upload', active: false },
  ]

  return (
    <aside className="w-64 bg-bg border-r border-bg-light p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 px-3">
        <div className="flex items-center gap-3">
          <Music className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-fg-light">P-Music TD</h1>
            <p className="text-xs text-fg-dark">Sprint 1 MVP</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          const isDisabled = !item.active

          return (
            <Link
              key={item.path}
              to={isDisabled ? '#' : item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${isActive 
                  ? 'bg-primary text-bg-dark font-bold' 
                  : isDisabled
                  ? 'text-fg-dark opacity-40 cursor-not-allowed'
                  : 'text-fg hover:bg-bg-light hover:text-primary'
                }
              `}
              onClick={(e) => isDisabled && e.preventDefault()}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isDisabled && (
                <span className="ml-auto text-xs">(Sprint 2+)</span>
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
