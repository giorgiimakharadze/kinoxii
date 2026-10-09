import React from 'react';
import './SessionsFilters.css';

export default function FilterCheckbox({ checked, onChange, primaryText, secondaryText }) {
  return (
    <label className="filter-check-item">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={onChange}
        className="filter-real-checkbox"
      />
      <span className="filter-styled-box" />
      <span className="filter-label-text">
        <span className="filter-primary-name">{primaryText}</span>
        {secondaryText && <span className="filter-secondary-name"> · {secondaryText}</span>}
      </span>
    </label>
  );
}
