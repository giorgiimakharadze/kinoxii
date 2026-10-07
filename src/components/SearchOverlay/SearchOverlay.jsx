import React, { useState, useEffect } from 'react';
import { Search, Popcorn } from 'lucide-react';
import { moviesApi } from '../../services/api';
import './SearchOverlay.css';

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// split() with a capturing group puts every match at an odd index
function highlightMatch(title, matchStr) {
  if (!matchStr) return title;
  const parts = title.split(new RegExp(`(${escapeRegExp(matchStr)})`, 'gi'));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="search-match-bold">{part}</span>
    ) : (
      part
    )
  );
}

export default function SearchOverlay({
  query = '',
  isOpen = false,
  onClose,
  onSelectMovie,
  onBrowseSessions,
}) {
  const [results, setResults] = useState([]);
  // the trimmed query the current results belong to; differs from the input while a search is pending
  const [settledFor, setSettledFor] = useState('');
  const trimmed = query.trim();

  useEffect(() => {
    if (!isOpen || !trimmed) {
      setResults([]);
      setSettledFor('');
      return;
    }

    let cancelled = false; // ignores a slow response for an older query
    const timer = setTimeout(async () => {
      let data = [];
      try {
        const res = await moviesApi.search(trimmed);
        data = res?.data || [];
      } catch (err) {
        console.error('Search failed', err);
      }
      if (cancelled) return;
      setResults(data);
      setSettledFor(trimmed);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, isOpen]);

  if (!isOpen) return null;

  const isSearching = Boolean(trimmed) && settledFor !== trimmed;
  const hasResults = Boolean(trimmed) && results.length > 0;
  const noResults = Boolean(trimmed) && !isSearching && results.length === 0;

  const browse = () => {
    onClose?.();
    onBrowseSessions?.();
  };

  return (
    <div className="search-overlay-dropdown">
      {/* 1. nothing typed */}
      {!trimmed && (
        <div className="search-empty">
          <div className="search-empty-icon">
            <Popcorn size={24} className="search-circle-icon" />
          </div>
          <h4 className="search-prompt-title">What do you want to watch?</h4>
          <p className="search-prompt-sub">Search by title</p>
          <button type="button" className="search-browse-btn" onClick={browse}>
            Browse all sessions
          </button>
        </div>
      )}


      {/* 3. results */}
      {hasResults && (
        <div className="search-results-container">
          <div className="search-results-header">
            <span className="search-header-label">Films &amp; events</span>
            <span className="search-results-count">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
          </div>
          <div className="search-results-list">
            {results.map((movie) => (
              <button
                type="button"
                key={movie.id}
                className="search-result-item"
                onClick={() => {
                  onClose?.();
                  onSelectMovie?.(movie);
                }}
              >
                <span className="search-result-poster-wrap">
                  {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt="" className="search-result-poster" />
                  ) : (
                    <span className="search-poster-fallback" />
                  )}
                </span>

                <span className="search-result-info">
                  <span className="search-result-title">
                    {highlightMatch(movie.title, trimmed)}
                  </span>
                  <span className="search-result-meta">
                    <span>{movie.kind === 'event' ? 'Event' : 'Film'}</span>
                    <span className="search-dot">·</span>
                    <span>{movie.ageRating?.code}</span>
                    {movie.runtimeMinutes ? (
                      <>
                        <span className="search-dot">·</span>
                        <span>{movie.runtimeMinutes} min</span>
                      </>
                    ) : null}
                  </span>
                </span>

                <span className="search-result-price-wrap">
                  {movie.isComingSoon ? (
                    <span className="search-coming-soon">Coming soon</span>
                  ) : (
                    <span className="search-price">from ₾{movie.fromPrice}</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. searched, nothing found */}
      {noResults && (
        <div className="search-no-results">
          <div className="search-empty-icon">
            <Search size={24} className="search-circle-icon" />
          </div>
          <h4 className="search-prompt-title">No results for "{trimmed}"</h4>
          <p className="search-prompt-sub">
            Check the spelling or try another film or live event
          </p>
          <button type="button" className="search-browse-btn" onClick={browse}>
            Browse all sessions
          </button>
        </div>
      )}
    </div>
  );
}