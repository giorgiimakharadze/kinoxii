import React, { useMemo } from 'react';
import FilterCheckbox from './FilterCheckbox';
import './SessionsFilters.css';

export default function FormatFilter({
  formats = [],
  venues = [],
  selectedVenues = [],
  selectedFormats = [],
  onToggleFormat,
}) {
  // dynamic format calculation
  const availableFormats = useMemo(() => {
    if (!formats) return [];
    if (!selectedVenues || selectedVenues.length === 0) {
      return formats;
    }

    const supportedSlugs = new Set();
    venues.forEach((v) => {
      if (selectedVenues.includes(v.slug)) {
        v.formats?.forEach((f) => supportedSlugs.add(f.slug));
      }
    });

    return formats.filter((f) => supportedSlugs.has(f.slug));
  }, [formats, venues, selectedVenues]);

  return (
    <div className="filter-block">
      <h3 className="filter-block-title">FORMAT</h3>
      <div className="filter-checkbox-list">
        {availableFormats.map((fmt) => (
          <FilterCheckbox
            key={fmt.slug}
            checked={selectedFormats.includes(fmt.slug)}
            onChange={() => onToggleFormat(fmt.slug)}
            primaryText={fmt.name}
          />
        ))}
        {availableFormats.length === 0 && (
          <span className="filter-empty-hint">No formats available for selected venues</span>
        )}
      </div>
    </div>
  );
}
