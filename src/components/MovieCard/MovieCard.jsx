import React, { useState } from 'react';
import './MovieCard.css';



export default function MovieCard({ movie, onSelectMovie }) {
  if (!movie) return null;
  const [isHovered, setIsHovered] = useState(false);

  const formatRuntime = (mins) => {
    if (!mins) return '';
    return `${mins} min`
  };


  const primaryGenre = movie.genres?.[0]?.name || 'Film';


  return (
    <div className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectMovie?.(movie)}
    >
      {/* poster */}
      <div className='movie-card-media-wrap'>
        <img src={isHovered && movie.backdropUrl ?
          movie.backdropUrl : movie.posterUrl || movie.backdropUrl}
          alt={movie.title}
          className='movie-card-img'
          loading='lazy' />
      </div>

      {/* title */}
      <h3 className='movie-card-title'>{movie.title}</h3>

      {/* meta */}
      <div className='movie-card-meta'>
        <span>{primaryGenre}</span>
        {movie.runtimeMinutes && (
          <>
            <span className='movie-card-dot'>·</span>
            <span>{formatRuntime(movie.runtimeMinutes)}</span>
          </>
        )}
      </div>
      {/* age rating */}
      {movie.ageRating?.code && (
        <div>
          <span className='movie-card-age-badge'>{movie.ageRating.code}</span>
        </div>
      )}
      {/* synopsis, renders when hovered */}
      {isHovered && movie.synopsis && (
        <p className='movie-card-synopsis'>
          {movie.synopsis}
        </p>
      )}
      {/* price and buy ticket */}
      <div className='movie-card-footer'>
        <div className='movie-card-price'>
          <span className='price-label'>From</span>
          <span className='price-value'>₾ {movie.fromPrice || 0}</span>
        </div>
        <button className='movie-card-buy-btn'
          onClick={(e) => {
            e.stopPropagation();
            onSelectMovie?.(movie);
          }}>
          Buy Ticket
        </button>
      </div>

    </div>
  );
}