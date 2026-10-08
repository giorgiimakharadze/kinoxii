import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { moviesApi } from '../../services/api';
import './ComingSoon.css';


export default function ComingSoonCard({ movie, onSelectMovie, onRequireAuth }) {
  const [isNotified, setIsNotified] = useState(movie.isNotified || false);
  const [loading, setLoading] = useState(false);


  if (!movie) return null;

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return "COMING SOON";
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    return `IN CINEMAS ${day} ${month}`;
  };

  const primaryGenre = movie.genres?.[0]?.name || 'Film';

  const handleNotifyClick = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('kinoxii_token');
    if (!token) {
      onRequireAuth?.();
      return;
    }

    try {
      setLoading(true);
      await moviesApi.notifyComingSoon(movie.slug);
      setIsNotified(true);
    } catch (err) {
      console.error('Failed to subscribe:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='coming-soon-card' onClick={() => onSelectMovie?.(movie)}>
      {/* poster */}
      <div className='coming-soon-media-wrap'>
        <img src={movie.backdropUrl || movie.porterUrl} alt={movie.title}
          className='coming-soon-img'
          loading='lazy' />
      </div>

      {/* info */}
      <div className='coming-soon-info'>
        {/* release date */}
        <span className='coming-soon-release'>
          {formatReleaseDate(movie.releaseDate)}
        </span>

        {/* title */}
        <h4 className='coming-soon-title'>
          {movie.title}
        </h4>

        {/* genre duration */}
        <div className='coming-soon-meta'>
          <span>{primaryGenre}</span>
          {movie.runtimeMinutes && (
            <>
              <span className='coming-soon-dot'>·</span>
              <span>{movie.runtimeMinutes} min</span>
            </>
          )}
        </div>
        {/* age restriction */}
        {movie.ageRating?.code && (
          <div className='coming-soon-age-wrap'>
            <span className='coming-soon-age-badge'>
              {movie.ageRating.code}
            </span>
          </div>
        )}

        {/* notify me button */}
        <button className={`coming-soon-notify-btn ${isNotified ? 'notified' : ''}`}
          onClick={handleNotifyClick}
          disabled={loading || isNotified}
        >
          {isNotified ? (
            <>
              <Check size={14} />
              <span>Notified</span>
            </>
          ) : (
            <>
              <Bell size={14} />
              <span>Notify Me</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}