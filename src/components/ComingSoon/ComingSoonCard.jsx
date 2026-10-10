import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { moviesApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './ComingSoon.css';

export default function ComingSoonCard({ movie, onSelectMovie }) {
  const { user, requireAuth } = useAuth();

  const [isNotified, setIsNotified] = useState(Boolean(user && movie.isNotified));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsNotified(false);
    } else {
      setIsNotified(Boolean(movie.isNotified));
    }
  }, [user, movie.isNotified]);

  if (!movie) return null;

  const formatReleaseDate = (dateStr) => {
    if (!dateStr) return 'COMING SOON';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    return `IN CINEMAS ${day} ${month}`;
  };

  const primaryGenre = movie.genres?.[0]?.name || 'Film';

  const subscribeNotification = async () => {
    try {
      setLoading(true);
      await moviesApi.notifyComingSoon(movie.slug);
      setIsNotified(true);
    } catch (err) {
      console.error('Failed to subscribe to movie notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyClick = (e) => {
    e.stopPropagation();
    if (isNotified || loading) return;

    requireAuth(() => {
      subscribeNotification();
    });
  };

  return (
    <div className="coming-soon-card" onClick={() => onSelectMovie?.(movie)}>
      {/* poster */}
      <div className="coming-soon-media-wrap">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="coming-soon-img"
          loading="lazy"
        />
      </div>

      {/* info */}
      <div className="coming-soon-info">
        <span className="coming-soon-release">
          {formatReleaseDate(movie.releaseDate)}
        </span>

        <h4 className="coming-soon-title">{movie.title}</h4>

        <div className="coming-soon-meta">
          <span>{primaryGenre}</span>
          {movie.runtimeMinutes && (
            <>
              <span className="coming-soon-dot">·</span>
              <span>{movie.runtimeMinutes} min</span>
            </>
          )}
        </div>

        {movie.ageRating?.code && (
          <div className="coming-soon-age-wrap">
            <span className="coming-soon-age-badge">{movie.ageRating.code}</span>
          </div>
        )}

        <button
          type="button"
          className={`coming-soon-notify-btn ${isNotified ? 'notified' : ''}`}
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
