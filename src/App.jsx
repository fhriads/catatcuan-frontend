import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, ArrowDownRight, LogOut, Server, Activity,
  Search, Download, TrendingUp, PieChart, RefreshCw, Trash2, Plus
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.catatcuan.biz.id';

export default function App() {
  const navigate = useNavigate();

  // STATE MANAGEMENT
  const [stats, setStats] = useState({ total_income: 0, total_expense: 0 });
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [insightTab, setInsightTab] = useState('tips');
  const [isSyncing, setIsSyncing] = useState(false);

  // 🎯 NEW STATE: DYNAMIC WISHLIST (PERSISTED VIA LOCALSTORAGE)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('dissz_wishlist');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Cube Gaming Byzantium Casing', target: 1500000 }
    ];
  });
  const [newWishName, setNewWishName] = useState('');
  const [newWishTarget, setNewWishTarget] = useState('');

  const BUDGET_LIMIT = 3000000;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchData = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      localStorage.clear();
      navigate('/login');
      return;
    }

    setUser(JSON.parse(savedUser));
    setIsSyncing(true);

    fetch(`${API_BASE_URL}/api/dashboard/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401) throw new Error('Session Expired');
        return res.json();
      })
      .then((resData) => {
        if (resData.success) {
          setStats({
            total_income: Number(resData.stats?.total_income || 0),
            total_expense: Number(resData.stats?.total_expense || 0)
          });
          setTransactions(resData.transactions || []);
        }
      })
      .catch((err) => {
        console.error('❌ Data Fetch Error:', err.message);
        localStorage.clear();
        navigate('/login');
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setIsSyncing(false), 600);
      });
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // FUNGSI AKSI: HAPUS TRANSAKSI DARI DASHBOARD
  const handleDeleteTransaction = (txId) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Yakin mau hapus transaksi ini dari database utama bray?')) return;

    fetch(`${API_BASE_URL}/api/transactions/${txId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchData(); // Ambil data teranyar pasca-delete
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error('❌ Delete Error:', err));
  };

  // FUNGSI AKSI WISHLIST MANAJEMEN
  const handleAddWishlist = (e) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishTarget) return;

    const updatedWish = [
      ...wishlist,
      { id: Date.now(), name: newWishName.trim(), target: Number(newWishTarget) }
    ];
    setWishlist(updatedWish);
    localStorage.setItem('dissz_wishlist', JSON.stringify(updatedWish));
    setNewWishName('');
    setNewWishTarget('');
  };

  const handleRemoveWishlist = (id) => {
    const updatedWish = wishlist.filter(item => item.id !== id);
    setWishlist(updatedWish);
    localStorage.setItem('dissz_wishlist', JSON.stringify(updatedWish));
  };

  // PROSES KOMPUTASI DATA
  const categoryBreakdown = useMemo(() => {
    const initial = { 'FOOD & BEVERAGE': 0, 'TRANSPORTATION': 0, 'SHOPPING': 0, 'BILLS': 0, 'ENTERTAINMENT': 0, 'OTHERS': 0 };
    transactions.forEach(tx => {
      if (tx.type === 'expense' && initial[tx.category] !== undefined) {
        initial[tx.category] += Number(tx.nominal);
      } else if (tx.type === 'expense') {
        initial['OTHERS'] += Number(tx.nominal);
      }
    });
    return initial;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) || tx.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || tx.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchQuery, selectedCategory]);

  const exportToCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'Tipe', 'Nominal', 'Kategori', 'Deskripsi', 'Tanggal'];
    const rows = transactions.map(tx => [tx.id, tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran', tx.nominal, tx.category, tx.description, new Date(tx.created_at).toLocaleString('id-ID')]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${user?.username}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0E1621] flex flex-col gap-4 items-center justify-center text-[#E2E8F0] font-mono p-6">
        <div className="w-10 h-10 border-2 border-black border-t-[#229ED9] animate-spin shadow-[3px_3px_0px_0px_#000000]"></div>
        <p className="font-bold uppercase text-[9px] tracking-[0.2em] text-gray-500">Securing Environment Session...</p>
      </div>
    );
  }

  const balance = stats.total_income - stats.total_expense;
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Math.abs(angka));
  };

  const budgetPercentage = Math.min(Math.round((stats.total_expense / BUDGET_LIMIT) * 100), 100);
  const getBudgetColor = () => {
    if (budgetPercentage < 50) return 'bg-[#10B981]';
    if (budgetPercentage < 80) return 'bg-[#D4AF37]';
    return 'bg-[#FB7185] animate-pulse';
  };

  return (
    <div className="min-h-screen bg-[#0E1621] text-[#E2E8F0] p-4 md:p-8 font-sans selection:bg-[#229ED9] selection:text-white">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER NAVBAR */}
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center bg-[#17212B] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#229ED9] text-white font-black px-2.5 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000000] text-xl rounded">C$</span>
            <h1 className="text-lg font-black tracking-widest uppercase">Catat<span className="text-[#229ED9]">Cuan</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#202B36] px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
              <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-spin' : 'bg-[#10B981]'}`}></div>
              <span className="font-bold text-xs uppercase tracking-tighter">Sesi: @{user.username}</span>
            </div>
            <button onClick={handleLogout} className="p-2.5 bg-[#E11D48] border-2 border-black text-white shadow-[2px_2px_0px_0px_#000000] hover:translate-y-0.5 transition-all cursor-pointer">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BENTO GRID */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

          {/* BOX 1: SALDO */}
          <div className="grid-cols-1 md:col-span-2 bg-[#17212B] border-2 border-black p-6 md:p-8 shadow-[4px_4px_0px_0px_#000000] relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div>
              <p className="text-gray-500 font-black uppercase tracking-wider text-[9px] mb-2">// TOTAL SALDO BERSIH</p>
              <h2 className={`text-3xl md:text-5xl font-black tracking-tighter ${balance >= 0 ? 'text-white' : 'text-[#FB7185]'}`}>
                {balance < 0 ? '-' : ''}{formatRupiah(balance)}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-1.5 bg-[#202B36] border border-black px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wide"><Activity className="w-3.5 h-3.5 text-[#229ED9]" /> Sync Active</div>
              <div className="flex items-center gap-1.5 bg-[#202B36] border border-black px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wide"><Server className="w-3.5 h-3.5 text-[#10B981]" /> Core Node Live</div>
            </div>
          </div>

          {/* BOX 2: CONTROL */}
          <div className="grid-cols-1 md:col-span-1 bg-[#17212B] border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
            <div>
              <p className="text-gray-500 font-black uppercase tracking-wider text-[9px]">// ENGINE UTILITY CONTROL</p>
              <h4 className="text-xs font-black text-gray-300 mt-1 uppercase tracking-tight">DISSZ DEV Core System v2.1</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={exportToCSV} disabled={transactions.length === 0} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-black font-black text-[10px] uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40"><Download className="w-3.5 h-3.5" /> Export</button>
              <button onClick={fetchData} disabled={isSyncing} className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#229ED9] text-white font-black text-[10px] uppercase border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-y-0.5 active:shadow-none transition-all"><RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} /> Sync</button>
            </div>
          </div>

          {/* BOX 3: BUDGET */}
          <div className="grid-cols-1 md:col-span-1 bg-[#17212B] border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-500 font-black uppercase tracking-wider text-[9px]">// AMBANG BATAS BUDGET</p>
                <span className="text-[9px] font-black text-white bg-[#202B36] px-1.5 py-0.5 border border-black">{budgetPercentage}%</span>
              </div>
              <h3 className="text-base md:text-lg font-black text-white tracking-tight">{formatRupiah(stats.total_expense)} <span className="text-[10px] font-bold text-gray-500">/ {formatRupiah(BUDGET_LIMIT)}</span></h3>
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-full h-3.5 bg-black border border-gray-800 p-0.5 rounded-sm">
                <div className={`h-full ${getBudgetColor()} transition-all duration-500`} style={{ width: `${budgetPercentage}%` }}></div>
              </div>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">{budgetPercentage >= 100 ? "⚠️ Anggaran melewati batas!" : "Anggaran terpantau aman bray."}</p>
            </div>
          </div>

          {/* BOX 4: INSIGHTS */}
          <div className="grid-cols-1 md:col-span-2 bg-[#17212B] border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-3 mb-4 gap-2 w-full">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <p className="text-gray-500 font-black uppercase tracking-wider text-[9px]">// AI SMART INSIGHTS</p>
                </div>
                <div className="flex border border-black p-0.5 bg-black rounded-sm w-full sm:w-auto">
                  <button onClick={() => setInsightTab('tips')} className={`flex-1 sm:flex-none px-3 py-1 text-[9px] font-black uppercase transition-all ${insightTab === 'tips' ? 'bg-[#229ED9] text-white border border-black shadow-[1px_1px_0px_0px_#000000]' : 'text-gray-500'}`}>Tips Hemat</button>
                  <button onClick={() => setInsightTab('proyeksi')} className={`flex-1 sm:flex-none px-3 py-1 text-[9px] font-black uppercase transition-all ${insightTab === 'proyeksi' ? 'bg-[#229ED9] text-white border border-black shadow-[1px_1px_0px_0px_#000000]' : 'text-gray-500'}`}>Proyeksi Kas</button>
                </div>
              </div>
              <div className="min-h-[90px]">
                {insightTab === 'tips' ? (
                  <div className="space-y-1.5">
                    <div className="text-xs font-black text-white uppercase tracking-tight">📌 Rapor Distribusi Dana</div>
                    <p className="text-xs font-medium text-gray-300 leading-relaxed">{categoryBreakdown['FOOD & BEVERAGE'] > (stats.total_expense * 0.4) ? "Arus dana keluar didominasi sektor Food & Beverage (melebihi kuota aman 40%). Kurangi frekuensi jajan harian gans." : "Alokasi distribusi dana operasional Anda terpantau seimbang di seluruh sektor. Mantap!"}</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-xs font-black text-white uppercase tracking-tight">📈 Analisis Laju Retensi</div>
                    <p className="text-xs font-medium text-gray-300 leading-relaxed">{balance < 100000 ? "Peringatan: Selisih neraca kas berjalan Anda menipis bray. Berisiko menyentuh ambang batas kritis." : "Aman gans. Ketahanan struktur keuangan personal Anda diproyeksikan stabil untuk minggu ini."}</p>
                  </div>
                )}
              </div>
            </div>
            <span className="text-[8px] font-black text-gray-600 tracking-widest uppercase block mt-4">// Automated Cognitive Analytical System</span>
          </div>

          {/* BOX 5: CHART */}
          <div className="grid-cols-1 md:col-span-1 bg-[#17212B] border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-[#229ED9]" />
                <p className="text-gray-500 font-black uppercase tracking-wider text-[9px]">// KATEGORI CHART</p>
              </div>
              <div className="space-y-3">
                {Object.entries(categoryBreakdown).map(([cat, amount]) => {
                  const pct = stats.total_expense > 0 ? Math.round((amount / stats.total_expense) * 100) : 0;
                  const isSelected = selectedCategory === cat;
                  return (
                    <div key={cat} onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat)} className={`group cursor-pointer p-1.5 border transition-all ${isSelected ? 'bg-[#202B36] border-[#229ED9]' : 'border-transparent hover:bg-[#202B36]/50'}`}>
                      <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                        <span className={`uppercase tracking-tight ${isSelected ? 'text-[#229ED9]' : 'text-gray-300'}`}>{cat.replace(' & ', ' ')}</span>
                        <span className="font-mono text-gray-400">{formatRupiah(amount)} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                        <div className="h-full bg-[#229ED9] group-hover:bg-sky-400 transition-all" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedCategory !== 'ALL' && (
              <button onClick={() => setSelectedCategory('ALL')} className="mt-4 text-[8px] font-black text-[#FB7185] uppercase tracking-widest text-left hover:underline">❌ Reset Filter</button>
            )}
          </div>

          {/* 🔥 DYNAMIC COMPONENT: STATS & DYNAMIC WISHLIST SETUP */}
          <div className="grid-cols-1 md:col-span-2 flex flex-col gap-4 justify-between">

            {/* MINI STATS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#17212B] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-3 h-20">
                <div className="bg-[#064E3B] text-[#10B981] p-1.5 border border-black shrink-0"><ArrowUpRight className="w-4 h-4 stroke-[2.5]" /></div>
                <div className="overflow-hidden">
                  <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest truncate">PEMASUKAN</p>
                  <p className="text-sm md:text-base font-black text-[#10B981] truncate">{formatRupiah(stats.total_income)}</p>
                </div>
              </div>
              <div className="bg-[#17212B] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-3 h-20">
                <div className="bg-[#4C0519] text-[#FB7185] p-1.5 border border-black shrink-0"><ArrowDownRight className="w-4 h-4 stroke-[2.5]" /></div>
                <div className="overflow-hidden">
                  <p className="text-gray-500 text-[8px] font-black uppercase tracking-widest truncate">PENGELUARAN</p>
                  <p className="text-sm md:text-base font-black text-[#FB7185] truncate">{formatRupiah(stats.total_expense)}</p>
                </div>
              </div>
            </div>

            {/* 🛠️ INDEPENDENT WISHLIST MANAGEMENT (DYNAMIC UPDATES) */}
            <div className="bg-[#17212B] border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] flex-1 flex flex-col justify-between gap-4">
              <div>
                <p className="text-gray-500 font-black uppercase tracking-wider text-[9px] mb-3">// WISHLIST MANAGEMENT</p>

                {/* LIST BARANG IMPIAN */}
                <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                  {wishlist.map(item => {
                    const pct = Math.min(Math.round((Math.max(0, balance) / item.target) * 100), 100);
                    return (
                      <div key={item.id} className="group/item border border-transparent hover:border-gray-800 p-1 transition-colors">
                        <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                          <span className="text-gray-300 uppercase tracking-tight flex items-center gap-2">
                            🚀 {item.name}
                            <button onClick={() => handleRemoveWishlist(item.id)} className="opacity-0 group-hover/item:opacity-100 text-[#FB7185] hover:underline ml-1 font-black text-[8px]">Hapus</button>
                          </span>
                          <span className="font-mono text-gray-400">{formatRupiah(Math.max(0, balance))} / {formatRupiah(item.target)} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-black border border-gray-800 p-0.5 rounded-sm">
                          <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FORM TAMBAH ITEM BARU (SUTIKAN FITUR BARU) */}
              <form onSubmit={handleAddWishlist} className="flex flex-col sm:flex-row gap-2 border-t border-gray-800 pt-3">
                <input
                  type="text"
                  placeholder="Nama barang impian..."
                  value={newWishName}
                  onChange={(e) => setNewWishName(e.target.value)}
                  className="flex-1 bg-black border border-gray-800 px-2.5 py-1.5 text-[10px] font-bold focus:outline-none focus:border-[#229ED9]"
                />
                <input
                  type="number"
                  placeholder="Target harga (Rp)..."
                  value={newWishTarget}
                  onChange={(e) => setNewWishTarget(e.target.value)}
                  className="w-full sm:w-32 bg-black border border-gray-800 px-2.5 py-1.5 text-[10px] font-bold focus:outline-none focus:border-[#229ED9]"
                />
                <button type="submit" className="bg-white text-black font-black text-[9px] px-3 py-1.5 border border-black uppercase flex items-center justify-center gap-1 hover:bg-gray-200 cursor-pointer shadow-[1px_1px_0px_0px_#000000]">
                  <Plus className="w-3 h-3 stroke-[3]" /> Add Item
                </button>
              </form>
            </div>

          </div>
        </main>

        {/* 🔍 TABLE MUTASI DATA LISTING */}
        <section className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-1 bg-[#229ED9]"></div>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">RIWAYAT MUTASI KAS MASUK & KELUAR</h3>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><Search className="w-3.5 h-3.5" /></span>
              <input type="text" placeholder="Cari transaksi / kategori bray..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-[#17212B] border-2 border-black text-xs font-bold text-white placeholder-gray-500 focus:outline-none focus:border-[#229ED9] rounded shadow-[2px_2px_0px_0px_#000000] transition-colors" />
            </div>
          </div>

          <div className="bg-[#17212B] border-2 border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center text-gray-600 font-bold uppercase text-xs tracking-wide">// Tidak ada rekaman transaksi //</div>
            ) : (
              filteredTransactions.map((tx, index) => {
                const isIncome = tx.type === 'income';
                return (
                  <div key={tx.id || index} className={`p-4 flex flex-col sm:flex-row justify-between sm:items-center border-black ${index !== filteredTransactions.length - 1 ? 'border-b-2' : ''} hover:bg-[#202B36] transition-colors gap-2 group`}>
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 sm:mt-0 ${isIncome ? 'bg-[#10B981]' : 'bg-[#FB7185]'}`}></div>
                      <div>
                        <p className="font-bold text-xs uppercase tracking-tight text-[#E2E8F0]">{tx.description || 'System Entry'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] font-black px-1 py-0.2 bg-black border border-gray-700 text-gray-400 uppercase">{tx.category || 'GENERAL'}</span>
                          <span className="text-[8px] font-bold text-gray-600 uppercase italic">{new Date(tx.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB</span>
                        </div>
                      </div>
                    </div>

                    {/* ACCENT KONTROL: COMBINED NOMINAL + TRASH CAN DELETE BUTTON */}
                    <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="sm:opacity-0 group-hover:opacity-100 p-1.5 border border-transparent hover:border-gray-800 text-[#FB7185] hover:bg-black/40 rounded transition-all cursor-pointer"
                        title="Hapus Transaksi Permanen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className={`font-black text-xs px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] ${isIncome ? 'bg-[#064E3B] text-[#10B981]' : 'bg-[#4C0519] text-[#FB7185]'}`}>
                        {isIncome ? '+' : '-'} {formatRupiah(tx.nominal)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 mb-6 text-center">
          <div className="inline-block border-2 border-gray-800 px-3 py-1.5 bg-[#17212B] shadow-[2px_2px_0px_0px_#000000]">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">CatatCuan Analytics Platform • Developed by DISSZ DEV © 2026</p>
          </div>
        </footer>

      </div>
    </div>
  );
}