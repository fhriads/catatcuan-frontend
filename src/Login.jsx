import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.catatcuan.biz.id';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Silakan masukkan nama pengguna Telegram Anda.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/request-otp`, {
        username: username.trim()
      });

      if (response.data.success) {
        setSuccessMsg('Kode verifikasi OTP telah dikirimkan ke akun Telegram Anda.');
        setStep(2);
      } else {
        setError(response.data.message || 'Gagal memproses permintaan OTP.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Nama pengguna tidak ditemukan. Pastikan Anda telah mengaktifkan bot.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setError('Silakan masukkan 6-digit kode OTP Anda.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        username: username.trim(),
        otp: otpCode.trim()
      });

      const resData = response.data;
      if (resData.success && resData.token) {
        localStorage.setItem('token', resData.token);
        localStorage.setItem('user', JSON.stringify(resData.user));
        navigate('/dashboard');
      } else {
        setError(resData.message || 'Kode OTP tidak valid atau telah kedaluwarsa.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal melakukan verifikasi otentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F7FA] text-[#1E293B] flex flex-col justify-center items-center p-4 font-sans selection:bg-[#74C7ED]">

      {/* CARD OTENTIKASI */}
      <div className="w-full max-w-md bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_#000000] rounded-xl transition-all">

        {/* BRAND HEADER */}
        <div className="text-center mb-8">
          <span className="font-black text-2xl tracking-tight uppercase block">
            Catat<span className="bg-[#229ED9] text-white px-2 border-2 border-black rounded-md ml-1 shadow-[2px_2px_0px_0px_#000000]">Cuan</span>
          </span>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3">
            // Secure Gateway Authentication
          </p>
        </div>

        {/* NOTIFIKASI SYSTEM */}
        {error && (
          <div className="mb-6 p-4 bg-[#FF6B6B] text-black border-2 border-black rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_#000000]">
            Peringatan: {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-[#6BCB77] text-black border-2 border-black rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_#000000]">
            Sistem: {successMsg}
          </div>
        )}

        {/* STEP 1: INPUT USERNAME */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="block text-black font-black uppercase text-xs tracking-wider mb-2">
                Nama Pengguna Telegram
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-black text-gray-400 text-base">
                  @
                </span>
                <input
                  type="text"
                  placeholder="username_anda"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-black rounded-lg text-black font-bold placeholder-gray-400 focus:outline-none focus:border-[#229ED9] transition-colors"
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-2">
                *Inisialisasi akun memerlukan perintah /start pada bot resmi.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#229ED9] text-white font-black uppercase text-xs tracking-wider border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000000] cursor-pointer hover:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Memproses Permintaan...' : 'Minta Kode OTP'}
            </button>
          </form>
        )}

        {/* STEP 2: INPUT KODE OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-black font-black uppercase text-xs tracking-wider mb-2">
                6-Digit Kode Keamanan
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white border-2 border-black rounded-lg text-black font-black text-center text-xl tracking-[0.4em] focus:outline-none focus:border-[#74C7ED] transition-colors"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-[9px] font-bold text-gray-400">
                  Masa Berlaku Sesi: 24 Jam
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[10px] font-black text-black underline bg-[#74C7ED] px-2 py-0.5 border-2 border-black rounded shadow-[1px_1px_0px_0px_#000000]"
                >
                  Ubah Pengguna
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#74C7ED] text-black font-black uppercase text-xs tracking-wider border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_#000000] cursor-pointer hover:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? 'Memverifikasi Otentikasi...' : 'Verifikasi & Akses Masuk'}
            </button>
          </form>
        )}

      </div>

      {/* FOOTER METRIC */}
      <div className="mt-8 text-center">
        <span className="bg-black text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#229ED9]">
          CatatCuan Financial Technology Ecosystem © 2026
        </span>
      </div>
    </div>
  );
};

export default Login;