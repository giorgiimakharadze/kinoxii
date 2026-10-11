import React, { useState, useEffect, useRef } from 'react';
import RecentlyViewedCard from './RecentlyViewedCard';
import { getRecentlyViewed } from '../../utils/recentStorage';
import './RecentlyViewed.css';

export default function RecentlyViewed({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const scrollRowRef = useRef(null);

  const loadRecent = () => {
    setMovies(getRecentlyViewed());
  };

  useEffect(() => {
    loadRecent();

    window.addEventListener('recentlyViewedUpdated', loadRecent);
    window.addEventListener('storage', loadRecent);
    return () => {
      window.removeEventListener('recentlyViewedUpdated', loadRecent);
      window.removeEventListener('storage', loadRecent);
    };
  }, []);

  const handleScroll = () => {
    if (scrollRowRef.current) {
      setIsScrolledLeft(scrollRowRef.current.scrollLeft > 15);
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="recently-viewed-section">
      <div className="recently-viewed-container">
        {/* header */}
        <div className="recently-viewed-header">
          <h2 className="recently-viewed-heading">Recently viewed</h2>
        </div>

        {/* horizontal scroll list */}
        <div
          ref={scrollRowRef}
          onScroll={handleScroll}
          className={`recently-viewed-scroll-row ${isScrolledLeft ? 'has-left-scroll' : ''}`}
        >
          {movies.map((movie) => (
            <RecentlyViewedCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
