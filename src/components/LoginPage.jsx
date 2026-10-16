import React, { useState } from 'react';
import { ShieldCheck, User, Building2, Lock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { DEPARTMENTS } from '../data/initialData';
import { sound } from '../utils/sound';
import { supabase } from '../utils/supabase';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Registration fields
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('Sem 3');
  const [mainDept, setMainDept] = useState('BSC');
  const [subBranchId, setSubBranchId] = useState('bsc');
  const [regPhone, setRegPhone] = useState('');
  const [regPin, setRegPin] = useState('');
  
  // Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const handleDeptChange = (deptKey) => {
    sound.playClick();
    setMainDept(deptKey);
    const firstSub = DEPARTMENTS[deptKey].subBranches[0].id;
    setSubBranchId(firstSub);
  };

  const currentSubBranches = DEPARTMENTS[mainDept].subBranches;

  const handleRegister = async (e) => {
    e.preventDefault();
    sound.playClick();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    const cleanPhone = regPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (regPin.length !== 4) {
      setErrorMsg('Please set a 4-digit student security PIN');
      return;
    }

    const selectedBranchObj = currentSubBranches.find(b => b.id === subBranchId) || currentSubBranches[0];

    const newUser = {
      name: name.trim(),
      semester,
      mainDept,
      subBranchId,
      branchName: selectedBranchObj.name,
      fullNameBranch: selectedBranchObj.fullName,
      phone: cleanPhone,
      pin: regPin,
      joinedAt: new Date().toISOString()
    };

    setLoading(true);
    try {
      // Save student to Supabase
      const { data, error } = await supabase.from('students').upsert({
        phone: cleanPhone,
        pin: regPin,
        name: name.trim(),
        semester,
        main_dept: mainDept,
        sub_branch_id: subBranchId,
        branch_name: selectedBranchObj.name,
        full_name_branch: selectedBranchObj.fullName
      }, { onConflict: 'phone' });

      if (error) {
        console.warn('Supabase students upsert error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase student save failed, falling back to local cache', err);
    } finally {
      setLoading(false);
    }

    // Save to local cache as fallback
    const existingStudents = JSON.parse(localStorage.getItem('hmx_students') || '[]');
    const existingIndex = existingStudents.findIndex(s => s.phone === cleanPhone);
    if (existingIndex >= 0) {
      existingStudents[existingIndex] = newUser;
    } else {
      existingStudents.push(newUser);
    }
    localStorage.setItem('hmx_students', JSON.stringify(existingStudents));

    sound.playSuccess();
    onLoginSuccess(newUser);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    sound.playClick();
    setErrorMsg('');

    const cleanPhone = loginPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter your registered 10-digit mobile number');
      return;
    }
    if (loginPin.length !== 4) {
      setErrorMsg('Please enter your 4-digit security PIN');
      return;
    }

    setLoading(true);
    try {
      // 1. Try Supabase cloud lookup first
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('phone', cleanPhone)
        .eq('pin', loginPin)
        .maybeSingle();

      if (data) {
        const userObj = {
          name: data.name,
          semester: data.semester,
          mainDept: data.main_dept,
          subBranchId: data.sub_branch_id,
          branchName: data.branch_name,
          fullNameBranch: data.full_name_branch,
          phone: data.phone,
          pin: data.pin,
          joinedAt: data.created_at
        };
        sound.playSuccess();
        onLoginSuccess(userObj);
        return;
      }
    } catch (err) {
      console.warn('Cloud login lookup failed, checking local cache:', err);
    } finally {
      setLoading(false);
    }

    // 2. Fallback to local cache if offline or newly created
    const existingStudents = JSON.parse(localStorage.getItem('hmx_students') || '[]');
    const foundUser = existingStudents.find(s => s.phone === cleanPhone && s.pin === loginPin);

    if (foundUser) {
      sound.playSuccess();
      onLoginSuccess(foundUser);
    } else {
      // Demo / first-time bypass for user Anshif or new setup
      if (existingStudents.length === 0) {
        const demoUser = {
          name: 'Anshif',
          semester: 'Sem 3',
          mainDept: 'BSC',
          subBranchId: 'it',
          branchName: 'B.Sc. IT',
          fullNameBranch: 'B.Sc. Information Technology',
          phone: cleanPhone,
          pin: loginPin,
          joinedAt: new Date().toISOString()
        };
        // Also sync demo user to cloud
        supabase.from('students').upsert({
          phone: cleanPhone,
          pin: loginPin,
          name: demoUser.name,
          semester: demoUser.semester,
          main_dept: demoUser.mainDept,
          sub_branch_id: demoUser.subBranchId,
          branch_name: demoUser.branchName,
          full_name_branch: demoUser.fullNameBranch
        }).then(() => {});

        existingStudents.push(demoUser);
        localStorage.setItem('hmx_students', JSON.stringify(existingStudents));
        sound.playSuccess();
        onLoginSuccess(demoUser);
      } else {
        setErrorMsg('Invalid mobile number or PIN. Please check or register an account.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col justify-between p-4 sm:p-6">
      
      {/* Top Bar Branding */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="h-10 px-3 py-1.5 rounded-xl bg-[#D4EBD8] border border-[#b8dfbe] flex items-center justify-center shadow-xs">
            <img src="/logo-dark.png" alt="HMX Logo" className="h-5 w-auto object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight block">HMX</span>
            <span className="text-[11px] text-slate-500 font-medium block -mt-0.5">College Textbook Exchange</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4EBD8]/40 border border-[#b8dfbe] text-emerald-900 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Student Access Only</span>
        </div>
      </div>

      {/* Main Authentication Card (Porcelain White) */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {isRegistering ? 'Create Student Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-slate-500">
              {isRegistering
                ? 'Join your campus textbook network to buy and sell old books'
                : 'Login with your registered mobile number & 4-digit PIN'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsRegistering(false);
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl transition-all ${
                !isRegistering
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Login
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsRegistering(true);
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl transition-all ${
                isRegistering
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Registration
            </button>
          </div>

          {/* Form: LOGIN */}
          {!isRegistering ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
              
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Registered Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">4-Digit Security PIN</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="••••"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 tracking-widest text-base focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Secures your account against unauthorized book sales.</p>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="btn-emerald w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Enter Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsRegistering(true);
                  }}
                  className="text-xs text-slate-500 hover:text-emerald-700 transition-colors"
                >
                  First time here? <strong className="text-slate-900 underline">Create student account</strong>
                </button>
              </div>

            </form>
          ) : (
            /* Form: REGISTRATION */
            <form onSubmit={handleRegister} className="space-y-4 text-xs sm:text-sm">
              
              {/* Full Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Student Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anshif"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Semester (Sem 1 to Sem 8) */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Current Semester *</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                  {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map((sem) => (
                    <button
                      type="button"
                      key={sem}
                      onClick={() => {
                        sound.playClick();
                        setSemester(sem);
                      }}
                      className={`btn-glass py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                        semester === sem ? 'btn-glass-active' : ''
                      }`}
                    >
                      {sem.replace('Sem ', 'S')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department: BSC vs BCOM */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Academic Faculty *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeptChange('BSC')}
                    className={`btn-glass p-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all text-xs ${
                      mainDept === 'BSC' ? 'btn-glass-active' : ''
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>B.Sc. (Science)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeptChange('BCOM')}
                    className={`btn-glass p-2.5 rounded-2xl flex items-center justify-center gap-1.5 transition-all text-xs ${
                      mainDept === 'BCOM' ? 'btn-glass-active' : ''
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>B.Com. (Commerce)</span>
                  </button>
                </div>
              </div>

              {/* Mobile Number & Security PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-2.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Create 4-Digit PIN *</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="••••"
                    value={regPin}
                    onChange={(e) => setRegPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 tracking-widest text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="btn-emerald w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create Account & Start</span>
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsRegistering(false);
                  }}
                  className="text-xs text-slate-500 hover:text-emerald-700 transition-colors"
                >
                  Already registered? <strong className="text-slate-900 underline">Sign In</strong>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-2 font-medium">
        <span>HMX Campus Textbook Exchange • Verified Student Access Only</span>
      </div>

    </div>
  );
}
