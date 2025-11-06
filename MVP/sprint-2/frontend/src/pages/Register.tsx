import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Music } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })

      toast.success('¡Registro exitoso! Ahora inicia sesión')
      navigate('/login')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error al registrarse')
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
          <p className="text-fg-dark">Crea tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-bg p-8 rounded-lg shadow-xl border border-bg-light">
          <h2 className="text-2xl font-bold mb-6 text-center text-fg">Registro</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-fg-dark">
                Usuario
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 rounded bg-bg-light border border-bg-light focus:border-primary focus:outline-none text-fg"
                placeholder="tu_usuario"
              />
            </div>

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
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded bg-bg-light border border-bg-light focus:border-primary focus:outline-none text-fg"
              >
                <option value="user">Usuario</option>
                <option value="creator">Creador</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-fg-dark">
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded bg-bg-light border border-bg-light focus:border-primary focus:outline-none text-fg"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-fg-dark">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                <span>Registrando...</span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-fg-dark">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
