import React from 'react';
import FilterCheckbox from './FilterCheckbox';
import './SessionsFilters.css';

const TIME_OPTIONS = [
  { id: 'morning', label: 'Morning', sub: 'before 12:00' },
  { id: 'afternoon', label: 'Afternoon', sub: '12:00-18:00' },
  { id: 'evening', label: 'Evening', sub: 'after 18:00' },
];

export default function TimeFilter({ selectedBands = [], onToggleBand }) {
  return (
    <div className="filter-block">
      <h3 className="filter-block-title">TIME OF DAY</h3>
      <div className="filter-checkbox-list">
        {TIME_OPTIONS.map((time) => (
          <FilterCheckbox
            key={time.id}
            checked={selectedBands.includes(time.id)}
            onChange={() => onToggleBand(time.id)}
            primaryText={time.label}
            secondaryText={time.sub}
          />
        ))}
      </div>
    </div>
  );
}
