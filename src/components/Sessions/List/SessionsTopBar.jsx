import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './SessionsList.css';

const SORT_OPTIONS = [
  { id: 'time_asc', label: 'Showtime: earliest first' },
  { id: 'time_desc', label: 'Showtime: latest first' },
  { id: 'price_asc', label: 'Price: low to high' },
  { id: 'price_desc', label: 'Price: high to low' },
  { id: 'title_asc', label: 'Title: A-Z' },
];

export default function SessionsTopBar({
  totalSessions = 0,
  loading = false,
  currentSort = 'time_asc',
  onSortChange,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const currentLabel =
    SORT_OPTIONS.find((s) => s.id === currentSort)?.label || 'Showtime: earliest first';

  return (
    <div className="sessions-top-bar">
      {/* results counter */}
      <span className="sessions-results-count">
        {loading
          ? 'Loading sessions...'
          : totalSessions === 0
            ? 'No sessions found'
            : `Showing ${totalSessions} sessions`}
      </span>

      {/* sort dropdown */}
      <div className="sessions-sort-dropdown-wrap" ref={dropdownRef}>
        <button
          type="button"
          className="sessions-sort-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="sort-label-prefix">Sort:</span>
          <span className="sort-current-value">{currentLabel}</span>
          <ChevronDown size={14} className={`sort-chevron ${dropdownOpen ? 'open' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="sessions-sort-menu">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`sort-menu-item ${currentSort === opt.id ? 'active' : ''}`}
                onClick={() => {
                  setDropdownOpen(false);
                  onSortChange?.(opt.id);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
