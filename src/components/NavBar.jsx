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
    <nav className="w-full sticky top-0 z-50 backdrop-blur-xl bg-[#0a0d3a]/85 border-b border-[#5865f2]/20 px-3 sm:px-6 py-3 flex items-center justify-between max-w-6xl mx-auto shadow-lg shadow-[#0a0d3a]/60">
      <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={handleHome}>
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#5865f2] animate-pulse shrink-0" />
        <h1 className="text-base sm:text-2xl font-extrabold text-white tracking-wider uppercase font-['Plus_Jakarta_Sans'] truncate">
          YUYEON ARCHIVE
        </h1>
      </div>
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        <button
          onClick={() => {
            setActiveTab('devnotes');
            setSelectedWork(null);
          }}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-extrabold whitespace-nowrap shrink-0 transition-all duration-200 ${
            activeTab === 'devnotes'
              ? 'bg-[#35ed7e] text-black shadow-md shadow-[#35ed7e]/30'
              : 'bg-[#1e2353] text-[#35ed7e] border border-[#35ed7e]/40 hover:bg-[#35ed7e]/20'
          }`}
        >
          <span className="whitespace-nowrap">개발자 노트</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#35ed7e] text-black text-[9px] sm:text-[10px] font-black animate-pulse shrink-0">NEW</span>
        </button>
        <button
          onClick={handleHome}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white text-[11px] sm:text-sm font-bold whitespace-nowrap shrink-0 shadow-md shadow-[#5865f2]/30 active:scale-95 transition-all duration-200"
          title="홈으로"
        >
          <Home size={14} className="shrink-0" />
          <span className="whitespace-nowrap">HOME</span>
        </button>
      </div>
    </nav>
  );
}

