import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Player } from './Player';
import { NowPlayingPanel } from './NowPlayingPanel';

export const Layout: React.FC = () => {
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-100 text-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto px-8 py-6 pb-32">
          <Outlet />
        </main>
        
        <Player onOpenNowPlaying={() => setIsNowPlayingOpen(true)} />
      </div>

      <NowPlayingPanel 
        isOpen={isNowPlayingOpen} 
        onClose={() => setIsNowPlayingOpen(false)} 
      />
    </div>
  );
};
