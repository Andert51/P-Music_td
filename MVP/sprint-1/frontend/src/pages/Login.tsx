import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, Music } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formBody = new FormData()
      formBody.append('username', formData.email) // OAuth2 usa 'username' pero enviamos email
      formBody.append('password', formData.password)

      const { data } = await api.post('/auth/login', formBody, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      localStorage.setItem('sprint1_token', data.access_token)
      
      // Obtener info del usuario
      const userResponse = await api.get('/auth/me')
      localStorage.setItem('sprint1_user', JSON.stringify(userResponse.data))

      toast.success('¡Bienvenido de vuelta!')
      
      // Usar window.location para forzar recarga completa
      setTimeout(() => {
        window.location.href = '/'
      }, 500)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Music className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold text-fg-light">P-Music TD</h1>
          </div>
          <p className="text-fg-dark">Sprint 1 MVP - Sistema de Autenticación</p>
        </div>

        {/* Formulario */}
        <div className="bg-bg p-8 rounded-lg shadow-xl border border-bg-light">
          <h2 className="text-2xl font-bold mb-6 text-center text-fg">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-fg-dark">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded bg-bg-light border border-bg-light focus:border-primary focus:outline-none text-fg"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-fg-dark">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded bg-bg-light border border-bg-light focus:border-primary focus:outline-none text-fg"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-bg-dark font-bold rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Iniciando...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-fg-dark">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-fg-dark">
          <p>Sprint 1: Autenticación JWT + UI Completa</p>
        </div>
      </div>
    </div>
  )
}
