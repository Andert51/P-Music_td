import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { Player } from './Player';
import { NowPlayingPanel } from './NowPlayingPanel';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-deep-dark via-deep-navy to-deep-dark text-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />
        
        <main className="flex-1 overflow-y-auto px-8 py-6 pb-32">
          <Outlet />
        </main>
        
        <Player onOpenNowPlaying={() => {}} />
      </div>

      {/* Now Playing Panel - Always visible on the right */}
      <NowPlayingPanel 
        isOpen={true} 
        onClose={() => {}} 
      />
    </div>
  );
};
