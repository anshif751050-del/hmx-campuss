import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import SellBookModal from './components/SellBookModal';
import RequestBoard from './components/RequestBoard';
import MyListingsDashboard from './components/MyListingsDashboard';
import LoginPage from './components/LoginPage';
import { INITIAL_BOOKS, INITIAL_REQUESTS, BRANCHES, BOOK_CONDITIONS } from './data/initialData';
import { Sparkles, ArrowRight, BookOpen, RefreshCw, ShieldCheck, Lock, UserCheck, TrendingUp } from 'lucide-react';
import BottomNav from './components/BottomNav';
import { sound } from './utils/sound';
import { supabase } from './utils/supabase';

// Helper to convert snake_case DB row to camelCase App object
const rowToBook = (row) => ({
  id: row.id,
  title: row.title,
  branchId: row.branch_id,
  branchName: row.branch_name,
  dept: row.dept,
  semester: row.semester,
  originalPrice: Number(row.original_price),
  conditionId: Number(row.condition_id),
  condition: row.condition,
  discountPercent: Number(row.discount_percent),
  price: Number(row.price),
  isDonation: Boolean(row.is_donation),
  status: row.status || 'available',
  conditionNotes: row.condition_notes,
  sellerName: row.seller_name,
  sellerYear: row.seller_year,
  sellerPhone: row.seller_phone,
  meetupLocation: row.meetup_location,
  meetupTime: row.meetup_time,
  postedTime: row.posted_time || 'Recently',
  views: Number(row.views || 1),
  createdAt: row.created_at
});

// Helper to convert App book object to snake_case DB row
const bookToRow = (book) => ({
  id: book.id,
  title: book.title,
  branch_id: book.branchId,
  branch_name: book.branchName,
  dept: book.dept,
  semester: book.semester,
  original_price: book.originalPrice,
  condition_id: book.conditionId,
  condition: book.condition,
  discount_percent: book.discountPercent,
  price: book.price,
  is_donation: Boolean(book.isDonation),
  status: book.status || 'available',
  condition_notes: book.conditionNotes,
  seller_name: book.sellerName,
  seller_year: book.sellerYear,
  seller_phone: book.sellerPhone,
  meetup_location: book.meetupLocation,
  meetup_time: book.meetupTime,
  posted_time: book.postedTime || 'Just now',
  views: book.views || 1
});

const rowToRequest = (row) => ({
  id: row.id,
  title: row.title,
  branchName: row.branch_name,
  semester: row.semester,
  maxBudget: Number(row.max_budget || 0),
  studentName: row.student_name,
  phone: row.phone,
  notes: row.notes,
  postedTime: 'Recently'
});

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hmx_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('hmx_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('hmx_theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hmx_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hmx_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    sound.playClick();
    setDarkMode(prev => !prev);
  };

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('hmx_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // 1. Initial Cloud Sync + Seed Demo Books into Supabase if DB is empty
  useEffect(() => {
    const syncCloudData = async () => {
      try {
        // Query Books
        const { data: cloudBooks, error: booksError } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (!booksError && cloudBooks) {
          const mapped = cloudBooks.map(rowToBook);
          setBooks(mapped);
          localStorage.setItem('hmx_books', JSON.stringify(mapped));
        }

        // Query Requests
        const { data: cloudReqs, error: reqsError } = await supabase
          .from('requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!reqsError && cloudReqs) {
          if (cloudReqs.length > 0) {
            const mappedReqs = cloudReqs.map(rowToRequest);
            setRequests(mappedReqs);
            localStorage.setItem('hmx_requests', JSON.stringify(mappedReqs));
          } else {
            // Seed initial requests
            const seedReqRows = INITIAL_REQUESTS.map(r => ({
              id: r.id,
              title: r.title,
              branch_name: r.branchName,
              semester: r.semester,
              max_budget: r.maxBudget,
              student_name: r.studentName,
              phone: r.phone,
              notes: r.notes
            }));
            await supabase.from('requests').insert(seedReqRows);
          }
        }
      } catch (err) {
        console.warn('Initial cloud sync error:', err);
      }
    };

    syncCloudData();
  }, []);

  // 2. Realtime Subscriptions (Broadcast updates across all devices in real-time)
  useEffect(() => {
    const channel = supabase
      .channel('hmx-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newBook = rowToBook(payload.new);
          setBooks((prev) => {
            if (prev.some(b => b.id === newBook.id)) return prev;
            return [newBook, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          const updatedBook = rowToBook(payload.new);
          setBooks((prev) => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
        } else if (payload.eventType === 'DELETE') {
          const deletedId = payload.old.id;
          setBooks((prev) => prev.filter(b => b.id !== deletedId));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newReq = rowToRequest(payload.new);
          setRequests((prev) => {
            if (prev.some(r => r.id === newReq.id)) return prev;
            return [newReq, ...prev];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Local backup persistence
  useEffect(() => {
    localStorage.setItem('hmx_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('hmx_requests', JSON.stringify(requests));
  }, [requests]);

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    localStorage.setItem('hmx_user', JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hmx_user');
  };

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedSem, setSelectedSem] = useState('All Sems');
  const [conditionFilter, setConditionFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('explore');

  // Modals
  const [inspectingBook, setInspectingBook] = useState(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Filter computation
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesBranch = book.branchName.toLowerCase().includes(query);
        const matchesSem = book.semester.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBranch && !matchesSem) return false;
      }

      if (selectedDept !== 'ALL' && book.dept && book.dept !== selectedDept) {
        return false;
      }

      if (selectedBranch !== 'all' && book.branchId !== selectedBranch) {
        return false;
      }

      if (selectedSem !== 'All Sems' && book.semester !== selectedSem) {
        return false;
      }

      if (conditionFilter && book.condition !== conditionFilter) {
        return false;
      }

      return true;
    });
  }, [books, searchTerm, selectedDept, selectedBranch, selectedSem, conditionFilter]);

  const handleBookAdded = async (newBook) => {
    // 1. Optimistic UI update
    setBooks([newBook, ...books]);

    // 2. Persist to Supabase cloud
    try {
      const row = bookToRow(newBook);
      const { error } = await supabase.from('books').insert([row]);
      if (error) {
        console.warn('Supabase book insert error:', error.message);
      }
    } catch (err) {
      console.warn('Failed to insert book into cloud:', err);
    }
  };

  const handleUpdateBookStatus = async (bookId, newStatus) => {
    // 1. Optimistic UI update
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: newStatus } : b))
    );

    // 2. Persist to Supabase cloud
    try {
      const { error } = await supabase
        .from('books')
        .update({ status: newStatus })
        .eq('id', bookId);
      if (error) {
        console.warn('Supabase status update error:', error.message);
      }
    } catch (err) {
      console.warn('Failed to update status in cloud:', err);
    }
  };

  const handleDeleteBook = async (bookId) => {
    // 1. Optimistic UI update
    setBooks((prev) => prev.filter((b) => b.id !== bookId));

    // 2. Delete from Supabase cloud
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);
      if (error) {
        console.warn('Supabase delete error:', error.message);
      }
    } catch (err) {
      console.warn('Failed to delete book in cloud:', err);
    }
  };

  const myBooksCount = useMemo(() => {
    if (!currentUser) return 0;
    const cleanUserPhone = (currentUser.phone || '').replace(/\D/g, '');
    return books.filter((b) => {
      const cleanBookPhone = (b.sellerPhone || '').replace(/\D/g, '');
      return (cleanUserPhone && cleanBookPhone === cleanUserPhone) ||
             (b.sellerName && b.sellerName.toLowerCase() === currentUser.name.toLowerCase());
    }).length;
  }, [books, currentUser]);

  const handleRequestAdded = async (newReq) => {
    // 1. Optimistic UI update
    setRequests([newReq, ...requests]);

    // 2. Persist to Supabase cloud
    try {
      const { error } = await supabase.from('requests').insert([{
        id: newReq.id,
        title: newReq.title,
        branch_name: newReq.branchName,
        semester: newReq.semester,
        max_budget: newReq.maxBudget,
        student_name: newReq.studentName,
        phone: newReq.phone,
        notes: newReq.notes
      }]);
      if (error) {
        console.warn('Supabase request insert error:', error.message);
      }
    } catch (err) {
      console.warn('Failed to insert request into cloud:', err);
    }
  };

  const resetFilters = () => {
    sound.playClick();
    setSelectedDept('ALL');
    setSelectedBranch('all');
    setSelectedSem('All Sems');
    setConditionFilter(null);
    setSearchTerm('');
  };

  // Mandatory Login Gate
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900 selection:bg-[#D4EBD8] selection:text-emerald-950 flex flex-col font-sans">
      
      {/* 1. Sticky Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        totalBooksCount={books.length}
        myBooksCount={myBooksCount}
        currentUser={currentUser}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6 flex-1 w-full">
        
        {/* 2. Hero Section with Fair-Pricing Highlights (Explore Tab only) */}
        {activeTab === 'explore' && (
          <section className="mb-6 pt-2 pb-6 border-b border-slate-200/80 dark:border-emerald-950/60">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Fair-Priced Senior-to-Junior Exchange</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                Senior passed out? <br />
                <span className="text-emerald-600 dark:text-emerald-400">
                  Fixed fair prices. Zero price gouging.
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Selling prices are automatically locked based on book condition: <strong>Like New (25% OFF)</strong>, <strong>Good & Average (30% OFF)</strong>, <strong>Usable (35% OFF)</strong>, and <strong>Bad (40% OFF)</strong>.
              </p>

              {/* Logged in Welcome Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#16231a] border border-slate-200 dark:border-[#203a27] text-xs text-slate-700 dark:text-slate-200 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Logged in as <strong>{currentUser.name}</strong> ({currentUser.branchName} • {currentUser.semester})</span>
              </div>
            </div>

            {/* Quick Pricing Rule Card (Porcelain) */}
            <div className="bg-white dark:bg-[#121c15] p-4 rounded-3xl lg:w-96 space-y-2.5 border border-slate-200 dark:border-[#1e3323] shadow-sm">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-[#1e3323] pb-2">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Automated Fair Pricing Rules
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">Locked MRP</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#18261d] border border-slate-100 dark:border-[#213828] flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">1. Like New</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">25% OFF</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#18261d] border border-slate-100 dark:border-[#213828] flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">2. Good</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">30% OFF</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#18261d] border border-slate-100 dark:border-[#213828] flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">3. Average</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">30% OFF</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#18261d] border border-slate-100 dark:border-[#213828] flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">4. Usable</span>
                  <span className="font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">35% OFF</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#18261d] border border-slate-100 dark:border-[#213828] flex items-center justify-between text-[11px]">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">5. Bad (Still usable)</span>
                <span className="font-black text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">40% OFF</span>
              </div>
            </div>
          </div>
        </section>
      )}

        {/* 3. Main Views */}
        {activeTab === 'explore' && (
          <div>
            {/* Filter Bar with Glass Buttons */}
            <FilterBar
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              selectedSem={selectedSem}
              setSelectedSem={setSelectedSem}
              selectedDept={selectedDept}
              setSelectedDept={setSelectedDept}
              conditionFilter={conditionFilter}
              setConditionFilter={setConditionFilter}
            />

            {/* Books Feed Header */}
            <div className="flex items-center justify-between pt-4 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Available Textbooks</h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">({filteredBooks.length} items found)</span>
              </div>

              {(selectedDept !== 'ALL' || selectedBranch !== 'all' || selectedSem !== 'All Sems' || conditionFilter || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="btn-glass px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>

            {/* Books Grid (Porcelain Floating Cards) */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onInspect={(b) => setInspectingBook(b)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="card-porcelain my-8 py-16 px-6 rounded-3xl text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#D4EBD8]/50 dark:bg-[#1a3821] text-emerald-800 dark:text-emerald-300 mx-auto flex items-center justify-center border border-[#b8dfbe] dark:border-[#275932]">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                    {books.length === 0 ? "No Textbooks Listed Yet" : "No books match your selection"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    {books.length === 0 
                      ? "Be the first senior to list your passed-out textbooks! Lock condition and prices fairly in 30 seconds."
                      : "Try switching semester or department filters, or check the Junior Wishlist."}
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  {books.length === 0 ? (
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsSellModalOpen(true);
                      }}
                      className="btn-emerald px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2"
                    >
                      <span>+ List Your First Book</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={resetFilters}
                        className="btn-glass px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Reset All Filters
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setActiveTab('requests');
                        }}
                        className="btn-emerald px-4 py-2 rounded-xl font-bold text-xs"
                      >
                        Check Wishlist
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Junior Wishlist Tab */}
        {activeTab === 'requests' && (
          <RequestBoard
            requests={requests}
            onRequestAdded={handleRequestAdded}
          />
        )}

        {/* Seller My Books Dashboard Tab */}
        {activeTab === 'my-listings' && (
          <MyListingsDashboard
            books={books}
            currentUser={currentUser}
            onUpdateBookStatus={handleUpdateBookStatus}
            onDeleteBook={handleDeleteBook}
            onOpenSellModal={() => setIsSellModalOpen(true)}
          />
        )}

      </main>

      {/* 4. Modals */}
      {inspectingBook && (
        <BookDetailModal
          book={inspectingBook}
          onClose={() => setInspectingBook(null)}
        />
      )}

      {isSellModalOpen && (
        <SellBookModal
          onClose={() => setIsSellModalOpen(false)}
          onBookAdded={handleBookAdded}
          currentUser={currentUser}
          onOpenAuthModal={() => {}}
        />
      )}

      {/* 5. Mobile App Bottom Navigation (Visible on mobile screens) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        totalBooksCount={books.length}
        myBooksCount={myBooksCount}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* 6. Clean Footer */}
      <footer className="mt-16 border-t border-slate-200/80 dark:border-emerald-950/60 py-8 text-center text-xs text-slate-500 dark:text-slate-400 mb-16 md:mb-0 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-slate-100">HMX</span>
            <span>• College Textbook & Academic Exchange</span>
          </div>
          <p>
            Fair pricing locked by book condition • B.Sc. & B.Com. faculties • 0 courier fees.
          </p>
        </div>
      </footer>

    </div>
  );
}
