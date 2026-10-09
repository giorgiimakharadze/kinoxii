import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Timer } from 'lucide-react';
import { moviesApi } from '../../services/api';
import { getNextSevenDays } from '../../utils/dateHelpers';
import MovieDetailSessionCard from '../../components/MovieDetails/MovieDetailSessionCard';
import MovieDetailVenueGroup from '../../components/MovieDetails/MovieDetailVenueGroup';
import './MovieDetailPage.css';

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MovieDetailPage({ user = null, onSelectSession }) {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [sessionsByVenue, setSessionsByVenue] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const days = useMemo(() => getNextSevenDays(), []);
  const [selectedDate, setSelectedDate] = useState(() => days[0]?.dateStr || '');


  // fetch details
  useEffect(() => {
    let cancelled = false;
    async function loadMovie() {
      try {
        setLoadingMovie(true);
        const res = await moviesApi.getMovieDetails(slug);
        if (cancelled) return;
        setMovie(res?.data || null);
      } catch (err) {
        if (!cancelled) console.error('Failed to load movie details:', err);
      } finally {
        if (!cancelled) setLoadingMovie(false);
      }
    }
    if (slug) loadMovie();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // fetch sessions
  useEffect(() => {
    let cancelled = false;
    async function loadSessions() {
      try {
        setLoadingSessions(true);
        const res = await moviesApi.getMovieSessions(slug, selectedDate);
        if (cancelled) return;
        setSessionsByVenue(res?.data || []);
      } catch (err) {
        if (!cancelled) console.error('Failed to load movie sessions:', err);
      } finally {
        if (!cancelled) setLoadingSessions(false);
      }
    }
    if (slug && selectedDate) loadSessions();
    return () => {
      cancelled = true;
    };
  }, [slug, selectedDate]);


  // total session count
  const totalSessionsCount = useMemo(() => {
    return sessionsByVenue.reduce((acc, v) => acc + (v.sessions?.length || 0), 0);
  }, [sessionsByVenue]);

  // age restirction logic
  const isBlockedByAge = useMemo(() => {
    if (!user || user.age === null || user.age === undefined) return false;
    const minAge = movie?.ageRating?.minAge || 0;
    return minAge > 0 && user.age < minAge;
  }, [user, movie]);

  const ageRestrictionMessage = movie?.ageRating?.code
    ? `This film is rated ${movie.ageRating.code}. You cannot buy tickets for it with this account.`
    : 'You cannot buy tickets for this film due to age restrictions.';

  const formatsString = useMemo(() => {
    return movie?.formats?.map((f) => f.name).join(', ') || 'Standard';
  }, [movie]);

  if (loadingMovie) {
    return (
      <div className="movie-detail-loading-wrapper">
        <div className="movie-detail-skeleton-hero" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail-empty-wrapper">
        <h2>Movie not found</h2>
      </div>
    );
  }

  return (
    <div className='movie-detail-page'>
      {/* hero section */}
      <section className='movie-detail-hero'>
        {/* backdrop */}
        <div
          className="movie-detail-backdrop"
          style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
        >
          <div className="movie-detail-backdrop-overlay" />
        </div>

        {/* hero content */}
        <div className='movie-detail-hero-content'>
          {/* poster */}
          <div className="movie-detail-poster-wrap">
            <img
              src={movie.posterUrl || movie.backdropUrl}
              alt={movie.title}
              className="movie-detail-poster-img"
            />
          </div>

          {/* info */}
          <div className='movie-detail-header-info'>
            <span className="movie-detail-status-pill">
              {movie.isComingSoon ? 'COMING SOON' : 'NOW PLAYING'}
            </span>
            <h1 className="movie-detail-title">{movie.title}</h1>
            <p className="movie-detail-synopsis">{movie.synopsis}</p>


            {/* age, duration, format */}
            <div className='movie-detail-badges-row'>
              {movie.ageRating?.code && (
                <span className="movie-detail-age-pill">{movie.ageRating.code}</span>
              )}
              {movie.runtimeMinutes && (
                <span className="movie-detail-runtime-pill">
                  <Timer size={14} />
                  <span>{movie.runtimeMinutes} Min</span>
                </span>
              )}
              {movie.formats?.[0]?.name && (
                <span className="movie-detail-format-pill">{movie.formats[0].name}</span>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* lower section */}
      <section className='movie-detail-main-layout'>
        {/* sessions */}
        <div className='movie-detail-sessions-col'>
          <div className='detail-sessions-header'>
            <h2 className="detail-sessions-title">Sessions</h2>
            <p className="detail-sessions-subtitle">
              {totalSessionsCount} sessions over the next seven days
            </p>
          </div>
          {/* date selector row */}
          <div className="detail-date-scroll-row">
            {days.map((day) => {
              const isSelected = selectedDate === day.dateStr;
              return (
                <button
                  key={day.dateStr}
                  type="button"
                  className={`detail-date-pill-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(day.dateStr)}
                >
                  <span className="detail-date-weekday">{day.weekday}</span>
                  <span className="detail-date-day">{day.dayNumber}</span>
                </button>
              );
            })}
          </div>
          {/* session list grouped by venue and hall */}
          {loadingSessions ? (
            <div className='detail-sessions-loading'>
              <div className='detail-session-skeleton' />
              <div className='detail-session-skeleton' />
            </div>
          ) : sessionsByVenue.length === 0 ? (
            <div className='detail-sessions-empty-notice'>
              <p>No sessions available for this date</p>
            </div>
          ) : (
            <div className='detail-venues-list'>
              {sessionsByVenue.map((venueGroup) => (
                <MovieDetailVenueGroup
                  key={venueGroup.venue?.id || venueGroup.venue?.name}
                  venueGroup={venueGroup}
                  isBlockedByAge={isBlockedByAge}
                  ageRestrictionMessage={ageRestrictionMessage}
                  onSelectSession={onSelectSession} />
              ))}
            </div>
          )}
        </div>
        {/* details sidebar */}
        <aside className='movie-detail-sidebar-col'>
          <h2 className='detail-sidebar-title'>Details</h2>

          <div className='detail-sidebar-fields'>
            {/* director */}
            {movie.director && (
              <div className="detail-sidebar-field">
                <span className="detail-field-label">DIRECTOR</span>
                <span className="detail-field-value">{movie.director}</span>
              </div>
            )}

            {/* main cast */}
            {movie.cast && (
              <div className="detail-sidebar-field">
                <span className="detail-field-label">MAIN CAST</span>
                <span className="detail-field-value">{movie.cast}</span>
              </div>
            )}

            {/* duration */}
            {movie.runtimeMinutes && (
              <div className="detail-sidebar-field">
                <span className="detail-field-label">DURATION</span>
                <span className="detail-field-value">{movie.runtimeMinutes} minutes</span>
              </div>
            )}

            {/* release date */}
            {movie.releaseDate && (
              <div className="detail-sidebar-field">
                <span className="detail-field-label">RELEASE DATE</span>
                <span className="detail-field-value">{formatFullDate(movie.releaseDate)}</span>
              </div>
            )}
            {/* formats */}
            <div className="detail-sidebar-field">
              <span className="detail-field-label">FORMATS</span>
              <span className="detail-field-value">{formatsString}</span>
            </div>

            {/* from price */}
            {movie.fromPrice !== undefined && movie.fromPrice !== null && (
              <div className="detail-sidebar-field">
                <span className="detail-field-label">FROM</span>
                <span className="detail-field-value">₾{movie.fromPrice}</span>
              </div>
            )}

            {/* rating note */}
            {movie.ageRating && (
              <div className="detail-rating-note-box">
                <span className="detail-rating-note-tag">RATING NOTE</span>
                <p className="detail-rating-note-desc">
                  <strong className="detail-rating-code">{movie.ageRating.code}</strong>{' '}
                  {movie.ageRating.description ||
                    `Not recommended for under-${movie.ageRating.minAge}s. Tickets require an account aged ${movie.ageRating.minAge} or over.`}
                </p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}