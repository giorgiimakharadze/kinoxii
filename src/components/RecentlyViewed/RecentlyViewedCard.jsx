import React from 'react';
import './RecentlyViewed.css';


export default function RecentlyViewedCard({ movie, onSelectMovie }) {
  if (!movie) return null;

  const primaryGenre = movie.genres?.[0]?.name || 'Film';

  return (
    <div className='recent-card'
      onClick={() => onSelectMovie?.(movie)}
      role='button'
      tabIndex={0}
    >
      {/* thumbnail */}
      <div className='recent-card-img-wrap'>
        <img src={movie.posterUrl || movie.backdropUrl} alt={movie.title}
          className='recent-card-img'
          loading='lazy'
        />
      </div>

      {/* info */}
      <div className='recent-card-info'>
        <h4 className='recent-card-title'>{movie.title}</h4>
        <div className='recent-card-meta'>
          <span>{primaryGenre}</span>
          {movie.runtimeMinutes && (
            <>
              <span className='recent-card-dot'>·</span>
              <span>{movie.runtimeMinutes} min</span>
            </>
          )}
        </div>
        {movie.ageRating?.code && (
          <div className='recent-card-age'>
            <span className='recent-card-age-badge'>
              {movie.ageRating.code}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}