import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LandingPage from './LandingPage.jsx'
import Login from './Login.jsx'

// Komponen ProtectedRoute sederhana untuk mengunci dashboard gans
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Jalur Halaman Utama */}
        <Route path="/" element={<LandingPage />} />

        {/* Jalur Login OTP Baru Kebanggaan DISSZ DEV */}
        <Route path="/login" element={<Login />} />

        {/* Jalur Dashboard Visual Bento UI (Dikunci Proteksi Token) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        } />

        {/* Emergency Redirect: Kalau rute ngawur, auto lempar ke Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)