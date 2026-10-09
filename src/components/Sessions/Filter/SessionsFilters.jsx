// src/components/Sessions/Filters/SessionsFilters.jsx
import React from 'react';
import VenueFilter from './VenueFilter';
import DateFilter from './DateFilter';
import FormatFilter from './FormatFilter';
import LanguageFilter from './LanguageFilter';
import TimeFilter from './TimeFilter';
import './SessionsFilters.css';

export default function SessionsFilters({
  options,            // From GET /filter-options
  filters,            // { date, venues, formats, languages, bands }
  onFilterChange,
  onClearFilters,
}) {
  //handlers
  const handleDateChange = (dateStr) => {
    onFilterChange({ ...filters, date: dateStr });
  };

  const handleVenueToggle = (venueSlug) => {
    const current = filters.venues || [];
    const updatedVenues = current.includes(venueSlug)
      ? current.filter((s) => s !== venueSlug)
      : [...current, venueSlug];

    // if venues are changed drop formats if not supported
    let validFormats = filters.formats || [];
    if (updatedVenues.length > 0 && options?.venues) {
      const supported = new Set();
      options.venues.forEach((v) => {
        if (updatedVenues.includes(v.slug)) {
          v.formats?.forEach((f) => supported.add(f.slug));
        }
      });
      validFormats = validFormats.filter((f) => supported.has(f));
    }

    onFilterChange({
      ...filters,
      venues: updatedVenues,
      formats: validFormats,
    });
  };

  const handleGenericToggle = (key, slug) => {
    const current = filters[key] || [];
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];

    onFilterChange({ ...filters, [key]: updated });
  };

  // filter count
  const activeCount =
    (filters.venues?.length || 0) +
    (filters.formats?.length || 0) +
    (filters.languages?.length || 0) +
    (filters.bands?.length || 0);

  return (
    <aside className="sessions-filters-card">
      <h2 className="filters-card-main-title">Filters</h2>

      {/* venue */}
      <VenueFilter
        venues={options?.venues}
        selectedVenues={filters.venues}
        onToggleVenue={handleVenueToggle}
      />

      {/* date */}
      <DateFilter
        selectedDate={filters.date}
        onSelectDate={handleDateChange}
      />

      {/* format */}
      <FormatFilter
        formats={options?.formats}
        venues={options?.venues}
        selectedVenues={filters.venues}
        selectedFormats={filters.formats}
        onToggleFormat={(slug) => handleGenericToggle('formats', slug)}
      />

      {/* language */}
      <LanguageFilter
        languages={options?.languages}
        selectedLanguages={filters.languages}
        onToggleLanguage={(slug) => handleGenericToggle('languages', slug)}
      />

      {/* day */}
      <TimeFilter
        selectedBands={filters.bands}
        onToggleBand={(bandId) => handleGenericToggle('bands', bandId)}
      />

      {/* footer */}
      <div className="filter-card-footer">
        {activeCount > 0 ? (
          <>
            <button
              type="button"
              className="filter-clear-pill-btn"
              onClick={onClearFilters}
            >
              Clear filters
            </button>
            <span className="filter-active-count-text">
              {activeCount} {activeCount === 1 ? 'filter active' : 'filters active'}
            </span>
          </>
        ) : (
          <span className="filter-active-count-text">0 filters active</span>
        )}
      </div>
    </aside>
  );
}
