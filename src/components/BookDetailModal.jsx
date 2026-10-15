import React, { useState } from 'react';
import { X, MapPin, Clock, ShieldCheck, MessageCircle, Copy, Check, User, Gift } from 'lucide-react';
import { sound } from '../utils/sound';

export default function BookDetailModal({ book, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!book) return null;

  const isFree = book.isDonation || book.price === 0;
  const savings = isFree ? book.originalPrice : (book.originalPrice - book.price);

  const handleCopyPhone = () => {
    sound.playClick();
    navigator.clipboard.writeText(book.sellerPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    sound.playClick();
    const message = isFree
      ? encodeURIComponent(
          `Hi ${book.sellerName}! I saw your free textbook donation "${book.title}" on HMX. I'm a junior in ${book.semester} and would love to pick it up near ${book.meetupLocation}. Are you available?`
        )
      : encodeURIComponent(
          `Hi ${book.sellerName}! I saw your book "${book.title}" on HMX for ₹${book.price}. Is it still available to pick up near ${book.meetupLocation}?`
        );
    window.open(`https://wa.me/${book.sellerPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {book.branchName}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {book.semester}
            </span>
            {isFree ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 flex items-center gap-1">
                <Gift className="w-3 h-3" />
                <span>FREE DONATION</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                {book.discountPercent}% OFF
              </span>
            )}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-glass p-2 rounded-full text-slate-400 hover:text-slate-700"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Title Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {book.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Cataloged {book.postedTime}</p>
          </div>

          {/* Fair Price Breakdown Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  {isFree ? '₹0 (FREE)' : `₹${book.price}`}
                </span>
                <span className="text-sm text-slate-400 line-through font-semibold">₹{book.originalPrice}</span>
              </div>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                isFree 
                  ? 'bg-purple-100 text-purple-800 border-purple-200' 
                  : 'text-emerald-700 bg-emerald-100 border-emerald-200'
              }`}>
                {isFree ? `100% Free Gift (Save ₹${savings})` : `Save ₹${savings} (${book.discountPercent}% OFF)`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isFree 
                ? '💝 Donated by senior as a free academic gift for junior students.' 
                : <span>Automated fair price calculated based on <strong>{book.condition}</strong> condition.</span>
              }
            </p>
          </div>

          {/* Condition Box */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Book Health & Notes</span>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-800">{book.condition}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {book.conditionNotes || 'No specific notes mentioned. Pages and binding are well maintained.'}
              </p>
            </div>
          </div>

          {/* Senior / Seller & Pickup Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            
            {/* Seller Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{book.sellerName}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{book.sellerYear}</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{book.meetupTime}</span>
              </div>
            </div>

            {/* Meetup Location */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> Campus Meeting Point
              </span>
              <p className="text-xs text-slate-800 font-bold pt-0.5">
                {book.meetupLocation}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Direct in-person campus hand-off.
              </p>
            </div>

          </div>

          {/* Campus Safety Banner */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <p className="leading-relaxed text-[11px] font-medium">
              <strong>Campus Safety:</strong> Meet in public campus areas (Library, Canteen). Inspect book pages before paying via UPI or Cash.
            </p>
          </div>

        </div>

        {/* Modal Footer - Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleCopyPhone}
            className="btn-glass w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Phone Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Seller Phone</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsApp}
            className="btn-emerald w-full sm:flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}
