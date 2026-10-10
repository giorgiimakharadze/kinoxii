import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import './TicketCard.css';

function formatSessionDateTime(startsAt, timeStr) {
  if (!startsAt) return timeStr || '';
  const date = new Date(startsAt);
  if (isNaN(date.getTime())) return timeStr || '';
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const time = timeStr || date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${weekday} ${day} ${month} · ${time}`;
}


function formatRefundDeadline(startsAt) {
  if (!startsAt) return '';
  const date = new Date(startsAt);
  if (isNaN(date.getTime())) return '';
  // 2 hours before session
  const deadline = new Date(date.getTime() - 2 * 60 * 60 * 1000);
  const time = deadline.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const weekday = deadline.toLocaleDateString('en-US', { weekday: 'short' });
  const day = deadline.getDate();
  const month = deadline.toLocaleDateString('en-US', { month: 'short' });
  return `Refundable until ${time}, ${weekday} ${day} ${month}`;
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
      <div className='ticket-main-section'>
        {movie?.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="ticket-poster-img"
          />
        ) : (
          <div className="ticket-poster-placeholder">
            <span>No Poster</span>
          </div>
        )}

        <div className='ticket-details-col'>
          {/* movie title, age, runtime */}
          <div className="ticket-title-row">
            <h3 className="ticket-movie-title">{movie?.title || 'Unknown Title'}</h3>
            {movie?.ageRating && (
              <span className="ticket-age-badge">
                {movie.ageRating.name || `${movie.ageRating.minAge}+`}
              </span>
            )}
            {movie?.runtimeMinutes && (
              <span className="ticket-runtime">{movie.runtimeMinutes} min</span>
            )}
          </div>

          {/* details */}
          <div className='ticket-info-grid'>
            <div className="ticket-info-item">
              <span className="ticket-info-label">DATE</span>
              <span className="ticket-info-value">
                {formatSessionDateTime(session?.startsAt, session?.time)}
              </span>
            </div>

            <div className='ticket-info-item'>
              <span className='ticket-info-label'>VENUE</span>

              <span className='ticket-info-value'>
                {session?.venue?.name || ''}{session?.hall?.name ? ` · ${session.hall.name}` : ''}
              </span>
            </div>

            <div className='ticket-info-item'>
              <span className="ticket-info-label">FORMAT</span>
              <span className="ticket-info-value">
                {session?.format?.name || 'Standard'}{session?.language?.name ? ` · ${session.language.name}` : ''}
              </span>
            </div>
          </div>

          {/* seats pill list */}
          <div className='ticket-seats-row'>
            <span className='ticket-info-label'>
              SEATS
            </span>
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
      <div className='ticket-side-section'>
        <div className="ticket-order-ref-block">
          <span className="ticket-side-label">ORDER</span>
          <span className="ticket-order-ref">#{order?.reference}</span>
        </div>

        <div className="ticket-price-block">
          <span className="ticket-side-label">Total paid</span>
          <span className="ticket-total-price">₾{order?.totalPrice}</span>
        </div>

        {/* refund action */}
        {!isPast && (
          <div className='ticket-refund-action'>
            {showConfirm ? (
              <div className='ticket-refund-confirm-box'>
                <span className="ticket-refund-confirm-text">Confirm refund?</span>
                <div className='ticket-confirm-btn-row'>
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