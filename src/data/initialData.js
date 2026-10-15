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

export const INITIAL_BOOKS = [
  {
    id: 'hmx-1',
    title: 'Operating System Concepts (10th Edition)',
    branchId: 'it',
    branchName: 'B.Sc. IT',
    dept: 'BSC',
    semester: 'Sem 3',
    originalPrice: 850,
    conditionId: 1,
    condition: 'Like New',
    discountPercent: 25,
    price: 638, // 850 - 25%
    conditionNotes: 'All pages intact. Important CPU scheduling algorithms marked neatly with yellow highlighter.',
    sellerName: 'Anshif',
    sellerYear: '3rd Year B.Sc. IT',
    sellerPhone: '919876543210',
    meetupLocation: 'Science Block Canteen or Central Library',
    meetupTime: 'Available Mon-Fri after 2:30 PM',
    postedTime: '2 hours ago',
    views: 34
  },
  {
    id: 'hmx-2',
    title: 'Principles of Physical Chemistry',
    branchId: 'chemistry',
    branchName: 'B.Sc. Chemistry',
    dept: 'BSC',
    semester: 'Sem 3',
    originalPrice: 800,
    conditionId: 2,
    condition: 'Good',
    discountPercent: 30,
    price: 560, // 800 - 30%
    conditionNotes: 'Carefully preserved in cover. Zero pen scribbles on theory sections.',
    sellerName: 'Amanpreet Singh',
    sellerYear: 'Final Year Senior',
    sellerPhone: '919812345678',
    meetupLocation: 'Boys Hostel 2 / Main Chemistry Lab Gate',
    meetupTime: 'Available anytime after 4:00 PM',
    postedTime: '5 hours ago',
    views: 48
  },
  {
    id: 'hmx-bcom-1',
    title: 'Financial Accounting & Corporate Reporting',
    branchId: 'bcom-finance',
    branchName: 'B.Com. Finance',
    dept: 'BCOM',
    semester: 'Sem 2',
    originalPrice: 700,
    conditionId: 1,
    condition: 'Like New',
    discountPercent: 25,
    price: 525, // 700 - 25%
    conditionNotes: 'Ledger and balance sheet formats cleanly indexed with bookmarks.',
    sellerName: 'Sanjay Nair',
    sellerYear: '3rd Year B.Com. Finance',
    sellerPhone: '919877665544',
    meetupLocation: 'Commerce Block Ground Floor Quad',
    meetupTime: '1:00 PM - 2:00 PM (Lunch break)',
    postedTime: '1 hour ago',
    views: 52
  },
  {
    id: 'hmx-bcom-2',
    title: 'Corporate Law & Professional Governance',
    branchId: 'bcom-professional',
    branchName: 'B.Com. Professional',
    dept: 'BCOM',
    semester: 'Sem 3',
    originalPrice: 750,
    conditionId: 3,
    condition: 'Average',
    discountPercent: 30,
    price: 525, // 750 - 30%
    conditionNotes: 'Companies Act sections highlighted with key case laws noted on blank margins.',
    sellerName: 'Megha Iyer',
    sellerYear: 'Final Year B.Com.',
    sellerPhone: '919866554433',
    meetupLocation: 'Central Library Commerce Section',
    meetupTime: 'Mon, Wed, Fri 3:30 PM',
    postedTime: '3 hours ago',
    views: 39
  },
  {
    id: 'hmx-3',
    title: 'Concepts of Modern Physics (6th Edition)',
    branchId: 'physics',
    branchName: 'B.Sc. Physics',
    dept: 'BSC',
    semester: 'Sem 3',
    originalPrice: 650,
    conditionId: 2,
    condition: 'Good',
    discountPercent: 30,
    price: 455, // 650 - 30%
    conditionNotes: 'Quantum mechanics chapters have solved numericals in margins.',
    sellerName: 'Priya Sharma',
    sellerYear: '4th Sem Senior',
    sellerPhone: '919876501234',
    meetupLocation: 'Girls Hostel Common Room or Physics Dept',
    meetupTime: 'Between 1 PM to 2 PM (Lunch break)',
    postedTime: '1 day ago',
    views: 61
  },
  {
    id: 'hmx-4',
    title: 'Higher Algebra: Classical',
    branchId: 'maths',
    branchName: 'B.Sc. Mathematics',
    dept: 'BSC',
    semester: 'Sem 2',
    originalPrice: 500,
    conditionId: 4,
    condition: 'Usable',
    discountPercent: 35,
    price: 325, // 500 - 35%
    conditionNotes: 'Spine creased, polynomial equations and matrix proofs intact.',
    sellerName: 'Karan Mehra',
    sellerYear: '3rd Sem Senior',
    sellerPhone: '919800112233',
    meetupLocation: 'Central Library Reading Hall',
    meetupTime: 'Every day 11 AM - 3 PM',
    postedTime: '1 day ago',
    views: 29
  },
  {
    id: 'hmx-5',
    title: 'Physical Geography (Principles & Systems)',
    branchId: 'geography',
    branchName: 'B.Sc. Geography',
    dept: 'BSC',
    semester: 'Sem 1',
    originalPrice: 600,
    conditionId: 5,
    condition: 'Bad (Still can be used)',
    discountPercent: 40,
    price: 360, // 600 - 40%
    conditionNotes: 'Cover has tape on edge, all geomorphology diagrams and maps are completely readable.',
    sellerName: 'Neha Verma',
    sellerYear: '2nd Year Student',
    sellerPhone: '919871122334',
    meetupLocation: 'Arts & Geography Block 1st Floor',
    meetupTime: 'Mon, Wed, Fri around 3 PM',
    postedTime: '3 hours ago',
    views: 52
  },
  {
    id: 'hmx-6',
    title: 'Introduction to Psychology (7th Edition)',
    branchId: 'psychology',
    branchName: 'B.Sc. Psychology',
    dept: 'BSC',
    semester: 'Sem 1',
    originalPrice: 900,
    conditionId: 1,
    condition: 'Like New',
    discountPercent: 25,
    price: 675, // 900 - 25%
    conditionNotes: 'Hardcover edition. Very well maintained, no torn pages.',
    sellerName: 'Ananya Roy',
    sellerYear: '3rd Sem Student',
    sellerPhone: '919899887766',
    meetupLocation: 'Main Auditorium Steps or Psychology Lab',
    meetupTime: 'Tuesdays & Thursdays 12:30 PM',
    postedTime: '6 hours ago',
    views: 74
  },
  {
    id: 'hmx-8',
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    branchId: 'gear',
    branchName: 'Lab Gear & Calculators',
    dept: 'GEAR',
    semester: 'Sem 1',
    originalPrice: 1500,
    conditionId: 1,
    condition: 'Like New',
    discountPercent: 25,
    price: 1125, // 1500 - 25%
    conditionNotes: '100% working condition with solar panel and original slide-on hard case.',
    sellerName: 'Siddharth R.',
    sellerYear: 'Passed Out Senior',
    sellerPhone: '919855667788',
    meetupLocation: 'Campus Main Gate / Nescafe Kiosk',
    meetupTime: 'Evenings 5:00 PM',
    postedTime: '30 mins ago',
    views: 89
  }
];

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
