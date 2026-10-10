import React from 'react';

export default function SeatButton({ seat, isSelected, onToggle }) {
  if (seat.state === 'unavailable') {
    return <div className="booking-seat-spacer" />;
  }

  const isSold = seat.state === 'sold';
  const isHeld = seat.state === 'held';
  const isDisabled = isSold || isHeld;

  let stateClass = 'available';
  if (isSelected) {
    stateClass = 'selected';
  } else if (isSold) {
    stateClass = 'sold';
  } else if (isHeld) {
    stateClass = 'held';
  }

  return (
    <button
      type="button"
      className={`booking-seat-btn ${stateClass}`}
      disabled={isDisabled}
      onClick={() => onToggle(seat)}
      title={`${seat.code} (${stateClass})`}
    >
      <span className="booking-seat-label">{seat.label}</span>
    </button>
  );
}


