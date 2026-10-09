import React from 'react';
import FilterCheckbox from './FilterCheckbox';
import './SessionsFilters.css';

export default function VenueFilter({ venues = [], selectedVenues = [], onToggleVenue }) {
  return (
    <div className="filter-block">
      <h3 className="filter-block-title">VENUE</h3>
      <div className="filter-checkbox-list">
        {venues.map((venue) => (
          <FilterCheckbox
            key={venue.slug}
            checked={selectedVenues.includes(venue.slug)}
            onChange={() => onToggleVenue(venue.slug)}
            primaryText={venue.name}
            secondaryText={venue.city}
          />
        ))}
      </div>
    </div>
  );
}
