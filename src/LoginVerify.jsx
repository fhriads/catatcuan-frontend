import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function LoginVerify() {
  const [statusMessage, setStatusMessage] = useState('Memvalidasi token keamanan...');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (!token) {
      setStatusMessage('⚠️ Token tidak ditemukan gans!');
      setTimeout(() => { window.location.href = '/login'; }, 2000);
      return;
    }

    // Tembak verifikasi ke backend dengan header khusus bypass warning Ngrok
    fetch(`${API_BASE_URL}/api/auth/verify?token=${token}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 'success') {
          setStatusMessage('✅ Otentikasi Berhasil! Menyinkronkan dashboard...');
          localStorage.setItem('user_session', JSON.stringify(resData.user));
          setTimeout(() => { window.location.href = '/'; }, 1500);
        } else {
          setStatusMessage('❌ Link login sudah kedaluwarsa atau tidak valid gans!');
          setTimeout(() => { window.location.href = '/login'; }, 2000);
        }
      })
      .catch((err) => {
        console.error('❌ Eror Verifikasi Token:', err);
        setStatusMessage('❌ Gagal terhubung ke server otentikasi.');
        setTimeout(() => { window.location.href = '/login'; }, 2000);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#121214] flex flex-col gap-4 items-center justify-center text-white font-sans p-4">
      <div className="w-10 h-10 border-4 border-[#FFDE4D] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-sm tracking-wide uppercase bg-[#1E1E24] border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_#000000]">
        ⚡ {statusMessage}
      </p>
    </div>
  );
}