import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownRight, User, TrendingUp, LogOut, Server, Activity } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.catatcuan.biz.id';

export default function App() {
  const navigate = useNavigate();

  // State manajemen dashboard terpadu gans
  const [stats, setStats] = useState({ total_income: 0, total_expense: 0 });
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      localStorage.clear();
      navigate('/login');
      return;
    }

    setUser(JSON.parse(savedUser));

    fetch(`${API_BASE_URL}/api/dashboard/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then((res) => {
        if (res.status === 401) throw new Error('Sesi Expired');
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
        console.error('❌ Error:', err.message);
        localStorage.clear();
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col gap-4 items-center justify-center text-[#E2E8F0] font-mono p-6">
        <div className="w-12 h-12 border-4 border-[#2D3748] border-t-[#38BDF8] animate-spin shadow-[4px_4px_0px_0px_#000000]"></div>
        <p className="font-black uppercase text-[10px] tracking-[0.3em] text-[#64748B]">Initializing Secure Environment...</p>
      </div>
    );
  }

  const balance = stats.total_income - stats.total_expense;
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Math.abs(angka));
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E2E8F0] p-4 md:p-8 font-sans selection:bg-[#38BDF8] selection:text-white">

      {/* 🌌 BACKGROUND OVERLAY (SUBTLE DOT GRID) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* 👑 HEADER: DARK ELEVATED NAVBAR */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center bg-[#1A1A1A] border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000000] gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#38BDF8] text-black font-black px-3 py-1 text-2xl border-2 border-black shadow-[2px_2px_0px_0px_#000000]">C$</span>
            <h1 className="text-xl font-black tracking-widest uppercase italic">Catat<span className="text-[#38BDF8]">Cuan</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#2D3748] px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
              <span className="font-bold text-xs uppercase tracking-tighter">@{user.username}</span>
            </div>
            <button onClick={handleLogout} className="p-2.5 bg-[#E11D48] border-2 border-black text-white shadow-[3px_3px_0px_0px_#000000] hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 🍱 DARK BENTO GRID SYSTEM */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* BOX 1: MAIN BALANCE (Muted Teal Theme) */}
          <div className="md:col-span-2 bg-[#1A1A1A] border-4 border-black p-8 shadow-[10px_10px_0px_0px_#000000] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8] opacity-[0.03] rounded-full -mr-16 -mt-16 group-hover:opacity-[0.07] transition-opacity"></div>

            <p className="text-[#64748B] font-black uppercase tracking-[0.2em] text-[10px] mb-4">// CURRENT NET WORTH</p>
            <h2 className={`text-4xl md:text-6xl font-black tracking-tighter ${balance >= 0 ? 'text-white' : 'text-[#FB7185]'}`}>
              {balance < 0 ? '-' : ''}{formatRupiah(balance)}
            </h2>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-[#1E293B] border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000000]">
                <Activity className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[10px] font-black uppercase tracking-widest">PostgreSQL Active</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1E293B] border-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000000]">
                <Server className="w-4 h-4 text-[#10B981]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Gateway</span>
              </div>
            </div>
          </div>

          {/* BOX 2: AI ADVISOR (Darkened Amber Theme) */}
          <div className="bg-[#1A1A1A] border-4 border-[#D4AF37] p-6 shadow-[8px_8px_0px_0px_#000000] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-[#D4AF37] text-black w-fit px-2 py-1 font-black text-[9px] uppercase border border-black">
                <TrendingUp className="w-3 h-3" /> AI FINANCIAL ANALYST
              </div>
              <p className="font-bold text-lg leading-relaxed text-[#D1D5DB]">
                {balance < 50000
                  ? `"Warning gans! Cashflow menipis. Segera kurangi pengeluaran impulsif sebelum saldo mencapai kritikal!"`
                  : `"Stabilitas keuangan terjaga. Tetap disiplin mencatat transaksi via Telegram untuk akurasi dashboard."`}
              </p>
            </div>
            <span className="text-[9px] font-black text-[#4B5563] tracking-[0.3em] uppercase">// Gemini-2.5-Flash</span>
          </div>

          {/* BOX 3: INCOME CARD */}
          <div className="bg-[#1A1A1A] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000000] flex items-center gap-5 group">
            <div className="bg-[#064E3B] text-[#10B981] p-3 border-2 border-black group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mb-1">TOTAL INCOME</p>
              <p className="text-xl font-black text-[#10B981]">{formatRupiah(stats.total_income)}</p>
            </div>
          </div>

          {/* BOX 4: EXPENSE CARD */}
          <div className="bg-[#1A1A1A] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000000] flex items-center gap-5 group">
            <div className="bg-[#4C0519] text-[#FB7185] p-3 border-2 border-black group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <p className="text-[#64748B] text-[9px] font-black uppercase tracking-widest mb-1">TOTAL EXPENSE</p>
              <p className="text-xl font-black text-[#FB7185]">{formatRupiah(stats.total_expense)}</p>
            </div>
          </div>

          {/* BOX 5: SERVER METRICS */}
          <div className="bg-[#1A1A1A] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000000] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-[#2D3748]">
                <Server className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-[#64748B] uppercase">Node Instance</p>
                <p className="text-xs font-black text-white uppercase tracking-tighter">Asus-Ubuntu-Live</p>
              </div>
            </div>
            <div className="px-2 py-1 bg-[#064E3B] border border-[#10B981] text-[#10B981] text-[8px] font-black animate-pulse">STABLE</div>
          </div>

        </main>

        {/* 📜 TRANSACTION FEED (DARK TABLE) */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-4 w-1 bg-[#38BDF8]"></div>
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#64748B]">POSTGRESQL_LIVE_QUERY_RESULTS</h3>
          </div>

          <div className="bg-[#1A1A1A] border-4 border-black shadow-[10px_10px_0px_0px_#000000] overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-16 text-center text-[#4B5563] font-black uppercase text-[10px] tracking-widest">
                // No transaction data detected in the vault //
              </div>
            ) : (
              transactions.map((tx, index) => {
                const isIncome = tx.type === 'income';
                return (
                  <div key={tx.id || index} className={`p-5 flex justify-between items-center border-black ${index !== transactions.length - 1 ? 'border-b-4' : ''} hover:bg-[#242424] transition-colors group`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-2 h-2 rounded-full ${isIncome ? 'bg-[#10B981]' : 'bg-[#FB7185]'} shadow-[0_0_8px_rgba(16,185,129,0.4)]`}></div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-tight text-[#E2E8F0] group-hover:text-[#38BDF8] transition-colors">{tx.description || 'System Entry'}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[8px] font-black px-1.5 py-0.5 bg-black border border-[#2D3748] text-[#94A3B8] uppercase">{tx.category || 'GENERAL'}</span>
                          <span className="text-[8px] font-bold text-[#4B5563] uppercase italic">{new Date(tx.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB</span>
                        </div>
                      </div>
                    </div>
                    <div className={`font-black text-sm px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000000] ${isIncome ? 'bg-[#064E3B] text-[#10B981]' : 'bg-[#4C0519] text-[#FB7185]'}`}>
                      {isIncome ? '+' : '-'} {formatRupiah(tx.nominal || tx.amount)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 🏷️ FOOTER TAG */}
        <footer className="mt-16 mb-8 text-center">
          <div className="inline-block border-2 border-[#2D3748] px-4 py-2 bg-[#1A1A1A] shadow-[4px_4px_0px_0px_#000000]">
            <p className="text-[9px] font-black text-[#64748B] uppercase tracking-[0.5em]">
              Dev Platform by <span className="text-[#38BDF8]">DISSZ DEV</span> • Dr. Soetomo University 2026
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}