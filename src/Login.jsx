import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  
  // State Autentikasi gans
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: Input Username, Step 2: Input OTP
  
  // State UI Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 📡 AKSI 1: Minta Kode OTP 24 Jam ke Telegram Bot
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Isi username Telegram-mu dulu gans!');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Menembak endpoint OTP terpadu yang kita buat di server Asus tadi gans
      const response = await axios.post('https://api.catatcuan.biz.id/api/auth/request-otp', {
        username: username.trim()
      });

      if (response.data.success) {
        setSuccessMsg('KODE OTP meluncur! Cek chat bot Telegram-mu gans! 🔐');
        setStep(2); // Lolos maju ke step input OTP
      } else {
        setError(response.data.message || 'Gagal meracik OTP gans.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Username belum terdaftar! Ketik /start dulu di bot gans.');
    } finally {
      setLoading(false);
    }
  };

  // 🔐 AKSI 2: Validasi OTP & Kunci Session Permanen (Persistent Session)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setError('Masukkan 6-digit kode OTP-mu gans!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://api.catatcuan.biz.id/api/auth/verify-otp', {
        username: username.trim(),
        otp: otpCode.trim()
      });

      const resData = response.data;
      if (resData.success && resData.token) {
        // 🔥 AMUNISI SAKRAL: Kunci token permanen di browser HP OnePlus / Laptop-mu gans!
        localStorage.setItem('token', resData.token);
        localStorage.setItem('user', JSON.stringify(resData.user));
        
        // Hancurkan rintangan, langsung jebol masuk dashboard visual Bento UI!
        navigate('/dashboard');
      } else {
        setError(resData.message || 'Kode OTP salah atau sudah kedaluwarsa gans!');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal jabat tangan OTP. Coba minta kode baru.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0F172A] flex flex-col justify-center items-center p-6 font-sans transition-colors duration-300">
      
      {/* 💳 CARD UTAMA STYLE NEO-BRUTALISM DISSZ DEV */}
      <div className="w-full max-w-md bg-white dark:bg-[#1E293B] border-4 border-black dark:border-[#38BDF8] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(56,189,248,0.2)] rounded-xl transition-all">
        
        {/* BRANDING LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tight uppercase">
            Catat<span className="text-[#10B981] dark:text-[#34D399]">Cuan</span>
          </h1>
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">
            Secure OTP Web Authentication Gateway
          </p>
        </div>

        {/* NOTIFIKASI ERROR / SUKSES STYLE NEO-BRUTALISM */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-950/50 border-2 border-black dark:border-red-500 text-red-700 dark:text-red-400 font-bold rounded-lg text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            💥 {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-100 dark:bg-emerald-950/50 border-2 border-black dark:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            🎉 {successMsg}
          </div>
        )}

        {/* 🎬 STEP 1: FORM INPUT USERNAME TELEGRAM */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-black dark:text-white font-black uppercase text-sm tracking-wider mb-2">
                Telegram Username gans:
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-black text-black dark:text-gray-400 text-lg">
                  @
                </span>
                <input
                  type="text"
                  placeholder="fahri_ads (tanpa tanda @)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F172A] border-3 border-black dark:border-gray-700 text-black dark:text-white font-bold rounded-lg focus:outline-none focus:border-[#10B981] dark:focus:border-[#34D399] transition-all text-base"
                />
              </div>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-2">
                *Pastikan kamu sudah mengetik /start di bot Telegram CatatCuan.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#10B981] hover:bg-[#059669] text-black font-black uppercase tracking-wider border-3 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? '⚡ Sedang Meracik OTP...' : '🚀 Ambil Kode OTP'}
            </button>
          </form>
        )}

        {/* 🎬 STEP 2: FORM INPUT KODE OTP 6-DIGIT */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-black dark:text-white font-black uppercase text-sm tracking-wider mb-2">
                Masukkan 6-Digit OTP Keamanan:
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="Ex: 582910"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0F172A] border-3 border-black dark:border-gray-700 text-black dark:text-white font-black rounded-lg focus:outline-none focus:border-[#38BDF8] tracking-[0.5em] text-center text-2xl transition-all"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                  *Berlaku 1x24 jam di browser ini gans.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-black text-[#38BDF8] hover:underline uppercase tracking-wider"
                >
                  ← Ganti Username
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black uppercase tracking-wider border-3 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? '🔐 Memverifikasi...' : '🔓 Masuk Dashboard'}
            </button>
          </form>
        )}

      </div>

      {/* FOOTER EMBLEM DISSZ DEV */}
      <div className="mt-8 text-xs font-bold text-gray-400 dark:text-gray-600 tracking-widest uppercase">
        © 2026 DISSZ DEV • Crafted for Dr. Soetomo University Project
      </div>
    </div>
  );
};

export default Login;