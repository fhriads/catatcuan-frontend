import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleRequestLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Tembak API Backend ke server laptop Asus (Port 5000)
      // Ganti localhost ke IP Asus-mu jika mengakses antar-device asli harian
      const response = await fetch('http://192.168.1.7:5000/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '🚀 Magic Link dikirim! Cek Telegram-mu gans.' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal terhubung ke server backend Asus.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121214] flex items-center justify-center p-4 text-white">
      <div className="bg-[#1E1E24] border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000000] max-w-sm w-full">
        <h2 className="text-3xl font-black mb-2 tracking-tight">Login <span className="text-[#FFDE4D]">CatatCuan</span></h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">// Passwordless Magic Link via Telegram</p>
        
        <form onSubmit={handleRequestLink} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wide text-slate-300 mb-2">Username Telegram</label>
            <input 
              type="text" 
              placeholder="contoh: @username_kamu" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-black/50 border-2 border-slate-700 rounded-xl font-bold focus:border-[#FFDE4D] focus:outline-none transition-colors text-slate-100"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FFDE4D] text-black font-black p-3 border-3 border-black shadow-[4px_4px_0px_0px_#000000] rounded-xl hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Mengirim pesan...' : '⚡ Kirim Magic Link'}
          </button>
        </form>

        {message.text && (
          <div className={`mt-6 p-3 border-2 border-black rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_#000000] ${message.type === 'success' ? 'bg-[#242A24] text-[#38E54D]' : 'bg-[#2A2424] text-[#FF4A4A]'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}