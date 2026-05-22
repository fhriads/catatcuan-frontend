import React, { useState } from 'react';
import { Send } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Login() {
  const [usernameTelegram, setUsernameTelegram] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameTelegram) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameTelegram }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessage({ type: 'success', text: '⚡ Magic Link berhasil dikirim! Silakan cek bot Telegram kamu gans.' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Gagal memproses authentication.' });
      }
    } catch (error) {
      console.error('❌ Eror Login:', error);
      setMessage({ type: 'error', text: 'Gagal terhubung ke server backend.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121214] flex items-center justify-center p-4 font-sans selection:bg-[#FFDE4D] selection:text-black">
      <div className="w-full max-w-md bg-[#1E1E24] border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_#000000]">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Login <span className="text-[#FFDE4D]">CatatCuan</span></h1>
          <p className="text-slate-500 font-mono text-xs tracking-wider">// PASSWORDLESS MAGIC LINK VIA TELEGRAM</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-300 font-black text-xs uppercase tracking-wider mb-2">
              Username Telegram
            </label>
            <input
              type="text"
              value={usernameTelegram}
              onChange={(e) => setUsernameTelegram(e.target.value)}
              placeholder="@username_kamu"
              disabled={loading}
              className="w-full bg-black/40 border-2 border-slate-700 rounded-xl p-4 text-white font-bold placeholder-slate-600 focus:outline-none focus:border-[#FFDE4D] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !usernameTelegram}
            className="w-full bg-[#FFDE4D] text-black font-black p-4 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center gap-2 cursor-pointer hover:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Kirim Magic Link</span>
              </>
            )}
          </button>
        </form>

        {message.text && (
          <div className={`mt-6 p-4 border-2 border-black rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_#000000] ${
            message.type === 'success' ? 'bg-[#242A24] text-[#38E54D]' : 'bg-[#2A2424] text-[#FF4A4A]'
          }`}>
            {message.text}
          </div>
        )}

      </div>
    </div>
  );
}