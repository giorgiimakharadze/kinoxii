import React, { useState, useEffect, useCallback, useRef } from 'react';
import SessionsFilters from '../../components/Sessions/Filter/SessionsFilters';
import SessionsTopBar from '../../components/Sessions/List/SessionsTopBar';
import MovieSessionRow from '../../components/Sessions/List/MovieSessionRow';
import SessionsPagination from '../../components/Sessions/List/SessionsPagination';
import { moviesApi } from '../../services/api';
import { getNextSevenDays } from '../../utils/dateHelpers';
import { getCachedFilterOptions } from '../../services/configService';
import './SessionsPage.css';


// convert state to api query string
function parseQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const venues = params.get('venue') ? params.get('venue').split(',').filter(Boolean) : [];
  const formats = params.get('format') ? params.get('format').split(',').filter(Boolean) : [];
  const languages = params.get('language') ? params.get('language').split(',').filter(Boolean) : [];
  const bands = params.get('band') ? params.get('band').split(',').filter(Boolean) : [];
  const date = params.get('date') || getNextSevenDays()[0]?.dateStr;
  const sort = params.get('sort') || 'time_asc';
  const page = parseInt(params.get('page'), 10) || 1;

  return { venues, formats, languages, bands, date, sort, page };
}

// convert state to clean browser url query
function buildBrowserQuery({ venues, formats, languages, bands, date, sort, page }) {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  if (venues?.length) params.set('venue', venues.join(','));
  if (formats?.length) params.set('format', formats.join(','));
  if (languages?.length) params.set('language', languages.join(','));
  if (bands?.length) params.set('band', bands.join(','));
  if (sort && sort !== 'time_asc') params.set('sort', sort);
  if (page && page > 1) params.set('page', String(page));
  const str = params.toString();
  return str ? `?${str}` : '';
}

function buildApiQuery({ venues, formats, languages, bands, date, sort, page }) {
  const parts = [];
  if (date) parts.push(`date=${encodeURIComponent(date)}`);
  if (sort) parts.push(`sort=${encodeURIComponent(sort)}`);
  if (page) parts.push(`page=${page}`);


  venues?.forEach((v) => parts.push(`venues[]=${encodeURIComponent(v)}`));
  formats?.forEach((f) => parts.push(`formats[]=${encodeURIComponent(f)}`));
  languages?.forEach((l) => parts.push(`languages[]=${encodeURIComponent(l)}`));
  bands?.forEach((b) => parts.push(`bands[]=${encodeURIComponent(b)}`));
  return parts.join('&');
}

export default function SessionsPage({ onSelectSession, onSelectMovie }) {
  const [filterOptions, setFilterOptions] = useState(null);
  // synchronized state with url
  const [state, setState] = useState(() => parseQueryParams());
  // api response data
  const [movieGroups, setMovieGroups] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadOptions() {
      try {
        const data = await getCachedFilterOptions();
        setFilterOptions(data);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    }
    loadOptions();
  }, []);

  // sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setState(parseQueryParams());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  // fetch filter options
  useEffect(() => {
    async function loadOptions() {
      try {
        const res = await moviesApi.getFilterOptions();
        setFilterOptions(res?.data || null);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    }
    loadOptions();
  }, []);
  // update both react state and browser url query
  const updateState = useCallback((updater) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const newQuery = buildBrowserQuery(next);
      const newUrl = `${window.location.pathname}${newQuery}`;
      if (window.location.search !== newQuery) {
        window.history.pushState(null, '', newUrl);
      }
      return next;
    });
  }, []);
  // filter change, resets page to 1
  const handleFilterChange = (newFilters) => {
    updateState((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };
  // clear filters, resets page to 1
  const handleClearFilters = () => {
    updateState((prev) => ({
      ...prev,
      venues: [],
      formats: [],
      languages: [],
      bands: [],
      page: 1,
    }));
  };
  // sort change, resets page to 1
  const handleSortChange = (sortId) => {
    updateState((prev) => ({
      ...prev,
      sort: sortId,
      page: 1,
    }));
  };
  // page change
  const handlePageChange = (newPage) => {
    updateState((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // fetch sessions on any filter/sort/page change
  useEffect(() => {
    let cancelled = false;
    async function fetchSessions() {
      try {
        setLoading(true);
        const apiQuery = buildApiQuery(state);
        const res = await moviesApi.getSessions(apiQuery);
        if (cancelled) return;
        setMovieGroups(res?.data || []);
        setMeta(res?.meta || null);
      } catch (err) {
        if (!cancelled) console.error('Failed to load sessions:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSessions();
    return () => {
      cancelled = true;
    };
  }, [state]);
  const totalSessionsCount = meta?.totalSessions || 0;
  const totalPages = meta?.lastPage || 1;
  return (
    <div className="sessions-page-wrapper">
      <div className="sessions-page-header">
        <h1 className="sessions-page-title">Sessions</h1>
        <p className="sessions-page-subtitle">Browse showtimes across all venues</p>
      </div>
      <div className="sessions-layout-grid">
        {/* filters sidebar */}
        <SessionsFilters
          options={filterOptions}
          filters={{
            date: state.date,
            venues: state.venues,
            formats: state.formats,
            languages: state.languages,
            bands: state.bands,
          }}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        {/* sessions list */}
        <div className="sessions-main-content">
          {/* count and sort */}
          <SessionsTopBar
            totalSessions={totalSessionsCount}
            loading={loading}
            sortOptions={filterOptions?.sorts || []}
            currentSort={state.sort}
            onSortChange={handleSortChange}
          />
          {/* film rows */}
          {loading ? (
            <div className="sessions-skeleton-list">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sessions-row-skeleton" />
              ))}
            </div>
          ) : movieGroups.length === 0 ? (
            <div className="sessions-empty-state">
              <h3 className="empty-title">No sessions found</h3>
              <p className="empty-desc">Try clearing some filters or picking another date</p>
              <button type="button" className="empty-clear-btn" onClick={handleClearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="sessions-movie-groups-list">
              {movieGroups.map(({ movie, sessions }) => (
                <MovieSessionRow
                  key={movie.id}
                  movie={movie}
                  sessions={sessions}
                  onSelectSession={onSelectSession}
                  onSelectMovie={onSelectMovie}
                />
              ))}
            </div>
          )}
          {/* pagination */}
          {!loading && totalPages > 1 && (
            <SessionsPagination
              currentPage={state.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}