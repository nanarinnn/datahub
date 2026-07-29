import React from 'react';
import { Home } from 'lucide-react';

/**
 * NavBar renders the top navigation bar with only the Home button.
 */
export default function NavBar({ activeTab, setActiveTab, setSelectedWork }) {
  const handleHome = () => {
    setActiveTab('home');
    setSelectedWork(null);
  };

  if (activeTab === 'home') return null;

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-[#0e0e12]/80 border-b border-white/10 px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-white tracking-widest">
          YUYEON ARCHIVE
        </h1>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={handleHome}
          className="p-2 rounded-full transition-colors duration-200 text-gray-400 hover:bg-white/5 hover:text-white"
          title="홈으로"
        >
          <Home size={20} />
        </button>
      </div>
    </nav>
  );
}
