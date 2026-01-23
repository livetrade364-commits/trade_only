import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  PieChart, 
  Bookmark, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const [marketsOpen, setMarketsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-100 flex flex-col
      transform transition-transform duration-300 ease-in-out lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo */}
      <div className="h-16 lg:h-20 flex items-center justify-between px-6 border-b border-gray-50">
        <Link to="/" className="flex items-center justify-center w-full" onClick={handleLinkClick}>
          <img 
            src="/tradex-logo.png" 
            alt="Tradex" 
            className="h-14 w-auto object-contain" 
          />
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 absolute right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <Link
          to="/"
          onClick={handleLinkClick}
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
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/market-overview')
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Market Overview
              </Link>
              <Link
                to="/indian-market"
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/indian-market')
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Indian Market
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/portfolio"
          onClick={handleLinkClick}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <PieChart size={20} />
            Portfolio
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </Link>

        <div className="pt-4 pb-2">
          <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account
          </div>
        </div>

        <Link
          to="/watchlist"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive('/watchlist') 
              ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Bookmark size={20} />
          Watchlist
        </Link>

        <Link
          to="/settings"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="px-3 pb-3 text-xs font-semibold text-gray-400 text-center">
          Tradex by 2Ce Capitals
        </div>
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
