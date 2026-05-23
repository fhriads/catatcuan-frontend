import React, { useEffect, useState, useRef } from 'react';

// Mengambil URL Ngrok dari env Vercel, fallback ke localhost jika dev lokal
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function LoginVerify() {
  const [statusMessage, setStatusMessage] = useState('Memvalidasi token keamanan...');
  
  // 🎯 SAKELAR PENGUNCI UTAMA: Mencegah variabel dicari tapi undefined, serta memblokir double fetch
  const isVerifying = useRef(false);

  useEffect(() => {
    // 🚀 BENTENG PERTAHANAN: Jika sedang memverifikasi, batalkan tembakan kedua dari React Strict Mode
    if (isVerifying.current) return;

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (!token) {
      setStatusMessage('⚠️ Token tidak ditemukan gans!');
      setTimeout(() => { window.location.href = '/login'; }, 1500);
      return;
    }

    // Kunci sakelar menjadi true tepat SEBELUM fetch dijalankan
    isVerifying.current = true;
    setStatusMessage('Memvalidasi token keamanan...');

    // Tembak verifikasi token JWT ke Backend Server Asus via jembatan Ngrok
    fetch(`${API_BASE_URL}/api/auth/verify?token=${token}`, {
      headers: {
        'Content-Type': 'application/json',
        // 🔑 SAKLAR PENJEBOL INTERSEPTOR NGROK: Melewati halaman warning gratisan ngrok
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Token sudah hangus atau invalid gans!');
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 'success' && resData.user) {
          setStatusMessage('✅ Otentikasi Berhasil! Menyinkronkan dashboard...');
          
          // Simpan sesi login user ke browser lokal secara bersih
          localStorage.setItem('user_session', JSON.stringify(resData.user));
          
          // Beri jeda tipis 500ms agar proses penulisan localStorage selesai sempurna
          setTimeout(() => {
            window.location.replace('/dashboard');
          }, 500);
        } else {
          setStatusMessage('❌ Link login sudah kedaluwarsa atau tidak valid gans!');
          setTimeout(() => { window.location.href = '/login'; }, 2000);
        }
      })
      .catch((err) => {
        console.error('❌ Eror Verifikasi Token:', err);
        
        // 🛡️ EMERGENCY GUARD: Jika tembakan pertama sebenarnya sudah sukses menulis session,
        // jangan biarkan kegagalan tembakan kedua dari React merusak alur redirect dashboard!
        if (localStorage.getItem('user_session')) {
          window.location.replace('/dashboard');
        } else {
          setStatusMessage('❌ Gagal terhubung ke server otentikasi.');
          setTimeout(() => { window.location.href = '/login'; }, 2000);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#121214] flex flex-col gap-4 items-center justify-center text-white font-sans p-4">
      {/* Spinner Loading Animasi Kuning Bento UI */}
      <div className="w-10 h-10 border-4 border-[#FFDE4D] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-sm tracking-wide uppercase bg-[#1E1E24] border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
        ⚡ {statusMessage}
      </p>
    </div>
  );
}