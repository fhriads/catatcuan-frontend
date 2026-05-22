import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

export default function LoginVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('⚠️ Token otentikasi tidak ditemukan di URL gans!');
      return;
    }

    // Tembak ke server Asus untuk validasi JWT token-nya
    fetch(`http://192.168.1.7:5000/api/auth/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Token kedaluwarsa atau tidak valid!');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          // Simpan data user ke localStorage browser sebagai penanda sudah login
          localStorage.setItem('user_session', JSON.stringify(data.user));
          
          // Alihkan halaman langsung ke Dashboard utama setelah sukses
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      })
      .catch((err) => {
        setError(err.message || 'Gagal melakukan verifikasi ke server.');
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#121214] flex items-center justify-center p-4 text-white">
      <div className="bg-[#1E1E24] border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000000] max-w-sm w-full text-center">
        {!error ? (
          <div className="space-y-4">
            <RefreshCw className="w-12 h-12 text-[#FFDE4D] animate-spin mx-auto" />
            <h3 className="text-xl font-black tracking-tight">Memvalidasi Akun...</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">// Menghubungkan sesi Telegram ke laptop ROG</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#2A2424] text-[#FF4A4A] p-4 border-2 border-black rounded-xl font-bold text-sm shadow-[4px_4px_0px_0px_#000000]">
              {error}
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="mt-2 bg-white text-black font-black text-xs px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000] rounded-lg cursor-pointer"
            >
              Kembali ke Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}