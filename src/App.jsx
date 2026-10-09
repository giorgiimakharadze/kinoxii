import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import SessionsPage from './pages/SessionsPage/SessionsPage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';


export default function App() {
  const navigate = useNavigate();

  // test user state
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: 'giorgi',
    fullName: 'Giorgi Makharadze',
    profileComplete: false,
    mail: 'giorgi@gmail.com',
  });

  const handleNavigate = (destination, payload) => {
    if (destination === 'home') {
      navigate('/');
    } else if (destination === 'sessions') {
      navigate('/sessions');
    } else if (destination === 'movie') {
      //not implemented
      navigate(`/movies/${payload?.slug || payload}`);
    } else if (destination === 'profile') {
      //not implemented
      navigate('/profile');
    } else if (destination === 'tickets') {
      //not implemented
      navigate('/profile?tab=tickets');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', width: '100%', position: 'relative' }}>
      {/* global Navbar */}
      <Navbar
        user={currentUser}
        onLoginClick={() => console.log('Open Login Modal')}
        onRegisterClick={() => console.log('Open Register Modal')}
        onLogout={() => setCurrentUser(null)}
        onNavigate={handleNavigate}
        onSearch={(query) => console.log('Search:', query)}
      />

      {/* page routing */}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onSelectMovie={(movie) => handleNavigate('movie', movie)}
              onNavigateToSessions={() => handleNavigate('sessions')}
              onRequireAuth={() => console.log('Open Login Modal')}
            />
          }
        />
        <Route
          path="/sessions"
          element={
            <SessionsPage
              onSelectSession={(session) => console.log('Select session for booking:', session)}
              onSelectMovie={(movie) => handleNavigate('movie', movie)}
            />
          }
        />
        <Route
          path="/movies/:slug"
          element={
            <MovieDetailPage
              user={currentUser}
              onSelectSession={(session) => console.log('Selected session:', session)}
            />
          }
        />
        {/* for unmatched paths */}
        <Route
          path="*"
          element={
            <HomePage
              onSelectMovie={(movie) => handleNavigate('movie', movie)}
              onNavigateToSessions={() => handleNavigate('sessions')}
              onRequireAuth={() => console.log('Open Login Modal')}
            />
          }
        />
      </Routes>

      {/* global Footer */}
      <Footer />
    </div>
  );
}
