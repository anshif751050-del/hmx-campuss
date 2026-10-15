import React, { useState, useMemo } from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Plus, 
  Sparkles, 
  Gift, 
  Share2, 
  TrendingUp, 
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function MyListingsDashboard({ 
  books, 
  currentUser, 
  onUpdateBookStatus, 
  onDeleteBook, 
  onOpenSellModal 
}) {
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'reserved', 'sold'

  // Match books listed by current student
  const myBooks = useMemo(() => {
    if (!currentUser) return [];
    const cleanUserPhone = (currentUser.phone || '').replace(/\D/g, '');
    return books.filter((b) => {
      const cleanBookPhone = (b.sellerPhone || '').replace(/\D/g, '');
      return (cleanUserPhone && cleanBookPhone === cleanUserPhone) || 
             (b.sellerName && b.sellerName.toLowerCase() === currentUser.name.toLowerCase());
    });
  }, [books, currentUser]);

  // Statistics
  const stats = useMemo(() => {
    let active = 0;
    let reserved = 0;
    let sold = 0;
    let totalSavingsPassed = 0;
    let totalDonations = 0;

    myBooks.forEach((b) => {
      const status = b.status || 'available';
      if (status === 'available') active++;
      else if (status === 'reserved') reserved++;
      else if (status === 'sold') sold++;

      if (b.isDonation || b.price === 0) totalDonations++;
      
      const saving = (b.originalPrice || 0) - (b.price || 0);
      if (saving > 0) totalSavingsPassed += saving;
    });

    return { active, reserved, sold, totalSavingsPassed, totalDonations, total: myBooks.length };
  }, [myBooks]);

  const filteredList = useMemo(() => {
    if (filter === 'all') return myBooks;
    return myBooks.filter((b) => (b.status || 'available') === filter);
  }, [myBooks, filter]);

  const handleMarkStatus = (bookId, newStatus) => {
    sound.playClick();
    if (newStatus === 'sold') {
      sound.playSuccess();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    onUpdateBookStatus(bookId, newStatus);
  };

  const handleDelete = (bookId, title) => {
    sound.playClick();
    if (window.confirm(`Are you sure you want to remove "${title}" from your listings?`)) {
      onDeleteBook(bookId);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4EBD8] border border-[#b8dfbe] text-[#14331a] text-xs font-bold">
            <Package className="w-3.5 h-3.5" />
            <span>Seller Desk & Inventory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Books & Status Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your listings, mark deals as reserved when juniors contact you, and confirm handoffs.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenSellModal();
          }}
          className="btn-emerald px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>List Another Book</span>
        </button>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1 */}
        <div className="card-porcelain p-4 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Active in Market
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.active}</span>
            <span className="text-xs text-emerald-600 font-bold">Listed</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card-porcelain p-4 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Deals Pending
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{stats.reserved}</span>
            <span className="text-xs text-amber-600 font-bold">On Hold</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card-porcelain p-4 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Handed Down / Sold
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.sold}</span>
            <span className="text-xs text-slate-500 font-medium">Completed</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card-porcelain p-4 rounded-2xl space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Junior Savings Passed
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#14331a]">₹{stats.totalSavingsPassed}</span>
            {stats.totalDonations > 0 && (
              <span className="text-[11px] text-purple-700 font-bold">({stats.totalDonations} free gifts)</span>
            )}
          </div>
        </div>

      </div>

      {/* 3. Filter Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: 'all', label: `All Listings (${myBooks.length})` },
          { id: 'available', label: `Active (${stats.active})` },
          { id: 'reserved', label: `Deals Pending (${stats.reserved})` },
          { id: 'sold', label: `Handed Down / Sold (${stats.sold})` },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilter(tab.id);
              }}
              className={`btn-glass px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive ? 'btn-glass-active' : ''
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Book Listings Feed */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((book) => {
            const status = book.status || 'available';
            const isFree = book.isDonation || book.price === 0;

            return (
              <div 
                key={book.id}
                className="card-porcelain rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {book.branchName} • {book.semester}
                      </span>
                      
                      {isFree ? (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Gift className="w-3 h-3 text-purple-600" />
                          <span>FREE DONATION</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {book.discountPercent}% OFF
                        </span>
                      )}

                      {/* Status Tag */}
                      {status === 'available' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#D4EBD8] text-[#14331a] border border-[#b8dfbe] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Active / Live</span>
                        </span>
                      )}
                      {status === 'reserved' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Deal Pending</span>
                        </span>
                      )}
                      {status === 'sold' && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-slate-500" />
                          <span>Handed Down / Sold</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug pt-1">
                      {book.title}
                    </h3>
                  </div>

                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="btn-glass p-2 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details Breakdown */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Selling Price:</span>
                    <span className="font-black text-slate-900 text-sm">
                      {isFree ? '₹0 (Free Giveaway)' : `₹${book.price}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Original MRP:</span>
                    <span className="text-slate-400 line-through">₹{book.originalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Book Condition:</span>
                    <span className="font-semibold text-slate-700">{book.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Meetup Point:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">{book.meetupLocation}</span>
                  </div>
                </div>

                {/* Status Switcher Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  
                  {status === 'available' && (
                    <>
                      <button
                        onClick={() => handleMarkStatus(book.id, 'reserved')}
                        className="btn-glass flex-1 py-2 px-3 rounded-xl text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center justify-center gap-1.5 border-amber-200"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mark Deal Pending</span>
                      </button>
                      <button
                        onClick={() => handleMarkStatus(book.id, 'sold')}
                        className="btn-emerald flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Sold / Done</span>
                      </button>
                    </>
                  )}

                  {status === 'reserved' && (
                    <>
                      <button
                        onClick={() => handleMarkStatus(book.id, 'available')}
                        className="btn-glass flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Deal Cancelled (Put Back)</span>
                      </button>
                      <button
                        onClick={() => handleMarkStatus(book.id, 'sold')}
                        className="btn-emerald flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Confirm Handshake Sold</span>
                      </button>
                    </>
                  )}

                  {status === 'sold' && (
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Handoff completed with junior!</span>
                      </span>
                      <button
                        onClick={() => handleMarkStatus(book.id, 'available')}
                        className="btn-glass py-1.5 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Relist</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="card-porcelain p-8 sm:p-12 rounded-3xl text-center max-w-md mx-auto space-y-4 my-6">
          <div className="w-14 h-14 rounded-2xl bg-[#D4EBD8] border border-[#b8dfbe] mx-auto flex items-center justify-center text-[#14331a]">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-lg">
              {myBooks.length === 0 ? 'No books listed yet' : `No ${filter} listings`}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {myBooks.length === 0
                ? 'Passed your semester exams? Have books lying on your study desk? List them in 10 seconds or gift them to incoming juniors!'
                : 'Switch filters or list new books to manage their handoff status.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenSellModal();
              }}
              className="btn-emerald px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List Your First Book</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
