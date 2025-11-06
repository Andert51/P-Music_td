import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - Con padding derecho para el NowPlayingPanel (oculto en móvil) */}
        <main className="flex-1 overflow-y-auto p-6 lg:pr-[336px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
