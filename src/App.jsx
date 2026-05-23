import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, User, Users, TrendingUp, LogOut } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // 🎯 Simpan user di dalam state

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    window.location.href = '/login';
  };

  // 🎯 UBAH DI APP.JSX KAMU GANS:
  useEffect(() => {
    // 1. Ambil session mentah dari localStorage
    const savedSession = localStorage.getItem('user_session');
    if (!savedSession) return;

    const userSession = JSON.parse(savedSession);

    // 🚀 SAKLAR PENGAMAN: Jika telegram_id tidak ada, JANGAN MENEMBAK API!
    if (!userSession || !userSession.telegram_id) {
      console.error("⚠️ ID Telegram tidak ditemukan di session gans!");
      return;
    }

    // 2. Jika lolos pengaman, baru hantam fetch data real gans!
    fetch(`${API_BASE_URL}/api/dashboard/stats?telegram_id=${userSession.telegram_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 'success') {
          setData(resData);
        }
      })
      .catch((err) => console.error('❌ Gagal memuat data bento real:', err));
  }, []);

  // Tampilkan layar loading pelindung selama sesi atau data database sedang ditarik
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#121214] flex flex-col gap-3 items-center justify-center text-white font-black tracking-wider uppercase text-sm">
        <div className="w-8 h-8 border-4 border-[#FFDE4D] border-t-transparent rounded-full animate-spin"></div>
        ⚡ Membuka Brankas Database PostgreSQL...
      </div>
    );
  }

  const stats = data || { balance: 0, totalIncome: 0, totalExpense: 0, transactions: [], walletName: 'Dompet Utama', isShared: false };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Math.abs(angka));
  };

  return (
    <div className="min-h-screen bg-[#121214] text-slate-100 p-6 font-sans selection:bg-[#FFDE4D] selection:text-black">

      {/* HEADER NAVBAR */}
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center bg-[#1E1E24] border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000000] rounded-xl">
        <div className="flex items-center gap-2">
          <span className="bg-[#FFDE4D] text-black font-black px-3 py-1 text-xl border-2 border-black tracking-wider uppercase rounded-md">C$</span>
          <h1 className="text-2xl font-black tracking-tight">CatatCuan<span className="text-[#FFDE4D]">.dev</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 border-2 border-black rounded-lg">
            <User className="w-5 h-5 text-[#FFDE4D]" />
            <span className="font-bold text-sm tracking-wide">{user.first_name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-[#FF4A4A] border-2 border-black rounded-lg text-white shadow-[2px_2px_0px_0px_#000000] cursor-pointer hover:translate-y-0.5 active:shadow-none"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* BENTO GRID LAYOUT */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* BOX 1: REAL BALANCE */}
        <div className="md:col-span-2 bg-[#1E1E24] border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Total Balance ({stats.walletName})</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Rp {stats.balance.toLocaleString('id-ID')}
              </h2>
            </div>
            <div className="bg-[#FFDE4D] text-black p-3 border-2 border-black shadow-[2px_2px_0px_0px_#000000] rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="bg-[#38E54D] text-black font-black text-xs px-3 py-1.5 border-2 border-black rounded-lg flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> Real-time Sync
            </span>
            <span className="bg-black/50 text-slate-300 font-bold text-xs px-3 py-1.5 border border-slate-700 rounded-lg flex items-center gap-1.5">
              {stats.isShared ? <Users className="w-4 h-4 text-[#FFDE4D]" /> : <User className="w-4 h-4 text-[#FFDE4D]" />}
              {stats.isShared ? 'Dompet Bersama' : 'Dompet Pribadi'}
            </span>
          </div>
        </div>

        {/* BOX 2: AI INSIGHTS */}
        <div className="bg-[#FFDE4D] text-black border-4 border-black p-6 rounded-2xl shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 font-black uppercase tracking-wider text-xs mb-3 bg-black/10 w-fit px-2 py-0.5 rounded border border-black">
              <TrendingUp className="w-3.5 h-3.5" /> AI Financial Status
            </div>
            <p className="font-extrabold text-lg leading-snug">
              {stats.balance < 50000
                ? `"Waduh gans, dompetmu lagi kritis! Stop dulu top-up robux atau jajan yang tidak perlu ya."`
                : `"Kondisi keuanganmu aman terkendali. Pertahankan ritme pencatatan ini, Fahri!"`}
            </p>
          </div>
          <p className="text-xs font-bold text-black/60 mt-4">— AI Advisor Bot</p>
        </div>

        {/* BOX 3: INCOME BOX REAL */}
        <div className="bg-[#242A24] border-4 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000000] flex items-center gap-4">
          <div className="bg-[#38E54D] text-black p-2.5 border-2 border-black rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Income</p>
            <p className="text-xl font-black text-[#38E54D]">{formatRupiah(stats.totalIncome)}</p>
          </div>
        </div>

        {/* BOX 4: EXPENSE BOX REAL */}
        <div className="bg-[#2A2424] border-4 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000000] flex items-center gap-4">
          <div className="bg-[#FF4A4A] text-white p-2.5 border-2 border-black rounded-xl">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Expense</p>
            <p className="text-xl font-black text-[#FF4A4A]">{formatRupiah(stats.totalExpense)}</p>
          </div>
        </div>

        {/* BOX 5: SERVER DETAILS */}
        <div className="bg-[#1E1E24] border-4 border-black p-5 rounded-2xl shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
          <div>
            <h4 className="font-black text-sm text-white">Database Node</h4>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">// Ubuntu Asus Server</p>
          </div>
          <span className="bg-black text-[#38E54D] text-xs font-mono px-2.5 py-1 border border-slate-800 rounded-md">
            CONNECTED
          </span>
        </div>

      </main>

      {/* LIVE FEED TRANSAKSI POSTGRESQL */}
      <section className="max-w-6xl mx-auto mt-10">
        <h3 className="text-xl font-black tracking-tight mb-4 uppercase text-slate-300">// Live Feed Transaksi PostgreSQL</h3>
        <div className="bg-[#1E1E24] border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_#000000] overflow-hidden">

          {stats.transactions.length === 0 ? (
            <div className="p-8 text-center font-bold text-slate-500 uppercase tracking-wider text-sm">
              Belum ada riwayat transaksi. Ketik sesuatu di Bot Telegram untuk mengisi gans!
            </div>
          ) : (
            stats.transactions.map((tx, index) => {
              const isPemasukan = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className={`p-4 flex justify-between items-center ${index !== stats.transactions.length - 1 ? 'border-b-2 border-black' : ''} ${index % 2 === 0 ? 'bg-black/10' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${isPemasukan ? 'bg-[#38E54D]' : 'bg-[#FF4A4A]'}`}></span>
                    <div>
                      <p className="font-black text-sm text-white">{tx.description}</p>
                      <p className="text-xs text-slate-500 font-bold">
                        Kategori: {tx.category} • {new Date(tx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-black text-sm ${isPemasukan ? 'text-[#38E54D]' : 'text-[#FF4A4A]'}`}>
                    {isPemasukan ? '+' : '-'} {formatRupiah(tx.amount)}
                  </span>
                </div>
              );
            })
          )}

        </div>
      </section>

    </div>
  );
}