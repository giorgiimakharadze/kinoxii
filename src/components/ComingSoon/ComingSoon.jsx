import React, { useState, useEffect, useRef } from 'react';
import ComingSoonCard from './ComingSoonCard';
import { moviesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ComingSoon.css';


export default function ComingSoon({ onSelectMovie, onSeeAll, onRequireAuth }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const scrollRowRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    async function loadComingSoon() {
      try {
        setLoading(true);
        const res = await moviesApi.getComingSoon();
        setMovies(res?.data || []);
      } catch (err) {
        console.error('Failed to load coming soon movies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadComingSoon();
  }, [user]);

  const handleScroll = () => {
    if (scrollRowRef.current) {
      setIsScrolledLeft(scrollRowRef.current.scrollLeft > 15);
    }
  };

  return (
    <section className='coming-soon-section'>
      <div className='coming-soon-container'>
        {/* header */}
        <div className='coming-soon-header'>
          <h2 className='coming-soon-heading'>COMING SOON...</h2>
          <button
            className='coming-soon-see-all'
            onClick={() => onSeeAll?.('sessions')}>
            See all
          </button>
        </div>

        {/* horizontal scroll */}
        <div ref={scrollRowRef} onScroll={handleScroll}
          className={`coming-soon-scroll-row ${isScrolledLeft ? 'has-left-scroll' : ''}`}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='coming-soon-skeleton' />
            ))
          ) : (
            movies.map((movie) => (
              <ComingSoonCard
                key={movie.id}
                movie={movie}
                onSelectMovie={onSelectMovie}
                onRequireAuth={onRequireAuth} />
            ))
          )}
        </div>
      </div>
    </section>
  );

}