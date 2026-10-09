import React from 'react';
import ticketIcon from '../../assets/icons/Ticket.png';
import '../../pages/MovieDetailPage/MovieDetailPage.css';

export default function MovieDetailSessionCard({
  session,
  isBlockedByAge = false,
  ageRestrictionMessage = '',
  onSelectSession,
}) {
  if (!session) return null;

  const isSoldOut = Boolean(session.isSoldOut || session.seatsLeft === 0);
  const isDisabled = isSoldOut || isBlockedByAge;

  const seatsLeft = session.seatsLeft;
  const isLowSeats = seatsLeft > 0 && seatsLeft <= 5;
  const langCode = session.language?.code || session.language?.name || 'ENG';
  const handleClick = () => {
    if (isDisabled) return;
    onSelectSession?.(session);
  };

  return (
    <div className={`detail-session-card ${isDisabled ? 'disabled' : ''} ${isBlockedByAge ? 'blocked-age' : ''}`}
      onClick={handleClick}
      role={isDisabled ? 'presentation' : 'button'}
      tabIndex={isDisabled ? -1 : 0}
      title={isBlockedByAge ? ageRestrictionMessage : undefined}
    >
      {/* time, language and format */}
      <div className="detail-session-left">
        <span className="detail-session-time">{session.time || '12:00'}</span>
        <div className="detail-session-badges">
          <span className="detail-session-badge">{langCode}</span>
          {session.format?.name && (
            <span className="detail-session-badge format">{session.format.name}</span>
          )}
        </div>
      </div>

      <div className="detail-session-divider" />

      {/* price, seats rem */}
      <div className="detail-session-right">
        <span className="detail-session-price">₾ {session.price}</span>
        {isSoldOut ? (
          <span className="detail-session-sold">Sold out</span>
        ) : (
          <span className={`detail-session-seats ${isLowSeats ? 'seats-low' : 'seats-normal'}`}>
            <img src={ticketIcon} alt="" className="detail-session-ticket-icon" width={11} height={11} />
            <span>{seatsLeft} left</span>
          </span>
        )}
      </div>

      {/* age restriction message */}
      {isBlockedByAge && (
        <div className="blocked-age-tooltip">
          {ageRestrictionMessage}
        </div>
      )}

    </div>
  )
}