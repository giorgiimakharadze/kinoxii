import React from 'react';
import { CheckCircle2, Ticket } from 'lucide-react';
import './OrderConfirmation.css';

export default function OrderConfirmationView({
  order,
  session,
  onNavigateToTickets,
  onClose,
}) {
  const movie = session?.movie || session;

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header-badge">
        <CheckCircle2 size={56} className="confirmation-check-icon" />
        <h2 className="confirmation-title">Booking Confirmed!</h2>
        <p className="confirmation-subtitle">
          Your tickets have been reserved successfully.
        </p>
      </div>

      <div className="confirmation-card">
        <div className="confirmation-card-top">
          <div className="confirmation-film-info">
            <h3 className="confirmation-movie-title">{movie?.title}</h3>
            <span className="confirmation-session-meta">
              {session?.venue?.name} · {session?.hall?.name ? `Hall ${session.hall.name} · ` : ''}
              {session?.date} · {session?.time}
            </span>
          </div>
          <div className="confirmation-ref-box">
            <span className="confirmation-ref-label">ORDER REFERENCE</span>
            <span className="confirmation-ref-code">#{order?.reference}</span>
          </div>
        </div>

        <div className="confirmation-divider" />

        <div className="confirmation-card-bottom">
          <div className="confirmation-seats-block">
            <span className="confirmation-detail-label">SEATS & TICKETS</span>
            <div className="confirmation-seats-pills">
              {order?.tickets?.map((t) => (
                <span key={t.id || t.seatCode} className="confirmation-seat-pill">
                  {t.seatCode} · {t.ticketType?.name || 'Adult'}
                </span>
              ))}
            </div>
          </div>

          <div className="confirmation-total-block">
            <span className="confirmation-detail-label">TOTAL PAID</span>
            <span className="confirmation-total-price">₾{order?.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions-row">
        <button
          type="button"
          className="confirmation-tickets-btn"
          onClick={onNavigateToTickets}
        >
          <Ticket size={18} />
          <span>Go to My Tickets</span>
        </button>
        <button
          type="button"
          className="confirmation-close-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
