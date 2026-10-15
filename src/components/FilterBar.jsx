import React from 'react';
import { BRANCHES, SEMESTERS, BOOK_CONDITIONS } from '../data/initialData';
import { Check } from 'lucide-react';
import { sound } from '../utils/sound';

export default function FilterBar({
  selectedBranch,
  setSelectedBranch,
  selectedSem,
  setSelectedSem,
  selectedDept,
  setSelectedDept,
  conditionFilter,
  setConditionFilter
}) {
  const visibleBranches = BRANCHES.filter((b) => {
    if (b.id === 'all') return true;
    if (selectedDept === 'ALL') return true;
    return b.dept === selectedDept;
  });

  return (
    <div className="py-2.5 space-y-3">
      
      {/* 1. Academic Faculty Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-sm -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap pr-1 text-xs hidden sm:inline">
          Faculty:
        </span>
        <button
          onClick={() => {
            sound.playClick();
            setSelectedDept('ALL');
            setSelectedBranch('all');
          }}
          className={`btn-glass px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            selectedDept === 'ALL' ? 'btn-glass-active' : ''
          }`}
        >
          All Departments
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setSelectedDept('BSC');
            setSelectedBranch('all');
          }}
          className={`btn-glass px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            selectedDept === 'BSC' ? 'btn-glass-active' : ''
          }`}
        >
          B.Sc. (Science)
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setSelectedDept('BCOM');
            setSelectedBranch('all');
          }}
          className={`btn-glass px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            selectedDept === 'BCOM' ? 'btn-glass-active' : ''
          }`}
        >
          B.Com. (Commerce)
        </button>
      </div>

      {/* 2. Specific Discipline / Subject */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-sm -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap pr-1 text-xs hidden sm:inline">
          Subject:
        </span>
        {visibleBranches.map((b) => {
          const isActive = selectedBranch === b.id;
          return (
            <button
              key={b.id}
              onClick={() => {
                sound.playClick();
                setSelectedBranch(b.id);
              }}
              className={`btn-glass px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive ? 'btn-glass-active' : ''
              }`}
            >
              {b.name}
            </button>
          );
        })}
      </div>

      {/* 3. Semester (Sem 1 to Sem 8) & Condition Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-sm -mx-4 px-4 sm:mx-0 sm:px-0">
        <span className="font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap pr-1 text-xs hidden sm:inline">
          Semester:
        </span>
        {SEMESTERS.map((sem) => {
          const isActive = selectedSem === sem;
          return (
            <button
              key={sem}
              onClick={() => {
                sound.playClick();
                setSelectedSem(sem);
              }}
              className={`btn-glass px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive ? 'btn-glass-active' : ''
              }`}
            >
              {sem}
            </button>
          );
        })}

        {/* Condition Filter */}
        <div className="h-5 w-[1px] bg-slate-300 mx-1 flex-shrink-0" />
        
        {BOOK_CONDITIONS.map((cond) => {
          const isSelected = conditionFilter === cond.name;
          return (
            <button
              key={cond.id}
              onClick={() => {
                sound.playClick();
                setConditionFilter(isSelected ? null : cond.name);
              }}
              className={`btn-glass px-3 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isSelected ? 'btn-glass-active' : 'text-slate-700'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 inline mr-1 text-emerald-700 stroke-[3]" />}
              {cond.name} ({cond.discountPercent}% OFF)
            </button>
          );
        })}
      </div>

    </div>
  );
}
