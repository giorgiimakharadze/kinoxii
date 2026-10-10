import React from 'react';
import { X } from 'lucide-react';

export default function SelectedSeatsPanel({
  selectedSeats,
  basePrice,
  filmAgeRating,
  onTypeChange,
  onRemoveSeat,
  onProceed,
  isHolding,
}) {
  const isChildForbidden = Boolean(filmAgeRating?.minAge && filmAgeRating.minAge >= 16);

  const subtotal = selectedSeats.reduce((acc, seat) => {
    let ratio = 1;
    if (seat.ticketType === 'child') ratio = 0.6;
    else if (seat.ticketType === 'student') ratio = 0.75;
    return acc + Math.round(basePrice * ratio);
  }, 0);

  return (
    <div className="booking-side-panel">
      <div className="booking-side-header">
        <h4 className="booking-side-title">Your seats · Max 3</h4>
        <p className="booking-side-desc">
          Pick up to 3 seats from the map. Each seat can carry its own ticket type.
        </p>
      </div>

      {/* list of picked seats */}
      <div className="booking-selected-seats-list">
        {selectedSeats.length === 0 ? (
          <div className="booking-no-seats-placeholder">
            <span>No seats selected yet. Click on available seats on the map.</span>
          </div>
        ) : (
          selectedSeats.map((seat) => {
            let seatPrice = basePrice;
            if (seat.ticketType === 'child') seatPrice = Math.round(basePrice * 0.6);
            if (seat.ticketType === 'student') seatPrice = Math.round(basePrice * 0.75);

            return (
              <div key={seat.code} className="booking-selected-seat-card">
                <div className="booking-selected-seat-top">
                  <div className="booking-seat-title-wrap">
                    <span className="booking-seat-type-tag">Seat</span>
                    <span className="booking-seat-code-tag">{seat.code}</span>
                  </div>
                  <div className="booking-seat-price-wrap">
                    <span className="booking-seat-price">₾{seatPrice}</span>
                    <button
                      type="button"
                      className="booking-seat-remove-btn"
                      onClick={() => onRemoveSeat(seat.code)}
                      title="Remove seat"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* ticket types */}
                <div className="booking-ticket-types-row">
                  {!isChildForbidden && (
                    <button
                      type="button"
                      className={`ticket-type-pill ${seat.ticketType === 'child' ? 'active' : ''}`}
                      onClick={() => onTypeChange(seat.code, 'child')}
                    >
                      Child 60%
                    </button>
                  )}

                  <button
                    type="button"
                    className={`ticket-type-pill ${seat.ticketType === 'student' ? 'active' : ''}`}
                    onClick={() => onTypeChange(seat.code, 'student')}
                  >
                    Student 75%
                  </button>

                  <button
                    type="button"
                    className={`ticket-type-pill ${seat.ticketType === 'adult' ? 'active' : ''}`}
                    onClick={() => onTypeChange(seat.code, 'adult')}
                  >
                    Adult 100%
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* subtotal and action */}
      <div className="booking-side-footer">
        <div className="booking-subtotal-row">
          <span className="booking-subtotal-label">SUBTOTAL</span>
          <span className="booking-subtotal-val">₾{subtotal}</span>
        </div>

        <button
          type="button"
          className="booking-proceed-btn"
          disabled={selectedSeats.length === 0 || isHolding}
          onClick={onProceed}
        >
          {isHolding ? 'Holding seats...' : 'Next: Checkout'}
        </button>
      </div>
    </div>
  );
}
