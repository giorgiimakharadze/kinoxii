import React, { useState, useEffect, useRef } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import { moviesApi } from '../../services/api';
import './NowPlaying.css';


export default function NowPlaying({ onSelectMovie, onSeeAll }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const scrollRowRef = useRef(null);


  useEffect(() => {
    async function loadNowPlaying() {
      try {
        setLoading(true);
        const res = await moviesApi.getNowPlaying();
        setMovies(res?.data || []);
      } catch (err) {
        console.error("Failed to load now playing movies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNowPlaying();
  }, []);

  const handleScroll = () => {
    if (scrollRowRef.current) {
      setIsScrolledLeft(scrollRowRef.current.scrollLeft > 15);
    }
  };
  return (
    <section className='now-playing-section'>
      <div className='now-playing-container'>
        {/* header */}
        <div className='now-playing-header'>
          <h2 className='now-playing-title'>NOW PLAYING</h2>
          <button className='now-playing-see-all'
            onClick={() => onSeeAll?.('sessions')}>
            See all
          </button>
        </div>

        {/* horizontal scroll list */}
        <div ref={scrollRowRef}
          className={`now-playing-scroll-row ${isScrolledLeft ? 'has-left-scroll' : ''}`}
          onScroll={handleScroll}>
          {loading ? (
            // skeleton loader cards
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='movie-card-skeleton' />
            ))
          ) : (
            movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={onSelectMovie}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}