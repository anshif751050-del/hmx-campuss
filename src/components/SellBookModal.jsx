import React, { useState } from 'react';
import { X, Sparkles, Lock, Check, ShieldCheck, Gift, Wrench, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BOOK_CONDITIONS, SYLLABUS_CATALOG } from '../data/initialData';
import { sound } from '../utils/sound';

export default function SellBookModal({ onClose, onBookAdded, currentUser, onOpenAuthModal }) {
  // Course selection: BSC or BCOM
  const [selectedDept, setSelectedDept] = useState(currentUser?.mainDept === 'BCOM' ? 'BCOM' : 'BSC');
  
  // Subject stream: 'malayalam' or 'english'
  const [selectedLanguage, setSelectedLanguage] = useState('malayalam');
  
  // Semester: 'Sem 1', 'Sem 2', 'Sem 3'
  const [semester, setSemester] = useState('Sem 1');
  
  const [isDonation, setIsDonation] = useState(false);
  
  // Health / Condition state (Defaults to Condition 1: Like New - 25% OFF)
  const [selectedConditionId, setSelectedConditionId] = useState(1);
  const [conditionNotes, setConditionNotes] = useState('');
  
  const [sellerName] = useState(currentUser?.name || '');
  const [sellerPhone] = useState(currentUser?.phone || '');

  // Look up prescribed book if BSC
  const catalogEntry = SYLLABUS_CATALOG.BSC?.[selectedLanguage]?.[semester] || null;
  const bookTitle = catalogEntry?.title || '';
  const originalPrice = catalogEntry?.mrp || 0;

  const activeCondition = BOOK_CONDITIONS.find(c => c.id === selectedConditionId) || BOOK_CONDITIONS[0];

  const lockedDiscountPercent = isDonation ? 100 : activeCondition.discountPercent;
  const lockedSellingPrice = isDonation 
    ? 0 
    : (originalPrice > 0 ? Math.round(originalPrice * (1 - lockedDiscountPercent / 100)) : 0);
  const buyerSavings = isDonation ? originalPrice : (originalPrice - lockedSellingPrice);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }

    if (selectedDept === 'BCOM') {
      alert('B.Com. is currently under maintenance. Please check back later!');
      return;
    }

    if (!bookTitle) {
      alert('Prescribed textbook details not found for this selection.');
      return;
    }

    const newBook = {
      id: `hmx-${Date.now()}`,
      title: bookTitle,
      branchId: 'bsc',
      branchName: 'B.Sc.',
      dept: 'BSC',
      semester,
      originalPrice,
      conditionId: activeCondition.id,
      condition: activeCondition.name,
      discountPercent: lockedDiscountPercent,
      price: lockedSellingPrice,
      isDonation: isDonation,
      status: 'available',
      conditionNotes: conditionNotes || (isDonation ? '💝 Free Senior Gift / Donation' : activeCondition.desc),
      sellerName: sellerName || currentUser.name,
      sellerYear: `${semester} B.Sc.`,
      sellerPhone: (sellerPhone || currentUser.phone).replace(/\D/g, ''),
      meetupLocation: '',
      meetupTime: '',
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
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">List Your Textbook</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Select course, language & semester</p>
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

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          
          {/* Scrollable Form Body */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-5 text-sm flex-1">
            
            {/* 1. Department Selection (B.Sc. vs B.Com.) */}
            <div>
              <label className="block text-sm text-slate-800 font-bold mb-2">Select Course *</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedDept('BSC');
                  }}
                  className={`p-3.5 rounded-2xl border text-center font-extrabold transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedDept === 'BSC'
                      ? 'bg-[#D4EBD8] border-[#b8dfbe] text-emerald-950 shadow-sm ring-1 ring-[#b8dfbe]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">B.Sc.</span>
                  <span className="text-xs text-slate-500 font-medium">Science</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedDept('BCOM');
                  }}
                  className={`p-3.5 rounded-2xl border text-center font-extrabold transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedDept === 'BCOM'
                      ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-sm ring-1 ring-amber-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">B.Com.</span>
                  <span className="text-xs text-amber-700 font-medium">Commerce</span>
                </button>
              </div>
            </div>

            {/* If B.Com. is selected: Show Under Maintenance card */}
            {selectedDept === 'BCOM' ? (
              <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3 my-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
                  <Wrench className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-amber-900">B.Com. Under Maintenance</h4>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed max-w-sm mx-auto">
                    B.Com. common syllabus catalog is currently being updated for the campus. Only B.Sc. listing is available right now.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedDept('BSC');
                  }}
                  className="btn-emerald px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  Switch to B.Sc. (Science)
                </button>
              </div>
            ) : (
              /* If B.Sc. is selected: Show Language, Semester, and Auto-filled Book Details */
              <>
                {/* 2. Language Selection (Malayalam or English) */}
                <div>
                  <label className="block text-sm text-slate-800 font-bold mb-2">Select Language Stream *</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedLanguage('malayalam');
                      }}
                      className={`p-3.5 rounded-2xl border text-center font-black transition-all ${
                        selectedLanguage === 'malayalam'
                          ? 'bg-[#D4EBD8] border-[#b8dfbe] text-emerald-950 shadow-sm ring-1 ring-[#b8dfbe]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base">മലയാളം</span>
                      <span className="block text-xs text-slate-500 font-medium mt-0.5">Malayalam</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedLanguage('english');
                      }}
                      className={`p-3.5 rounded-2xl border text-center font-black transition-all ${
                        selectedLanguage === 'english'
                          ? 'bg-[#D4EBD8] border-[#b8dfbe] text-emerald-950 shadow-sm ring-1 ring-[#b8dfbe]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base">English</span>
                      <span className="block text-xs text-slate-500 font-medium mt-0.5">Science English</span>
                    </button>
                  </div>
                </div>

                {/* 3. Semester Selection (Sem 1, Sem 2, Sem 3) */}
                <div>
                  <label className="block text-sm text-slate-800 font-bold mb-2">Select Semester *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Sem 1', 'Sem 2', 'Sem 3'].map((sem) => (
                      <button
                        type="button"
                        key={sem}
                        onClick={() => {
                          sound.playClick();
                          setSemester(sem);
                        }}
                        className={`p-3 rounded-2xl border text-center font-extrabold text-sm transition-all ${
                          semester === sem
                            ? 'bg-[#D4EBD8] border-[#b8dfbe] text-emerald-950 shadow-sm ring-1 ring-[#b8dfbe]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Auto-Generated Book Title & Official MRP Card */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      Prescribed Textbook (Auto-Selected)
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800">
                      Official MRP: ₹{originalPrice}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {bookTitle}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Standard syllabus text for {selectedDept} {semester} ({selectedLanguage === 'malayalam' ? 'Malayalam' : 'English'}). No need to type manually!
                  </p>
                </div>

                {/* 5. Book Health / Condition */}
                <div className="pt-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Book Condition (Fixes Fair Price)
                    </span>
                    <span className="text-xs text-emerald-700 font-extrabold">
                      Fair-Pricing Rule Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    {BOOK_CONDITIONS.map((cond) => {
                      const isSelected = selectedConditionId === cond.id;
                      const condPrice = Math.round(originalPrice * (1 - cond.discountPercent / 100));
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
                              <span className="block text-sm font-black text-slate-900">
                                ₹{condPrice}
                              </span>
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-black bg-white border border-emerald-300 text-emerald-700 shadow-xs">
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
                      placeholder="e.g. Clean pages with important points marked"
                      value={conditionNotes}
                      onChange={(e) => setConditionNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm font-medium"
                    />
                  </div>
                </div>

                {/* 6. Pricing Summary & Senior Donation Toggle */}
                <div className="pt-2 space-y-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Calculated Selling Price
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
                            Donate as Free Senior Gift (₹0)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Gift this book to a junior for ₹0. Zero charges.
                        </p>
                      </div>
                    </div>

                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                      isDonation ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isDonation && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Locked Price Display */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <span className="block text-xs text-slate-500 font-bold mb-1">Prescribed MRP</span>
                      <div className="px-3.5 py-3 rounded-xl bg-slate-100 border border-slate-200 font-black text-slate-700 text-base">
                        ₹{originalPrice}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs text-slate-700 font-bold mb-1 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fixed Fair Price</span>
                      </span>
                      <div className={`px-4 py-3 rounded-xl border font-black text-base flex items-center justify-between ${
                        isDonation 
                          ? 'bg-purple-100/70 border-purple-300 text-purple-900' 
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      }`}>
                        <span>{isDonation ? '₹0 (FREE)' : `₹${lockedSellingPrice}`}</span>
                        <span className={`text-xs font-bold ${isDonation ? 'text-purple-700' : 'text-emerald-700'}`}>
                          {isDonation ? 'FREE' : `${lockedDiscountPercent}% OFF`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {isDonation ? (
                        <span><strong>Free Senior Gift:</strong> Junior gets this textbook for <strong>₹0</strong> (saves full ₹{originalPrice}).</span>
                      ) : (
                        <span><strong>Fixed Fair Price:</strong> Junior saves <strong>₹{buyerSavings}</strong> ({lockedDiscountPercent}% OFF on MRP ₹{originalPrice}).</span>
                      )}
                    </p>
                  </div>
                </div>

              </>
            )}

          </div>

          {/* Sticky Bottom Action Bar with 100% visible Publish button (with extra padding to clear mobile nav) */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] mb-safe">
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
              disabled={selectedDept === 'BCOM'}
              className={`flex-1 py-3 px-6 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all ${
                selectedDept === 'BCOM'
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'btn-emerald'
              }`}
            >
              {selectedDept === 'BCOM' ? (
                <span>B.Com. Under Maintenance</span>
              ) : (
                <span>Publish Book • {isDonation ? 'FREE (₹0)' : `₹${lockedSellingPrice || 0}`}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
