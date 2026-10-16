export const DEPARTMENTS = {
  BSC: {
    id: 'BSC',
    name: 'B.Sc. (Science)',
    subBranches: [
      { id: 'bsc', name: 'B.Sc.', fullName: 'B.Sc. (Science)' }
    ]
  },
  BCOM: {
    id: 'BCOM',
    name: 'B.Com. (Commerce)',
    subBranches: [
      { id: 'bcom', name: 'B.Com.', fullName: 'B.Com. (Commerce)' }
    ]
  }
};

export const BRANCHES = [
  { id: 'all', name: 'All Courses', dept: 'ALL' },
  { id: 'bsc', name: 'B.Sc.', fullName: 'B.Sc. (Science)', dept: 'BSC' },
  { id: 'bcom', name: 'B.Com.', fullName: 'B.Com. (Commerce)', dept: 'BCOM' }
];

// Prescribed common textbook catalog with MRP
export const SYLLABUS_CATALOG = {
  BSC: {
    malayalam: {
      'Sem 1': { title: 'മലയാള സാഹിത്യാസ്വാദനം', mrp: 100 },
      'Sem 2': { title: 'വിനിമയ മലയാളവും ശാസ്ത്രരചനയും', mrp: 120 },
      'Sem 3': { title: 'കേരളസമൂഹവും ശാസ്ത്രജ്ഞാനപാരമ്പര്യവും', mrp: 130 }
    },
    english: {
      'Sem 1': { title: 'english language skill for science', mrp: 75 },
      'Sem 2': { title: 'advanced english language for science', mrp: 80 },
      'Sem 3': { title: 'literary and cultural narratives for science', mrp: 80 }
    }
  }
};

export const SEMESTERS = [
  'All Sems',
  'Sem 1',
  'Sem 2',
  'Sem 3'
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
