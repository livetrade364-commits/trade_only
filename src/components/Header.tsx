import React, { useState } from 'react';
import { Search, Bell, Menu, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 lg:ml-[260px]">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600 lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-medium text-gray-400">
            /
          </div>
        </form>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-200 hidden lg:block"></div>

        {user ? (
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900 leading-none mb-1">
                {user.name || 'User'}
              </div>
              <div className="text-xs font-medium text-gray-500">
                {user.email}
              </div>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold text-sm lg:text-base">
                {getInitials(user.name || user.email)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900 leading-none mb-1">Guest</div>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-sm lg:text-base">
                G
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
