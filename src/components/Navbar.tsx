import React, { useState } from 'react';
import { 
  Gamepad2, 
  Upload, 
  Search, 
  User, 
  LogOut, 
  Download, 
  Layers, 
  Sparkles,
  BookmarkCheck,
  ChevronDown,
  HardDrive
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenPublish: () => void;
  onLogout: () => void;
  activeTab: 'all' | 'my-games' | 'downloads';
  onTabChange: (tab: 'all' | 'my-games' | 'downloads') => void;
  userGamesCount: number;
  downloadsCount: number;
  onExportVault?: () => void;
  onImportVault?: (file: File) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onOpenPublish,
  onLogout,
  activeTab,
  onTabChange,
  userGamesCount,
  downloadsCount,
  onExportVault,
  onImportVault
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/20 to-blue-600/20 border border-cyan-500/30 shadow-md shadow-cyan-500/10">
              <Gamepad2 className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  GameVault
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/50 rounded-full">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Publish Links & Download Games Instantly
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search games by name, genre, or tag..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Publish Button & User Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Publish Game Button */}
            <button
              type="button"
              onClick={onOpenPublish}
              className="py-2.5 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Publish Game</span>
              <span className="sm:hidden">Publish</span>
            </button>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-colors"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 object-cover"
                />
                <span className="hidden lg:block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                  {user.gamerTag || user.username}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs backdrop-blur-xl"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white text-sm truncate">{user.gamerTag}</p>
                      {user.authProvider === 'google' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-950/60 text-red-300 border border-red-800/40">
                          Google
                        </span>
                      )}
                      {user.authProvider === 'github' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700">
                          GitHub
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] truncate mt-0.5">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('my-games');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-300"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        My Published Games
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300">
                        {userGamesCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTabChange('downloads');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-300"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-400" />
                        My Downloads
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-emerald-300">
                        {downloadsCount}
                      </span>
                    </button>
                  </div>

                  {/* Backup / Export / Import */}
                  <div className="border-t border-slate-800 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onExportVault) onExportVault();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 flex items-center gap-2 text-xs"
                    >
                      <HardDrive className="w-4 h-4 text-indigo-400" />
                      <span>Export Vault Backup (.json)</span>
                    </button>

                    <label className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-300 flex items-center gap-2 text-xs cursor-pointer">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Import Vault Backup</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && onImportVault) {
                            onImportVault(file);
                            setShowUserMenu(false);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="border-t border-slate-800 pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search games, categories..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar border-t border-slate-800/60">
          <button
            type="button"
            onClick={() => onTabChange('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>All Games</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('my-games')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'my-games'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>My Published Games ({userGamesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('downloads')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'downloads'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>My Downloads ({downloadsCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
