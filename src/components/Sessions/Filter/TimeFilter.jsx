import React from 'react';
import FilterCheckbox from './FilterCheckbox';
import './SessionsFilters.css';

const BAND_SUBTITLES = {
  morning: 'before 12:00',
  afternoon: '12:00-18:00',
  evening: 'after 18:00',
};

export default function TimeFilter({ timeBands = [], selectedBands = [], onToggleBand }) {
  return (
    <div className="filter-block">
      <h3 className="filter-block-title">TIME OF DAY</h3>
      <div className="filter-checkbox-list">
        {timeBands.map((band) => (
          <FilterCheckbox
            key={band.id}
            checked={selectedBands.includes(band.id)}
            onChange={() => onToggleBand(band.id)}
            primaryText={band.label}
            secondaryText={BAND_SUBTITLES[band.id] || ''}
          />
        ))}
      </div>
    </div>
  );
}
