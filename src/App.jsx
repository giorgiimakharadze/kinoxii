import React from 'react';
import Hero from './components/Hero/Hero';

export default function App() {
  return (
    <div style={{ backgroundColor: '#090a0f', minHeight: '100vh', width: '100%' }}>
      <Hero
        onBuyTickets={(movie) => console.log('Buy tickets for:', movie.title)}
        onAllSessions={(movie) => console.log('All sessions for:', movie.title)}
      />
    </div>
  );
}
