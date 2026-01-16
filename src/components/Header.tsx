import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Header: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 lg:hidden">
          <Menu size={24} />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="pl-10 pr-12 py-2.5 bg-gray-50 border-none rounded-xl text-sm w-[320px] focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
          />
          <div className="absolute right-3 px-1.5 py-0.5 bg-white rounded border border-gray-200 text-xs text-gray-400 font-medium">
            /
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-900">
              {user?.email?.split('@')[0] || 'UX Abdullah'}
            </div>
            <div className="text-xs text-gray-500 font-medium">Admin</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
             <img 
               src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=random`} 
               alt="User"
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
