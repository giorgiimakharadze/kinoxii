import React, { useState, useEffect, useRef } from 'react';
import RecentlyViewedCard from './RecentlyViewedCard';
import { getRecentlyViewed, addRecentlyViewed } from '../../utils/recentStorage';
import './RecentlyViewed.css';


export default function RecentlyViewed({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const scrollRowRef = useRef(null);

  const loadRecent = () => {
    setMovies(getRecentlyViewed());
  }

  useEffect(() => {
    const existing = getRecentlyViewed();
    if (existing.length === 0) {
      // test data
      const testMovies = [
        { id: 1, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Drama' }], runtimeMinutes: 134, ageRating: { code: '12+' } },
        { id: 2, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Action' }], runtimeMinutes: 148, ageRating: { code: '12+' } },
        { id: 3, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Sci-Fi' }], runtimeMinutes: 165, ageRating: { code: '12+' } },
        { id: 4, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Thriller' }], runtimeMinutes: 122, ageRating: { code: '16+' } },
        { id: 5, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Thriller' }], runtimeMinutes: 122, ageRating: { code: '16+' } },
        { id: 6, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Thriller' }], runtimeMinutes: 122, ageRating: { code: '16+' } },
        { id: 7, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Thriller' }], runtimeMinutes: 122, ageRating: { code: '16+' } },
        { id: 8, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Thriller' }], runtimeMinutes: 122, ageRating: { code: '16+' } },
        { id: 9, title: 'Joker', posterUrl: 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', backdropUrl: null, genres: [{ name: 'Thriller' }], runtimeMinutes: 122, ageRating: { code: '16+' } },
      ];
      console.log(testMovies);
      testMovies.forEach(m => addRecentlyViewed(m));
    }
    loadRecent();
    window.addEventListener('recentlyViewedUpdated', loadRecent);
    return () => window.removeEventListener('recentlyViewedUpdated', loadRecent);
  }, []);

  const handleScroll = () => {
    if (scrollRowRef.current) {
      setIsScrolledLeft(scrollRowRef.current.scrollLeft > 15);
    }
  };

  if (movies.length == 0) return null;

  return (
    <section className='recently-viewed-section'>
      <div className='recently-viewed-container'>
        {/* header */}
        <div className='recently-viewed-header'>
          <h2 className='recently-viewed-heading'>Recently viewed</h2>
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