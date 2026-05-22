import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login.jsx'
import LoginVerify from './LoginVerify.jsx'
import './index.css'

// Komponen Proteksi Halaman (Guard)
// Jika belum login, user bakal ditendang balik ke halaman /login
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
        {/* Jalur Awal otomatis diarahin ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Halaman Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Halaman Penerima Tautan Telegram */}
        <Route path="/login-verify" element={<LoginVerify />} />
        
        {/* Halaman Dashboard Utama (Diproteksi Gembok Sesi) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)