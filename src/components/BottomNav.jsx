import React from 'react';
import { BookOpen, Bookmark, Package, Plus, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

export default function BottomNav({ 
  activeTab, 
  setActiveTab, 
  onOpenSellModal, 
  totalBooksCount, 
  myBooksCount 
}) {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        
        {/* 1. Explore Books Tab */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('explore');
          }}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'explore' ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'
          }`}
        >
          <div className="relative">
            <BookOpen className={`w-5 h-5 transition-transform ${activeTab === 'explore' ? 'scale-110 text-emerald-800' : ''}`} />
            {totalBooksCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-[#D4EBD8] text-[#14331a] border border-[#b8dfbe]">
                {totalBooksCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Books</span>
          {activeTab === 'explore' && (
            <span className="w-4 h-1 bg-[#14331a] rounded-full mt-0.5" />
          )}
        </button>

        {/* 2. Wishlist Tab */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('requests');
          }}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'requests' ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'
          }`}
        >
          <Bookmark className={`w-5 h-5 transition-transform ${activeTab === 'requests' ? 'scale-110 text-emerald-800' : ''}`} />
          <span className="text-[10px] tracking-tight mt-1">Wishlist</span>
          {activeTab === 'requests' && (
            <span className="w-4 h-1 bg-[#14331a] rounded-full mt-0.5" />
          )}
        </button>

        {/* 3. Primary Action: Post / Sell Book (Elevated Floating Button) */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenSellModal();
            }}
            className="w-13 h-13 rounded-2xl bg-[#D4EBD8] border-2 border-white text-[#14331a] shadow-lg shadow-emerald-950/15 flex flex-col items-center justify-center active:scale-95 transition-all"
            title="List a Book"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 4. My Books Dashboard Tab */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setActiveTab('my-listings');
          }}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'my-listings' ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'
          }`}
        >
          <div className="relative">
            <Package className={`w-5 h-5 transition-transform ${activeTab === 'my-listings' ? 'scale-110 text-emerald-800' : ''}`} />
            {myBooksCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-[#D4EBD8] text-[#14331a] border border-[#b8dfbe]">
                {myBooksCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">My Books</span>
          {activeTab === 'my-listings' && (
            <span className="w-4 h-1 bg-[#14331a] rounded-full mt-0.5" />
          )}
        </button>

      </div>
    </nav>
  );
}
