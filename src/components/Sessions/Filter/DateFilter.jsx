import React, { useMemo } from 'react';
import { getNextSevenDays } from '../../../utils/dateHelpers';
import './SessionsFilters.css';

export default function DateFilter({ selectedDate, onSelectDate }) {
  const days = useMemo(() => getNextSevenDays(), []);

  return (
    <div className="filter-block">
      <h3 className="filter-block-title">DATE</h3>
      <div className="date-picker-row">
        {days.map((day) => {
          const isSelected = selectedDate === day.dateStr;
          return (
            <button
              key={day.dateStr}
              type="button"
              className={`date-day-box ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectDate(day.dateStr)}
            >
              <span className="date-day-name">{day.weekday}</span>
              <span className="date-day-num">{day.dayNumber}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
