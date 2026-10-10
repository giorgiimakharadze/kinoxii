import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import SessionsPage from './pages/SessionsPage/SessionsPage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import BookingModal from './components/Booking/BookingModal';

function AppContent() {
  const navigate = useNavigate();
  const {
    user,
    isLoginOpen,
    closeLogin,
    openLogin,
    isRegisterOpen,
    closeRegister,
    openRegister,
    handleLoginSuccess,
    logout,
    requireAuth,
  } = useAuth();

  const [selectedSession, setSelectedSession] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const handleNavigate = (destination, payload) => {
    if (destination === 'home') {
      navigate('/');
    } else if (destination === 'sessions') {
      navigate('/sessions');
    } else if (destination === 'movie') {
      navigate(`/movies/${payload?.slug || payload}`);
    } else if (destination === 'profile') {
      requireAuth(() => navigate('/profile'));
    } else if (destination === 'tickets') {
      requireAuth(() => navigate('/profile?tab=tickets'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSession = (session) => {
    requireAuth((currentUser) => {
      if (!currentUser.profileComplete) {
        navigate('/profile');
        return;
      }
      setSelectedSession(session);
      setIsBookingOpen(true);
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* global Navbar */}
      <Navbar
        user={user}
        onLoginClick={() => openLogin()}
        onRegisterClick={() => openRegister()}
        onLogout={logout}
        onNavigate={handleNavigate}
        onSearch={(query) => console.log('Search:', query)}
      />

      {/* pages */}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onSelectMovie={(movie) => handleNavigate('movie', movie)}
              onNavigateToSessions={() => handleNavigate('sessions')}
              onRequireAuth={() => openLogin()}
            />
          }
        />
        <Route
          path="/sessions"
          element={
            <SessionsPage
              onSelectSession={handleSelectSession}
              onSelectMovie={(movie) => handleNavigate('movie', movie)}
            />
          }
        />
        <Route
          path="/movies/:slug"
          element={
            <MovieDetailPage
              user={user}
              onSelectSession={handleSelectSession}
            />
          }
        />
        <Route
          path="/profile"
          element={<ProfilePage />}
        />
        <Route
          path="*"
          element={
            <HomePage
              onSelectMovie={(movie) => handleNavigate('movie', movie)}
              onNavigateToSessions={() => handleNavigate('sessions')}
              onRequireAuth={() => openLogin()}
            />
          }
        />
      </Routes>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onSwitchToRegister={openRegister}
        onSuccess={handleLoginSuccess}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeRegister}
        onSwitchToLogin={openLogin}
        onSuccess={handleLoginSuccess}
      />
      <BookingModal
        isOpen={isBookingOpen}
        session={selectedSession}
        user={user}
        onClose={() => setIsBookingOpen(false)}
        onNavigateToProfile={() => navigate('/profile')}
        onOpenLogin={() => openLogin()}
      />
      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
