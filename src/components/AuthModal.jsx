import React, { useState } from 'react';
import { X, ShieldCheck, Phone, User, GraduationCap, Building2, KeyRound, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { DEPARTMENTS, SEMESTERS } from '../data/initialData';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('Sem 3');
  const [mainDept, setMainDept] = useState('BSC'); // 'BSC' or 'BCOM'
  const [subBranchId, setSubBranchId] = useState('it');
  const [phone, setPhone] = useState('');
  
  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // When mainDept changes, reset subBranchId
  const handleDeptChange = (deptKey) => {
    setMainDept(deptKey);
    const firstSub = DEPARTMENTS[deptKey].subBranches[0].id;
    setSubBranchId(firstSub);
  };

  const currentSubBranches = DEPARTMENTS[mainDept].subBranches;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    // Generate random 4-digit OTP
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockOtp);
    setErrorMsg('');
    setStep(2);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...enteredOtp];
    newOtp[index] = value;
    setEnteredOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const joined = enteredOtp.join('');
    if (joined !== generatedOtp) {
      setErrorMsg('Invalid OTP. Please check the code or click Auto-fill.');
      return;
    }

    // Find branch object
    const selectedBranchObj = currentSubBranches.find(b => b.id === subBranchId) || currentSubBranches[0];

    const newUser = {
      name: name.trim(),
      semester,
      mainDept,
      subBranchId,
      branchName: selectedBranchObj.name,
      fullNameBranch: selectedBranchObj.fullName,
      phone: phone.replace(/\D/g, ''),
      joinedAt: new Date().toISOString()
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#121217] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-zinc-950 font-black text-sm">
              HMX
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {step === 1 ? 'Student Registration / Login' : 'Verify Mobile OTP'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {step === 1 ? 'Access college book exchanges with your student profile' : `Sent code to +91 ${phone}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-glass p-2 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: User Profile Details */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
            
            {/* Name */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Full Student Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Anshif"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Semester Selection */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Your Current Semester *</label>
              <div className="grid grid-cols-6 gap-1.5">
                {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'].map((sem) => (
                  <button
                    type="button"
                    key={sem}
                    onClick={() => setSemester(sem)}
                    className={`btn-glass py-2 rounded-xl text-xs font-medium text-center transition-all ${
                      semester === sem ? 'btn-glass-active font-bold' : 'text-zinc-400'
                    }`}
                  >
                    {sem.replace('Sem ', 'S')}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Department: B.Sc vs B.Com */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Department / Faculty *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDeptChange('BSC')}
                  className={`btn-glass p-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                    mainDept === 'BSC' ? 'btn-glass-active font-bold' : 'text-zinc-300'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>B.Sc. (Science)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeptChange('BCOM')}
                  className={`btn-glass p-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                    mainDept === 'BCOM' ? 'btn-glass-active font-bold' : 'text-zinc-300'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>B.Com. (Commerce)</span>
                </button>
              </div>
            </div>

            {/* Sub-Branch Dependent on BSC or BCOM */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                {mainDept === 'BSC' ? 'Select B.Sc. Subject / Stream *' : 'Select B.Com. Specialization *'}
              </label>
              <select
                value={subBranchId}
                onChange={(e) => setSubBranchId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              >
                {currentSubBranches.map((sub) => (
                  <option key={sub.id} value={sub.id} className="bg-zinc-900 text-white">
                    {sub.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-zinc-300 font-medium mb-1">Mobile Number (For Campus Hand-offs) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Used by buyers/seniors to message on WhatsApp for hand-offs.</p>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
            
            {/* Live Simulated OTP Notification Pill */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" /> SMS OTP Received
                </span>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp.split(''))}
                  className="btn-glass px-2 py-0.5 rounded-md text-[11px] font-semibold text-emerald-300"
                >
                  Auto-fill Code
                </button>
              </div>
              <p className="text-xs">
                Your campus verification code is: <strong className="text-white text-base tracking-widest pl-1">{generatedOtp}</strong>
              </p>
            </div>

            <div>
              <label className="block text-center text-zinc-300 font-medium mb-3">
                Enter 4-Digit Verification Code
              </label>
              
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={enteredOtp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-2xl bg-zinc-900 border border-white/15 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-center text-rose-400 font-medium">{errorMsg}</p>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm OTP & Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-center text-xs text-zinc-400 hover:text-zinc-200"
              >
                Change mobile number or department
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
