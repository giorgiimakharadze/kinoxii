import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import NowPlaying from './components/NowPlaying/NowPlaying';

export default function App() {
  // testing user
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: "giorgi",
    fullName: "Giorgi Makharadze",
    profileComplete: false,
    mail: "giorgi@gmail.com"
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <Navbar
        user={currentUser}
        onLoginClick={() => console.log('Open Login Modal')}
        onRegisterClick={() => console.log('Open Register Modal')}
        onLogout={() => setCurrentUser(null)}
        onNavigate={(page) => console.log('Navigate to:', page)}
        onSearch={(query) => console.log('Search:', query)}
      />
      <Hero
        onBuyTickets={(movie) => console.log('Buy tickets for:', movie.title)}
        onAllSessions={(movie) => console.log('All sessions for:', movie.title)}
      />
      <NowPlaying onSelectMovie={(movie) => console.log('Go to film details for:', movie.title)}
        onSeeAll={() => console.log('Go to sessions page')} />

    </div>
  );
}
