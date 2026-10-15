import React, { useState } from 'react';
import { X, Sparkles, Lock, Check, ShieldCheck, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BRANCHES, SEMESTERS, BOOK_CONDITIONS } from '../data/initialData';
import { sound } from '../utils/sound';

export default function SellBookModal({ onClose, onBookAdded, currentUser, onOpenAuthModal }) {
  const [title, setTitle] = useState('');
  const [branchId, setBranchId] = useState(currentUser?.subBranchId || 'it');
  const [semester, setSemester] = useState(currentUser?.semester || 'Sem 3');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isDonation, setIsDonation] = useState(false);
  
  // Health / Condition state (Defaults to Condition 1: Like New - 25% OFF)
  const [selectedConditionId, setSelectedConditionId] = useState(1);
  const [conditionNotes, setConditionNotes] = useState('');
  
  const [meetupLocation, setMeetupLocation] = useState('Central Library or Canteen');
  const [meetupTime, setMeetupTime] = useState('After classes (around 3:30 PM)');
  const [sellerName, setSellerName] = useState(currentUser?.name || '');
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '');

  const activeCondition = BOOK_CONDITIONS.find(c => c.id === selectedConditionId) || BOOK_CONDITIONS[0];

  const parsedOriginal = parseFloat(originalPrice) || 0;
  const lockedDiscountPercent = isDonation ? 100 : activeCondition.discountPercent;
  const lockedSellingPrice = isDonation 
    ? 0 
    : (parsedOriginal > 0 ? Math.round(parsedOriginal * (1 - lockedDiscountPercent / 100)) : 0);
  const buyerSavings = isDonation ? parsedOriginal : (parsedOriginal - lockedSellingPrice);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (!title) {
      alert('Please fill out the book title.');
      return;
    }

    if (!isDonation && (!originalPrice || parsedOriginal <= 0)) {
      alert('Please enter the original MRP to calculate the fair exchange price.');
      return;
    }

    const branchObj = BRANCHES.find((b) => b.id === branchId) || { name: 'B.Sc. IT', dept: 'BSC' };

    const newBook = {
      id: `hmx-${Date.now()}`,
      title,
      branchId,
      branchName: branchObj.name,
      dept: branchObj.dept,
      semester,
      originalPrice: parsedOriginal > 0 ? parsedOriginal : (isDonation ? 500 : 0),
      conditionId: activeCondition.id,
      condition: activeCondition.name,
      discountPercent: lockedDiscountPercent,
      price: lockedSellingPrice,
      isDonation: isDonation,
      status: 'available',
      conditionNotes: conditionNotes || (isDonation ? '💝 Free Senior Gift / Donation' : activeCondition.desc),
      sellerName: sellerName || currentUser.name,
      sellerYear: `${currentUser.semester} ${currentUser.branchName}`,
      sellerPhone: (sellerPhone || currentUser.phone).replace(/\D/g, ''),
      meetupLocation,
      meetupTime,
      postedTime: 'Just now',
      views: 1
    };

    onBookAdded(newBook);

    sound.playSuccess();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">List Your Old Books</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Pass on materials to juniors at fair campus prices</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-glass p-2.5 rounded-full text-slate-500 hover:text-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container with fixed bottom action bar */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          
          {/* Scrollable Form Body with ample padding */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5 text-sm flex-1">
            
            {/* 1. Book Title */}
            <div>
              <label className="block text-sm text-slate-800 font-bold mb-1.5">Book / Subject Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Operating System Concepts or Physical Chemistry"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 font-semibold text-sm sm:text-base"
              />
            </div>

          {/* Course & Semester (Sem 1 to Sem 8) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-sm text-slate-800 font-bold mb-1.5">Department / Branch *</label>
              <select
                value={branchId}
                onChange={(e) => {
                  sound.playClick();
                  setBranchId(e.target.value);
                }}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-semibold text-sm"
              >
                {BRANCHES.filter(b => b.id !== 'all').map((b) => (
                  <option key={b.id} value={b.id} className="bg-white text-slate-900">
                    {b.fullName || b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-800 font-bold mb-1.5">Relevant Semester (1–8) *</label>
              <select
                value={semester}
                onChange={(e) => {
                  sound.playClick();
                  setSemester(e.target.value);
                }}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-semibold text-sm"
              >
                {SEMESTERS.filter(s => s !== 'All Sems').map((sem) => (
                  <option key={sem} value={sem} className="bg-white text-slate-900">
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Book Health / Condition */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Book Condition (Sets Locked Price)
              </span>
              <span className="text-xs text-emerald-700 font-extrabold">
                Fair-Pricing Active
              </span>
            </div>

            <div className="space-y-2">
              {BOOK_CONDITIONS.map((cond) => {
                const isSelected = selectedConditionId === cond.id;
                return (
                  <div
                    key={cond.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedConditionId(cond.id);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#D4EBD8]/35 border-[#b8dfbe] shadow-sm ring-1 ring-[#b8dfbe]'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          isSelected ? 'bg-[#D4EBD8] text-slate-900 border border-[#b8dfbe]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {cond.id}
                        </span>
                        <div>
                          <span className={`font-extrabold text-sm ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                            {cond.name}
                          </span>
                          <p className="text-xs text-slate-500 mt-0.5">{cond.desc}</p>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-white border border-emerald-300 text-emerald-700 shadow-xs">
                          {cond.discountPercent}% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <label className="block text-sm text-slate-800 font-bold mb-1.5">Optional Notes for Junior</label>
              <input
                type="text"
                placeholder="e.g. Unit 2 and 3 formulas highlighted with pencil marks"
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* 3. Original MRP & AUTOMATED LOCKED FAIR PRICE */}
          <div className="pt-2 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Pricing & Senior Sponsorship
            </span>

            {/* Donation / Free Giveaway Toggle Card */}
            <div 
              onClick={() => {
                sound.playClick();
                setIsDonation(!isDonation);
              }}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                isDonation 
                  ? 'bg-purple-50 border-purple-300 shadow-xs ring-1 ring-purple-400/30' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isDonation ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900">
                      Donate / Free Hand-me-down (₹0)
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-purple-100 text-purple-800">
                      Free Gift
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sponsor an incoming junior for ₹0. Zero charges.
                  </p>
                </div>
              </div>

              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                isDonation ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {isDonation && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-sm text-slate-800 font-bold mb-1.5">
                  {isDonation ? 'Original MRP (For reference)' : 'Original MRP on Book (₹) *'}
                </label>
                <input
                  type="number"
                  required={!isDonation}
                  placeholder="e.g. 800"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-base font-black"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Selling Price (Auto-Locked)</span>
                </label>
                <div className={`px-4 py-3 rounded-xl border font-black text-base flex items-center justify-between ${
                  isDonation 
                    ? 'bg-purple-100/70 border-purple-300 text-purple-900' 
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}>
                  <span>{isDonation ? '₹0 (FREE)' : `₹${lockedSellingPrice}`}</span>
                  <span className={`text-xs font-bold ${isDonation ? 'text-purple-700' : 'text-emerald-700'}`}>
                    {isDonation ? '100% FREE GIFT' : `${lockedDiscountPercent}% OFF MRP`}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {isDonation ? (
                  <span><strong>Senior Gift Mode:</strong> You are donating this textbook for <strong>₹0</strong>. Junior saves ₹{buyerSavings || 500} on study materials!</span>
                ) : (
                  <span><strong>Fair Price Policy:</strong> Selling price is strictly locked: <strong>{activeCondition.name} ({lockedDiscountPercent}% OFF)</strong>. Buyer saves ₹{buyerSavings}.</span>
                )}
              </p>
            </div>
          </div>

          {/* 4. Campus Hand-off */}
          <div className="pt-2 space-y-3 pb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Campus Hand-off Spot
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-sm text-slate-800 font-bold mb-1.5">Campus Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Central Library, Science Canteen"
                  value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-800 font-bold mb-1.5">Best Timing</label>
                <input
                  type="text"
                  placeholder="e.g. Lunch break or after 3:30 PM"
                  value={meetupTime}
                  onChange={(e) => setMeetupTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Fixed Bottom Footer Action Bar - Always 100% visible and easy to press */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="btn-glass px-4 py-3 rounded-xl text-slate-700 hover:text-slate-900 text-sm font-bold active:scale-95 transition-all"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn-emerald flex-1 py-3 px-6 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span>Publish Book • {isDonation ? 'FREE (₹0)' : `₹${lockedSellingPrice || 0}`}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
);
}
