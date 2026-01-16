import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  PieChart, 
  Brain, 
  History, 
  Bookmark, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  Radar
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const [marketsOpen, setMarketsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center text-white">
            <Radar size={18} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Lozzby Tech</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive('/') 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        {/* Markets Submenu */}
        <div>
          <button
            onClick={() => setMarketsOpen(!marketsOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LineChart size={20} />
              Markets
            </div>
            {marketsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {marketsOpen && (
            <div className="ml-9 mt-1 space-y-1">
              <Link
                to="/market-overview"
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/market-overview')
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Market Overview
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/portfolio"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <PieChart size={20} />
            Portfolio
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </Link>

        <Link
          to="/analytics"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Brain size={20} />
            Analytics (AI)
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </Link>

        <div className="pt-4 pb-2">
          <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account
          </div>
        </div>

        <Link
          to="/history"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <History size={20} />
          Trade History
        </Link>

        <Link
          to="/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive('/profile') 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Bookmark size={20} />
          Watchlist
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
