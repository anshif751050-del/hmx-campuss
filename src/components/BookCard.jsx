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
          `Hi ${book.sellerName}! I saw your free donated book "${book.title}" on HMX. I'm a junior in ${book.semester} and would love to pick it up near ${book.meetupLocation}. Are you available?`
        )
      : encodeURIComponent(
          `Hi ${book.sellerName}! I saw your book "${book.title}" on HMX for ₹${book.price}. Is it still available to pick up near ${book.meetupLocation}?`
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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
          <span>{book.branchName}</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 font-extrabold">{book.semester}</span>
        </span>

        {isFree ? (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-black text-xs border border-purple-200 flex items-center gap-1 shadow-xs">
            <Gift className="w-3 h-3 text-purple-600" />
            <span>FREE GIFT</span>
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
            {book.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Book Title & Badges */}
      <div className="space-y-1.5">
        <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
          {book.title}
        </h3>

        {/* Condition & Status Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {book.condition}
          </span>

          {status === 'reserved' && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Deal Pending</span>
            </span>
          )}

          {status === 'sold' && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-bold bg-slate-200 text-slate-700 border border-slate-300">
              <CheckCircle2 className="w-3 h-3 text-slate-600" />
              <span>Handed Down</span>
            </span>
          )}

          <span className="text-[11px] text-slate-400 font-medium">• {book.postedTime}</span>
        </div>
      </div>

      {/* Price & Location Section */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            {isFree ? (
              <span className="text-2xl font-black text-purple-900 tracking-tight">FREE (₹0)</span>
            ) : (
              <>
                <span className="text-2xl font-black text-slate-900 tracking-tight">₹{book.price}</span>
                <span className="text-xs text-slate-400 line-through font-medium">₹{book.originalPrice}</span>
              </>
            )}
          </div>
          
          {isFree ? (
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              Save ₹{book.originalPrice || 500}
            </span>
          ) : (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Save ₹{savings}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{book.meetupLocation}</span>
        </div>

        {/* Action Buttons: 1 Glass Button + 1 Solid Button */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onInspect(book);
            }}
            className="btn-glass w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="btn-emerald w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </button>
        </div>

      </div>

    </div>
  );
}
