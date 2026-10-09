import React from 'react';
import FilterCheckbox from './FilterCheckbox';
import './SessionsFilters.css';

export default function LanguageFilter({
  languages = [],
  selectedLanguages = [],
  onToggleLanguage,
}) {
  return (
    <div className="filter-block">
      <h3 className="filter-block-title">LANGUAGE</h3>
      <div className="filter-checkbox-list">
        {languages.map((lang) => (
          <FilterCheckbox
            key={lang.slug}
            checked={selectedLanguages.includes(lang.slug)}
            onChange={() => onToggleLanguage(lang.slug)}
            primaryText={lang.name}
          />
        ))}
      </div>
    </div>
  );
}
