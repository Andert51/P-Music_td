import { useNavigate } from 'react-router-dom'
import { Search, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Header() {
  const navigate = useNavigate()
  const userStr = localStorage.getItem('sprint1_user')
  const user = userStr ? JSON.parse(userStr) : null

  const handleLogout = () => {
    localStorage.removeItem('sprint1_token')
    localStorage.removeItem('sprint1_user')
    toast.success('Sesión cerrada')
    navigate('/login')
  }

  return (
    <header className="bg-bg border-b border-bg-light px-6 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-dark" />
          <input
            type="text"
            placeholder="Buscar (no funcional en Sprint 1)"
            disabled
            className="w-full pl-10 pr-4 py-2 rounded-full bg-bg-light text-fg border border-bg-light focus:border-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-bg-light rounded-full">
          <User className="w-5 h-5 text-primary" />
          <span className="text-fg font-medium">{user?.username || 'Usuario'}</span>
          <span className="text-xs text-fg-dark px-2 py-1 bg-bg-dark rounded-full">
            {user?.role || 'listener'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-bg-light transition text-fg-dark hover:text-accent-red"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
