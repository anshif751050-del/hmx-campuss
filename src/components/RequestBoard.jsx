import React, { useState } from 'react';
import { Plus, MessageCircle, HelpCircle } from 'lucide-react';
import { BRANCHES } from '../data/initialData';
import { sound } from '../utils/sound';

export default function RequestBoard({ requests, onRequestAdded }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [branchName, setBranchName] = useState('B.Sc. IT');
  const [semester, setSemester] = useState('Sem 3');
  const [maxBudget, setMaxBudget] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handlePostRequest = (e) => {
    e.preventDefault();
    sound.playClick();
    if (!title || !studentName || !phone) {
      alert('Please fill out the title, your name, and phone number.');
      return;
    }

    const newReq = {
      id: `req-${Date.now()}`,
      title,
      branchName,
      semester,
      maxBudget: parseFloat(maxBudget) || 200,
      studentName,
      phone: phone.replace(/\D/g, ''),
      notes: notes || 'Needed for current semester syllabus.',
      postedTime: 'Just now'
    };

    onRequestAdded(newReq);
    sound.playSuccess();
    setShowModal(false);
    setTitle('');
    setMaxBudget('');
    setNotes('');
  };

  const handleConnectWithRequester = (req) => {
    sound.playClick();
    const message = encodeURIComponent(
      `Hi ${req.studentName}! I saw your request on HMX for "${req.title}". I passed this semester and have this book available. Are you still looking for it?`
    );
    window.open(`https://wa.me/${req.phone}?text=${message}`, '_blank');
  };

  return (
    <div className="py-6 space-y-6">
      
      {/* Wishlist Header Banner */}
      <div className="card-porcelain p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <HelpCircle className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Junior Wishlist & Book Requests</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed font-medium">
            Can't find the exact book you need for your semester? Post a request below. Seniors passing out will contact you directly on WhatsApp if they have it on their shelf!
          </p>
        </div>

        {/* Post Request Button */}
        <button
          onClick={() => {
            sound.playClick();
            setShowModal(true);
          }}
          className="btn-glass px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Post a Book Request</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="card-porcelain p-4 rounded-2xl flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {req.branchName} • {req.semester}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{req.postedTime}</span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2">
                {req.title}
              </h3>

              <p className="text-xs text-slate-600 italic line-clamp-2 font-medium">
                "{req.notes}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Max Budget</p>
                <p className="text-base font-black text-slate-900">₹{req.maxBudget}</p>
                <p className="text-[10px] text-slate-500 font-medium">by {req.studentName}</p>
              </div>

              {/* Action */}
              <button
                onClick={() => handleConnectWithRequester(req)}
                className="w-auto py-2 px-3 rounded-xl text-xs font-bold bg-[#D4EBD8] hover:bg-[#c3e4c8] text-slate-900 border border-[#b8dfbe] flex items-center gap-1.5 transition-all shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>I Have This!</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-slate-900 max-h-[94vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Post a Book Request</h3>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowModal(false);
                }}
                className="btn-glass p-2 rounded-full text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostRequest} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Book / Subject Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrodynamics or Operating Systems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Branch</label>
                  <select
                    value={branchName}
                    onChange={(e) => {
                      sound.playClick();
                      setBranchName(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    {BRANCHES.filter(b => b.id !== 'all').map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => {
                      sound.playClick();
                      setSemester(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 250"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tushar K."
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">WhatsApp Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 919876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Additional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Needed urgently before Monday midterm"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowModal(false);
                  }}
                  className="btn-glass px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-emerald px-4 py-2 rounded-xl font-bold text-xs"
                >
                  Post Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
