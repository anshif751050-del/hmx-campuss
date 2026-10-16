import React from 'react';
import { MapPin, MessageCircle, Eye, Gift, Clock, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

export default function BookCard({ book, onInspect }) {
  const isFree = book.isDonation || book.price === 0;
  const savings = isFree ? book.originalPrice : (book.originalPrice - book.price);
  const status = book.status || 'available';

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    sound.playClick();
    const message = isFree
      ? encodeURIComponent(
          `Hi ${book.sellerName}! I saw your free donated book "${book.title}" on HMX. I'm a junior in ${book.semester} and would love to take it. Are you available on campus?`
        )
      : encodeURIComponent(
          `Hi ${book.sellerName}! I saw your book "${book.title}" on HMX for ₹${book.price}. Is it still available to buy on campus?`
        );
    window.open(`https://wa.me/${book.sellerPhone}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => {
        sound.playClick();
        onInspect(book);
      }}
      className={`card-porcelain rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 group cursor-pointer transition-all ${
        status === 'sold' ? 'opacity-65 grayscale-[30%]' : ''
      }`}
    >
      {/* Top Header: Department & Semester + Discount Tag */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
          <span>{book.branchName}</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 font-black">{book.semester}</span>
        </span>

        {isFree ? (
          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-black text-xs border border-purple-200 flex items-center gap-1 shadow-xs">
            <Gift className="w-3.5 h-3.5 text-purple-600" />
            <span>FREE GIFT</span>
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
            {book.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Book Title & Badges */}
      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
          {book.title}
        </h3>

        {/* Condition & Status Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {book.condition}
          </span>

          {status === 'reserved' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Deal Pending</span>
            </span>
          )}

          {status === 'sold' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-bold bg-slate-200 text-slate-700 border border-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Handed Down</span>
            </span>
          )}

          <span className="text-xs text-slate-500 font-medium">• {book.postedTime}</span>
        </div>
      </div>

      {/* Price & Location Section */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            {isFree ? (
              <span className="text-2xl sm:text-3xl font-black text-purple-900 tracking-tight">FREE (₹0)</span>
            ) : (
              <>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">₹{book.price}</span>
                <span className="text-sm text-slate-400 line-through font-semibold">₹{book.originalPrice}</span>
              </>
            )}
          </div>
          
          {isFree ? (
            <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
              Save ₹{book.originalPrice || 500}
            </span>
          ) : (
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              Save ₹{savings}
            </span>
          )}
        </div>

        {book.meetupLocation ? (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-medium">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{book.meetupLocation}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Direct Campus Hand-off via WhatsApp</span>
          </div>
        )}

        {/* Action Buttons: 1 Glass Button + 1 Solid Button */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onInspect(book);
            }}
            className="btn-glass w-full py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="btn-emerald w-full py-3 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xs active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </button>
        </div>

      </div>

    </div>
  );
}
