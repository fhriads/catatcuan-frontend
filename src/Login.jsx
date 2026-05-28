import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  // State Autentikasi gans
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: Username, Step 2: OTP

  // State UI Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 📡 AKSI 1: Request OTP 24 Jam via Telegram Bot
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
      const response = await axios.post('https://api.catatcuan.biz.id/api/auth/request-otp', {
        username: username.trim()
      });

      if (response.data.success) {
        setSuccessMsg('KODE OTP MELUNCUR! Cek chat personal bot Telegram-mu gans! 🔐');
        setStep(2);
      } else {
        setError(response.data.message || 'Gagal meracik OTP gans.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Username tidak ditemukan! Ketik /start dulu di bot gans.');
    } finally {
      setLoading(false);
    }
  };

  // 🔐 AKSI 2: Validasi OTP & Kunci Session Permanen
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
        localStorage.setItem('token', resData.token);
        localStorage.setItem('user', JSON.stringify(resData.user));
        navigate('/dashboard');
      } else {
        setError(resData.message || 'Kode OTP salah atau sudah kedaluwarsa gans!');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal jabat tangan OTP. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black flex flex-col justify-center items-center p-4 font-sans selection:bg-[#FFDE4D]">

      {/* 🍱 CARD UTAMA: MENGIKUTI BAHASA DESAIN GAMBAR NOMOR 2 */}
      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000] rounded-xl transition-all">

        {/* HEADER BRANDING: BANNER KUNING KHAS CATATCUAN */}
        <div className="text-center mb-8">
          <span className="font-black text-2xl md:text-3xl tracking-tighter uppercase block">
            💳 CATAT<span className="bg-[#FFDE4D] px-2 border-2 border-black rounded-md ml-1 shadow-[2px_2px_0px_0px_#000000]">CUAN</span>
          </span>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-3">
            // SECURE OTP GATEWAY v2.0
          </p>
        </div>

        {/* ALERTS NOTIFIKASI */}
        {error && (
          <div className="mb-6 p-4 bg-[#FF6B6B] border-2 border-black rounded-xl font-black uppercase text-xs shadow-[3px_3px_0px_0px_#000000]">
            💥 ERROR: {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-[#6BCB77] border-2 border-black rounded-xl font-black uppercase text-xs shadow-[3px_3px_0px_0px_#000000]">
            🎉 SUCCESS: {successMsg}
          </div>
        )}

        {/* 🎬 STEP 1: FORM INPUT USERNAME TELEGRAM */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-black font-black uppercase text-xs tracking-wider mb-2">
                Masukkan Username Telegram gans:
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-black text-black text-base">
                  @
                </span>
                <input
                  type="text"
                  placeholder="username_kamu (tanpa @)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-4 bg-white border-2 border-black rounded-xl text-black font-extrabold placeholder-gray-400 focus:outline-none focus:border-[#FFDE4D] transition-colors"
                />
              </div>
              <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase">
                *Pastikan kamu sudah mengetik /start di bot Telegram.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFDE4D] text-black font-black uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] cursor-pointer hover:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? '⚡ MERACIK OTP...' : '🚀 REQUEST OTP CODE'}
            </button>
          </form>
        )}

        {/* 🎬 STEP 2: FORM INPUT KODE OTP 6-DIGIT */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-black font-black uppercase text-xs tracking-wider mb-2">
                Masukkan 6-Digit OTP Keamanan:
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-black font-black text-center text-2xl tracking-[0.4em] focus:outline-none focus:border-[#4D96FF] transition-colors"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  *VALID FOR 24 HOURS
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-black text-black underline bg-[#FFDE4D] px-2 py-0.5 border-2 border-black rounded-md uppercase tracking-wider shadow-[1px_1px_0px_0px_#000000]"
                >
                  [ UBAH USER ]
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#4D96FF] text-black font-black uppercase tracking-wider border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] cursor-pointer hover:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? '🔐 VERIFYING...' : '🔓 ACCESS DASHBOARD'}
            </button>
          </form>
        )}

      </div>

      {/* FOOTER EMBLEM BARU SINKRON 100% */}
      <div className="mt-8 text-center">
        <span className="bg-[#6BCB77] text-[10px] font-black tracking-widest uppercase px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000000]">
          🔥 BY DISSZ DEV — GENERASI ANTI BONCOS
        </span>
      </div>
    </div>
  );
};

export default Login;