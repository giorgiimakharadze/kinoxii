import React from 'react';
import SessionCard from './SessionCard';
import './SessionsList.css';

export default function MovieSessionRow({ movie, sessions, onSelectSession, onSelectMovie }) {
  if (!movie) return null;

  return (
    <div className="sessions-movie-group-row">
      {/* movie info header */}
      <div className="sessions-movie-header">
        <div
          className="sessions-movie-poster-wrap"
          onClick={() => onSelectMovie?.(movie)}
          role="button"
          tabIndex={0}
        >
          <img
            src={movie.posterUrl || movie.backdropUrl}
            alt={movie.title}
            className="sessions-movie-poster"
            loading="lazy"
          />
        </div>
        <div className="sessions-movie-info">
          <div className="sessions-movie-title-line">
            <h2
              className="sessions-movie-title"
              onClick={() => onSelectMovie?.(movie)}
              role="button"
              tabIndex={0}
            >
              {movie.title}
            </h2>
            {movie.ageRating?.code && (
              <span className="sessions-age-badge">{movie.ageRating.code}</span>
            )}
          </div>
          {movie.runtimeMinutes && (
            <span className="sessions-movie-runtime">
              {movie.runtimeMinutes} min
            </span>
          )}
        </div>
      </div>

      {/* sessions */}
      <div className="sessions-cards-grid">
        {sessions?.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onSelectSession={onSelectSession}
          />
        ))}
      </div>
    </div>
  );
}
