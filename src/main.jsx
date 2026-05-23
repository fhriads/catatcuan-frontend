import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login.jsx'
import LoginVerify from './LoginVerify.jsx'
import LandingPage from './LandingPage.jsx' // 🎯 1. SUDAH SAYA IMPORT DI SINI GANS
import './index.css'

// Komponen Proteksi Halaman Dashboard
const ProtectedRoute = ({ children }) => {
  const session = localStorage.getItem('user_session');
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🎯 2. JALUR UTAMA (/) SEKARANG ADALAH LANDING PAGE ESTETIK KAMU */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 🎯 3. DASHBOARD PINDAH KE /dashboard (TETAP AMAN DIJAGA GEMBOK) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } 
        />
        
        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Halaman Penerima Tautan Telegram */}
        <Route path="/login-verify" element={<LoginVerify />} />

        {/* Jika ada user nyasar mengetik url aneh, otomatis balik ke Landing Page (/) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)