import React from 'react';

export default function OrderSummaryPanel({
  session,
  selectedSeats = [],
  holdData,
  onPay,
  isPaying = false,
  isValid = true,
}) {
  const movie = session?.movie || session;

  const typeCounts = selectedSeats.reduce((acc, s) => {
    const typeName = s.ticketType ? s.ticketType.charAt(0).toUpperCase() + s.ticketType.slice(1) : 'Adult';
    acc[typeName] = (acc[typeName] || 0) + 1;
    return acc;
  }, {});

  const ticketTypeSummary = Object.entries(typeCounts)
    .map(([name, count]) => `${count} x ${name}`)
    .join(', ');

  const seatCodesSummary = selectedSeats.map((s) => s.code).join(', ');

  const subtotal = holdData?.subtotal ?? selectedSeats.reduce((acc, seat) => {
    let ratio = 1;
    if (seat.ticketType === 'child') ratio = 0.6;
    else if (seat.ticketType === 'student') ratio = 0.75;
    return acc + Math.round((session?.price || 0) * ratio);
  }, 0);

  return (
    <div className="booking-side-panel checkout-summary-panel">
      <div className="booking-side-header">
        <h4 className="booking-side-title">Summary</h4>
      </div>

      <div className="checkout-summary-content">
        <div className="checkout-summary-film-block">
          <h3 className="checkout-summary-title">{movie?.title}</h3>
          <p className="checkout-summary-meta">
            {session?.hall?.name ? `Hall ${session.hall.name} · ` : ''}
            {session?.date} · {session?.time}
          </p>
        </div>

        <div className="checkout-summary-line">
          <span className="checkout-line-label">Seats</span>
          <span className="checkout-line-val seats">{seatCodesSummary || '—'}</span>
        </div>

        <div className="checkout-summary-line">
          <span className="checkout-line-label">Tickets</span>
          <span className="checkout-line-val">{ticketTypeSummary || '—'}</span>
        </div>
      </div>

      <div className="booking-side-footer">
        <div className="booking-subtotal-row">
          <span className="booking-subtotal-label">SUBTOTAL</span>
          <span className="booking-subtotal-val">₾{subtotal}</span>
        </div>

        <button
          type="button"
          className="booking-proceed-btn"
          disabled={!isValid || isPaying}
          onClick={onPay}
        >
          {isPaying ? 'Processing payment...' : 'Pay: Complete order'}
        </button>
      </div>
    </div>
  );
}
