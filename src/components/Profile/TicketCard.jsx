import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import './TicketCard.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatSessionDateTime(session) {
  if (!session) return '';
  const { date, time, startsAt } = session;

  if (date) {
    const d = new Date(`${date}T00:00:00Z`);
    if (!Number.isNaN(d.getTime())) {
      const label = `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
      return time ? `${label} · ${time}` : label;
    }
  }

  if (!startsAt) return time || '';
  const d = new Date(startsAt);
  if (Number.isNaN(d.getTime())) return time || '';
  const label = `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const clock = time || d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${label} · ${clock}`;
}

function formatHall(name) {
  if (!name) return '';
  return /^hall\b/i.test(name) ? name : `Hall ${name}`;
}

function formatRefundDeadline(startsAt) {
  if (!startsAt) return '';
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return '';
  const deadline = new Date(date.getTime() - 2 * 60 * 60 * 1000);
  const time = deadline.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `Refundable until ${time}, ${WEEKDAYS[deadline.getDay()]} ${deadline.getDate()} ${MONTHS[deadline.getMonth()]}`;
}

export default function TicketCard({
  order,
  isPast = false,
  onRefund,
  isRefunding = false,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [refundError, setRefundError] = useState('');

  const session = order?.session;
  const movie = session?.movie;
  const isRefundable = Boolean(order?.isRefundable);

  const venueLine = [session?.venue?.name, formatHall(session?.hall?.name)]
    .filter(Boolean)
    .join(' · ');
  const formatLine = [session?.format?.name || 'Standard', session?.language?.name]
    .filter(Boolean)
    .join(' · ');
  const ageLabel = movie?.ageRating?.code || (movie?.ageRating ? `${movie.ageRating.minAge}+` : '');

  const handleRefundClick = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    try {
      setRefundError('');
      await onRefund?.(order.reference);
      setShowConfirm(false);
    } catch (err) {
      setRefundError(err?.message || 'Refund refused by server.');
      setShowConfirm(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setRefundError('');
  };

  return (
    <div className={`ticket-card ${isPast ? 'past-ticket' : ''}`}>
      {/* poster and movie info */}
      <div className="ticket-main-section">
        {movie?.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className="ticket-poster-img" />
        ) : (
          <div className="ticket-poster-placeholder">
            <span>No Poster</span>
          </div>
        )}

        <div className="ticket-details-col">
          {/* movie title, age, runtime */}
          <div className="ticket-title-row">
            <h3 className="ticket-movie-title">{movie?.title || 'Unknown Title'}</h3>
            {ageLabel && <span className="ticket-age-badge">{ageLabel}</span>}
            {movie?.runtimeMinutes && (
              <span className="ticket-runtime">{movie.runtimeMinutes} min</span>
            )}
          </div>

          {/* details */}
          <div className="ticket-info-grid">
            <div className="ticket-info-item">
              <span className="ticket-info-label">Date</span>
              <span className="ticket-info-value">{formatSessionDateTime(session)}</span>
            </div>

            <div className="ticket-info-item">
              <span className="ticket-info-label">Venue</span>
              <span className="ticket-info-value">{venueLine}</span>
            </div>

            <div className="ticket-info-item">
              <span className="ticket-info-label">Format</span>
              <span className="ticket-info-value">{formatLine}</span>
            </div>
          </div>

          {/* seats pill list */}
          <div className="ticket-seats-row">
            <span className="ticket-info-label">Seats</span>
            <div className="ticket-seat-pills">
              {order?.tickets?.map((t) => (
                <span key={t.id || t.seatCode} className="ticket-seat-pill">
                  {t.seatCode} · {t.ticketType?.name || 'Adult'}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* order code, price, refund action */}
      <div className="ticket-side-section">
        <div className="ticket-order-ref-block">
          <span className="ticket-side-label">Order</span>
          <span className="ticket-order-ref">#{order?.reference}</span>
        </div>

        <div className="ticket-price-block">
          <span className="ticket-side-label">Total paid</span>
          <span className="ticket-total-price">₾{order?.totalPrice}</span>
        </div>

        {/* refund action */}
        {!isPast && (
          <div className="ticket-refund-action">
            {showConfirm ? (
              <div className="ticket-refund-confirm-box">
                <span className="ticket-refund-confirm-text">Confirm refund?</span>
                <div className="ticket-confirm-btn-row">
                  <button
                    type="button"
                    className="ticket-refund-btn danger"
                    onClick={handleRefundClick}
                    disabled={isRefunding}
                  >
                    {isRefunding ? 'Refunding...' : 'Yes, Refund'}
                  </button>
                  <button
                    type="button"
                    className="ticket-cancel-btn"
                    onClick={handleCancelConfirm}
                    disabled={isRefunding}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="ticket-refund-btn"
                  disabled={!isRefundable || isRefunding}
                  onClick={handleRefundClick}
                >
                  Refund
                </button>
                <span className="ticket-refund-note">
                  {isRefundable
                    ? formatRefundDeadline(session?.startsAt)
                    : 'Refund unavailable within 2h of session'}
                </span>
              </>
            )}

            {refundError && (
              <div className="ticket-refund-error">
                <AlertCircle size={13} />
                <span>{refundError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}