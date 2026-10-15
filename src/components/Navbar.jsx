import React, { useState } from 'react';
import { BookOpen, Plus, Search, ShieldCheck, User, LogOut, X, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  onOpenSellModal,
  totalBooksCount,
  myBooksCount = 0,
  currentUser,
  onLogout
}) {
  const [muted, setMuted] = useState(sound.isMuted());

  const handleToggleSound = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sound.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Campus Tag */}
          <div 
            onClick={() => {
              sound.playClick();
              setActiveTab('explore');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 px-3 py-1.5 rounded-xl bg-[#D4EBD8] border border-[#b8dfbe] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <img src="/logo-dark.png" alt="HMX Logo" className="h-5 w-auto object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#D4EBD8]/40 text-emerald-900 border border-[#b8dfbe]">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> Campus Direct
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">Fair-Priced Senior-to-Junior Exchange</p>
            </div>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject, book title, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-slate-50/80 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setSearchTerm('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Controls & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Feedback Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border transition-all ${
                !muted
                  ? 'bg-[#D4EBD8] border-[#b8dfbe] text-slate-900 hover:bg-[#c3e4c8]'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={muted ? 'Unmute Click Sounds' : 'Mute Click Sounds'}
            >
              {!muted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Desktop Tab switchers (Hidden on Mobile) */}
            <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('explore');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'explore'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Books ({totalBooksCount})
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('requests');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'requests'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Wishlist
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('my-listings');
                }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'my-listings'
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>My Books</span>
                {myBooksCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#D4EBD8] text-[#14331a] border border-[#b8dfbe]">
                    {myBooksCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile */}
            {currentUser && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="btn-glass px-2 sm:px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">{currentUser.semester} • {currentUser.branchName}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onLogout();
                  }}
                  className="btn-glass p-2 rounded-xl text-slate-400 hover:text-rose-600"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Desktop Sell Button (Hidden on Mobile, handled by BottomNav) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenSellModal();
              }}
              className="hidden md:flex btn-emerald items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List a Book</span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subject, book title, or branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  sound.playClick();
                  setSearchTerm('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
