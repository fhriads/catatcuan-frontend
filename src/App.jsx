import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownRight, User, TrendingUp, LogOut, Server, Activity } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.catatcuan.biz.id';

export default function App() {
  const navigate = useNavigate();

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
      .finally(() => setLoading(false));
  }, [navigate]);

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

  return (
    <div className="min-h-screen bg-[#0E1621] text-[#E2E8F0] p-4 md:p-8 font-sans selection:bg-[#229ED9] selection:text-white">

      {/* BACKGROUND MATRIKS */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADER NAVBAR */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-center bg-[#17212B] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000] gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#229ED9] text-white font-black px-2.5 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000000] text-xl rounded">C$</span>
            <h1 className="text-lg font-black tracking-widest uppercase">Catat<span className="text-[#229ED9]">Cuan</span></h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#202B36] px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
              <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
              <span className="font-bold text-xs uppercase tracking-tighter">Sesi: @{user.username}</span>
            </div>
            <button onClick={handleLogout} className="p-2.5 bg-[#E11D48] border-2 border-black text-white shadow-[2px_2px_0px_0px_#000000] hover:translate-y-0.5 active:shadow-none transition-all cursor-pointer" title="Keluar Sesi">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BENTO GRID ANALYTICS */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* BOX 1: TOTAL SALDO BERSIH */}
          <div className="md:col-span-2 bg-[#17212B] border-2 border-black p-6 shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
            <p className="text-gray-500 font-black uppercase tracking-wider text-[9px] mb-3">// TOTAL SALDO BERSIH</p>
            <h2 className={`text-3xl md:text-5xl font-black tracking-tighter ${balance >= 0 ? 'text-white' : 'text-[#FB7185]'}`}>
              {balance < 0 ? '-' : ''}{formatRupiah(balance)}
            </h2>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[#202B36] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000000]">
                <Activity className="w-3.5 h-3.5 text-[#229ED9]" />
                <span className="text-[9px] font-bold uppercase tracking-wide">Database Sync Active</span>
              </div>
              <div className="flex items-center gap-2 bg-[#202B36] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000000]">
                <Server className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[9px] font-bold uppercase tracking-wide">SSL Secure Connection</span>
              </div>
            </div>
          </div>

          {/* BOX 2: SUMMARY METRIC AUTO */}
          <div className="bg-[#17212B] border-2 border-[#D4AF37] p-6 shadow-[6px_6px_0px_0px_#000000] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-[#D4AF37] text-black w-fit px-2 py-0.5 font-black text-[9px] uppercase border border-black">
                <TrendingUp className="w-3 h-3" /> ANALISIS FINANSIAL OTOMATIS
              </div>
              <p className="font-medium text-xs leading-relaxed text-gray-300">
                {balance < 50000
                  ? "Arus kas Anda terdeteksi mendekati ambang batas minimum harian. Disarankan untuk meninjau kembali daftar pengeluaran operasional non-esensial."
                  : "Struktur retensi keuangan Anda berada dalam parameter stabil. Pertahankan konsistensi pencatatan guna akurasi proyeksi bulanan."}
              </p>
            </div>
            <span className="text-[8px] font-black text-gray-600 tracking-wider uppercase">// Automated System Insight</span>
          </div>

          {/* BOX 3: TOTAL PEMASUKAN */}
          <div className="bg-[#17212B] border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-4">
            <div className="bg-[#064E3B] text-[#10B981] p-2 border-2 border-black">
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">TOTAL PEMASUKAN</p>
              <p className="text-lg font-black text-[#10B981]">{formatRupiah(stats.total_income)}</p>
            </div>
          </div>

          {/* BOX 4: TOTAL PENGELUARAN */}
          <div className="bg-[#17212B] border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] flex items-center gap-4">
            <div className="bg-[#4C0519] text-[#FB7185] p-2 border-2 border-black">
              <ArrowDownRight className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">TOTAL PENGELUARAN</p>
              <p className="text-lg font-black text-[#FB7185]">{formatRupiah(stats.total_expense)}</p>
            </div>
          </div>

          {/* BOX 5: CORE ENVIRONMENT PERFORMANCE */}
          <div className="bg-[#17212B] border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-[#202B36]">
                <Server className="w-4 h-4 text-[#229ED9]" />
              </div>
              <div>
                <p className="text-[8px] font-black text-gray-500 uppercase">Environment</p>
                <p className="text-xs font-bold text-white uppercase tracking-tight">Production-Node-Live</p>
              </div>
            </div>
            <div className="px-1.5 py-0.5 bg-[#064E3B] border border-[#10B981] text-[#10B981] text-[8px] font-bold">STABLE</div>
          </div>

        </main>

        {/* RIWAYAT MUTASI */}
        <section className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-1 bg-[#229ED9]"></div>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">RIWAYAT MUTASI KAS MASUK & KELUAR</h3>
          </div>

          <div className="bg-[#17212B] border-2 border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-gray-600 font-bold uppercase text-xs tracking-wide">
                // Tidak ada rekaman transaksi terdeteksi dalam database //
              </div>
            ) : (
              transactions.map((tx, index) => {
                const isIncome = tx.type === 'income';
                return (
                  <div key={tx.id || index} className={`p-4 flex justify-between items-center border-black ${index !== transactions.length - 1 ? 'border-b-2' : ''} hover:bg-[#202B36] transition-colors`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${isIncome ? 'bg-[#10B981]' : 'bg-[#FB7185]'}`}></div>
                      <div>
                        <p className="font-bold text-xs uppercase tracking-tight text-[#E2E8F0]">{tx.description || 'System Entry'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] font-black px-1 py-0.2 bg-black border border-gray-700 text-gray-400 uppercase">{tx.category || 'GENERAL'}</span>
                          <span className="text-[8px] font-bold text-gray-600 uppercase italic">{new Date(tx.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} WIB</span>
                        </div>
                      </div>
                    </div>
                    <div className={`font-black text-xs px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] ${isIncome ? 'bg-[#064E3B] text-[#10B981]' : 'bg-[#4C0519] text-[#FB7185]'}`}>
                      {isIncome ? '+' : '-'} {formatRupiah(tx.nominal || tx.amount)}
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
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
              CatatCuan Analytics Deployment Engine Platform • All Rights Reserved © 2026
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}