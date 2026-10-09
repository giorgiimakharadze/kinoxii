import React from 'react';
import './SessionCard.css';
import ticketIcon from "../../../assets/icons/Ticket.png"


export default function SessionCard({ session, onSelectSession }) {
  if (!session) return null;

  const isSoldOut = Boolean(session.isSoldOut || session.seatsLeft === 0);
  const seatsLeft = session.seatsLeft;

  // for warning on low seats
  const isLowSeats = seatsLeft > 0 && seatsLeft <= 5;

  const langLabel = session.language?.name || session.language?.code || "Original + Subtitle";

  return (
    <div
      className={`session-card ${isSoldOut ? 'sold-out' : ''}`}
      onClick={() => {
        if (!isSoldOut) onSelectSession?.(session);
      }}
      role={isSoldOut ? 'presentation' : 'button'}
      tabIndex={isSoldOut ? -1 : 0}>


      {/* top row, time and format */}
      <div className='session-card-top'>
        <span className='session-time'>{session.time || '00:00'}</span>
        {session.format?.name && (
          <span className='session-format-pill'>{session.format.name}</span>
        )}
      </div>


      {/* middle, language and seats rem */}
      <div className='session-card-middle'>
        <span className='session-lang' title={langLabel}>{langLabel}</span>
        {isSoldOut ? (
          <span className='seassion-seats-sold'>
            Sold out
          </span>
        ) : (
          <span className={`session-seats-badge ${isLowSeats ? 'seats-low' : 'seats-normal'}`}>
            <img src={ticketIcon} alt="" className="session-ticket-icon" width={11} height={11} />
            <span>{seatsLeft} left</span>
          </span>
        )}
      </div>

      {/* bottom, venue and hall, price */}
      <div className='session-card-bottom'>
        <span className='session-venue-hall'
          title={`${session.venue?.name || ''} · ${session.hall?.name || ''}`}>
          {(session.venue?.name || 'Venue')} · {(session.hall?.name || 'Hall ')}
        </span>
        <span className='session-price'>₾{session.price}</span>
      </div>
    </div>
  );
}