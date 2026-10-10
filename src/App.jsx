import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import SessionsPage from './pages/SessionsPage/SessionsPage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';
import LoginModal from './components/Auth/LoginModal';

function AppContent() {
  const navigate = useNavigate();
  const {
    user,
    isLoginOpen,
    closeLogin,
    openLogin,
    openRegister,
    handleLoginSuccess,
    logout,
    requireAuth,
  } = useAuth();

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
    requireAuth(() => {
      console.log('User authorized! Proceed to seat selection for session:', session);
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

      {/* global login modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLogin}
        onSwitchToRegister={openRegister}
        onSuccess={handleLoginSuccess}
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
