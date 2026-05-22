import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login.jsx'
import LoginVerify from './LoginVerify.jsx'
import './index.css'

// Komponen Proteksi Halaman (Guard)
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
        {/* 🎯 SEKARANG JALUR UTAMA (/) ADALAH DASHBOARD YANG DIPROTEKSI */}
        <Route 
          path="/" 
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

        {/* Jika ada user nyasar mengetik url aneh, otomatis oper ke halaman utama (/) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)