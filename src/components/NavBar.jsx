import React from 'react';
import { Home } from 'lucide-react';

/**
 * NavBar renders the top navigation bar with Discord design theme.
 */
export default function NavBar({ activeTab, setActiveTab, setSelectedWork }) {
  const handleHome = () => {
    setActiveTab('home');
    setSelectedWork(null);
  };

  if (activeTab === 'home') return null;

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-[#0a0d3a]/85 border-b border-[#5865f2]/20 px-4 sm:px-6 py-3.5 flex items-center justify-between max-w-6xl mx-auto shadow-lg shadow-[#0a0d3a]/60">
      <div className="flex items-center space-x-3">
        <div className="w-3 h-3 rounded-full bg-[#5865f2] animate-pulse" />
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider uppercase font-['Plus_Jakarta_Sans']">
          YUYEON ARCHIVE
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleHome}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5865f2]/30 active:scale-95 transition-all duration-200"
          title="홈으로"
        >
          <Home size={16} />
          <span>HOME</span>
        </button>
      </div>
    </nav>
  );
}

