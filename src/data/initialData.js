export const DEPARTMENTS = {
  BSC: {
    id: 'BSC',
    name: 'B.Sc. (Bachelor of Science)',
    subBranches: [
      { id: 'it', name: 'B.Sc. IT', fullName: 'B.Sc. Information Technology' },
      { id: 'chemistry', name: 'B.Sc. Chemistry', fullName: 'B.Sc. Chemistry' },
      { id: 'physics', name: 'B.Sc. Physics', fullName: 'B.Sc. Physics' },
      { id: 'maths', name: 'B.Sc. Mathematics', fullName: 'B.Sc. Mathematics' },
      { id: 'geography', name: 'B.Sc. Geography', fullName: 'B.Sc. Geography' },
      { id: 'psychology', name: 'B.Sc. Psychology', fullName: 'B.Sc. Psychology' },
    ]
  },
  BCOM: {
    id: 'BCOM',
    name: 'B.Com. (Bachelor of Commerce)',
    subBranches: [
      { id: 'bcom-finance', name: 'B.Com. Finance', fullName: 'B.Com. Finance' },
      { id: 'bcom-professional', name: 'B.Com. Professional', fullName: 'B.Com. Professional' }
    ]
  }
};

export const BRANCHES = [
  { id: 'all', name: 'All Branches', dept: 'ALL' },
  // B.Sc. branches
  { id: 'it', name: 'B.Sc. IT', fullName: 'B.Sc. Information Technology', dept: 'BSC' },
  { id: 'chemistry', name: 'B.Sc. Chemistry', fullName: 'B.Sc. Chemistry', dept: 'BSC' },
  { id: 'physics', name: 'B.Sc. Physics', fullName: 'B.Sc. Physics', dept: 'BSC' },
  { id: 'maths', name: 'B.Sc. Mathematics', fullName: 'B.Sc. Mathematics', dept: 'BSC' },
  { id: 'geography', name: 'B.Sc. Geography', fullName: 'B.Sc. Geography', dept: 'BSC' },
  { id: 'psychology', name: 'B.Sc. Psychology', fullName: 'B.Sc. Psychology', dept: 'BSC' },
  // B.Com. branches
  { id: 'bcom-finance', name: 'B.Com. Finance', fullName: 'B.Com. Finance', dept: 'BCOM' },
  { id: 'bcom-professional', name: 'B.Com. Professional', fullName: 'B.Com. Professional', dept: 'BCOM' },
  // Gear
  { id: 'gear', name: 'Lab Gear & Calculators', fullName: 'Calculators & Kits', dept: 'GEAR' }
];

export const SEMESTERS = [
  'All Sems',
  'Sem 1',
  'Sem 2',
  'Sem 3',
  'Sem 4',
  'Sem 5',
  'Sem 6',
  'Sem 7',
  'Sem 8'
];

// Exact Fair-Pricing Rule (Inverted by Book Health)
// Like New: 25%, Good & Average: 30%, Usable: 35%, Bad: 40%
export const BOOK_CONDITIONS = [
  {
    id: 1,
    name: 'Like New',
    discountPercent: 25,
    desc: 'Crisp pages, zero tears or pen marks. Almost untouched.',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    id: 2,
    name: 'Good',
    discountPercent: 30,
    desc: 'Light wear, clean highlighter or pencil markings.',
    badgeClass: 'bg-teal-500/10 text-teal-300 border-teal-500/20'
  },
  {
    id: 3,
    name: 'Average',
    discountPercent: 30,
    desc: 'Moderate cover wear, key exam points highlighted.',
    badgeClass: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
  },
  {
    id: 4,
    name: 'Usable',
    discountPercent: 35,
    desc: 'Noticeable creases, well-studied, complete intact pages.',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
  },
  {
    id: 5,
    name: 'Bad (Still can be used)',
    discountPercent: 40,
    desc: 'Heavy wear or taped spine, 100% readable text & diagrams.',
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/20'
  }
];

export const INITIAL_BOOKS = [];

export const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    title: 'Cost & Management Accounting (Sem 3)',
    branchName: 'B.Com. Finance',
    semester: 'Sem 3',
    maxBudget: 400,
    studentName: 'Vikram Joshi',
    phone: '919822334455',
    notes: 'Need book for upcoming midsem exam. OK with pencil markings.',
    postedTime: '1 hour ago'
  },
  {
    id: 'req-2',
    title: 'Electrodynamics (4th Edition)',
    branchName: 'B.Sc. Physics',
    semester: 'Sem 4',
    maxBudget: 350,
    studentName: 'Tushar K.',
    phone: '919822334455',
    notes: 'Urgent for next week semester classes.',
    postedTime: '2 hours ago'
  },
  {
    id: 'req-3',
    title: 'White Lab Apron (Size Large) + Safety Goggles',
    branchName: 'B.Sc. Chemistry',
    semester: 'Sem 1',
    maxBudget: 200,
    studentName: 'Farhan A.',
    phone: '919833445566',
    notes: 'Starting practicals on Monday. Need by Saturday.',
    postedTime: '4 hours ago'
  }
];
