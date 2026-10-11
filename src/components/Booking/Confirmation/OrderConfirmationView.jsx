import React from 'react';
import { Check } from 'lucide-react';
import './OrderConfirmation.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatSessionDate = (isoDate) => {
  if (!isoDate) return '';
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};

const formatHall = (name) => {
  if (!name) return '';
  return /^hall\b/i.test(name) ? name : `Hall ${name}`;
};

const formatPrice = (n) => (Number.isInteger(n) ? String(n) : Number(n).toFixed(2));

const summarizeTickets = (tickets = []) => {
  const counts = new Map();
  tickets.forEach((t) => {
    const name = t.ticketType.name;
    counts.set(name, (counts.get(name) || 0) + 1);
  });
  return [...counts].map(([name, n]) => `${n} x ${name}`).join(', ');
};

export default function OrderConfirmationView({
  order,
  session,
  onNavigateToTickets,
  onClose,
}) {
  const movie = session?.movie || session;
  const tickets = order?.tickets || [];

  const metaParts = [
    session?.venue?.name,
    formatHall(session?.hall?.name),
    formatSessionDate(session?.date),
    session?.time,
  ].filter(Boolean);

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <span className="confirmation-check" aria-hidden="true">
          <Check size={28} strokeWidth={3} />
        </span>
        <h2 className="confirmation-title">Booking confirmed!</h2>
        <p className="confirmation-subtitle">
          Your tickets are ready. We've sent the confirmation to your email.
        </p>
        <span className="confirmation-ref-pill">Order #{order?.reference}</span>
      </div>

      <div className="confirmation-card">
        <div className="confirmation-film">
          {movie?.posterUrl ? (
            <img src={movie.posterUrl} alt="" className="confirmation-poster" />
          ) : (
            <span className="confirmation-poster confirmation-poster--empty" />
          )}
          <div className="confirmation-film-info">
            <h3 className="confirmation-movie-title">{movie?.title}</h3>
            <p className="confirmation-session-meta">{metaParts.join(' · ')}</p>
          </div>
        </div>

        <dl className="confirmation-rows">
          <div className="confirmation-row">
            <dt>Seats</dt>
            <dd>{tickets.map((t) => t.seatCode).join(', ')}</dd>
          </div>
          <div className="confirmation-row">
            <dt>Tickets</dt>
            <dd>{summarizeTickets(tickets)}</dd>
          </div>
        </dl>

        <div className="confirmation-total">
          <span className="confirmation-total-label">Total paid</span>
          <span className="confirmation-total-price">₾ {formatPrice(order?.totalPrice)}</span>
        </div>
      </div>

      <div className="confirmation-actions">
        <button type="button" className="confirmation-btn confirmation-btn--red" onClick={onNavigateToTickets}>
          View my tickets
        </button>
        <button type="button" className="confirmation-btn confirmation-btn--dark" onClick={onClose}>
          Back to home
        </button>
      </div>
    </div>
  );
}