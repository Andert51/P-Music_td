import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Player from './Player'

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-bg-dark">
      {/* Header */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Player (visual only en Sprint 1) */}
      <Player />
    </div>
  )
}
