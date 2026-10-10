import React from 'react';
import SeatButton from './SeatButton';

export default function SeatMap({
  seatMapData,
  selectedSeats = [],
  onToggleSeat,
}) {
  if (!seatMapData?.sections) {
    return (
      <div className="booking-seatmap-loading">
        Loading seat map...
      </div>
    );
  }

  const selectedCodes = new Set(selectedSeats.map((s) => s.code));

  return (
    <div className="booking-seatmap-container">
      <div className="booking-screen-wrap">
        <div className="booking-screen-bar">
          <span>SCREEN</span>
        </div>
      </div>

      <div className="booking-sections-wrap">
        {seatMapData.sections.map((section, sIdx) => (
          <div key={section.name || sIdx} className="booking-section-block">
            <h4 className="booking-section-title">
              {section.name.toUpperCase()}
              {section.rows?.length ? ` · ROWS ${section.rows[0].label}-${section.rows[section.rows.length - 1].label}` : ''}
            </h4>

            <div className="booking-rows-list">
              {section.rows.map((row) => (
                <div key={row.label} className="booking-row-item">
                  <span className="booking-row-label">{row.label}</span>
                  <div className="booking-row-seats">
                    {row.seats.map((seat) => (
                      <React.Fragment key={seat.id || seat.code}>
                        <SeatButton
                          seat={seat}
                          isSelected={selectedCodes.has(seat.code)}
                          onToggle={onToggleSeat}
                        />
                        {seat.aisleAfter && <div className="booking-aisle-spacer" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="booking-legend-row">
        <div className="booking-legend-item">
          <span className="legend-sample available" />
          <span>Available</span>
        </div>
        <div className="booking-legend-item">
          <span className="legend-sample selected" />
          <span>Selected</span>
        </div>
        <div className="booking-legend-item">
          <span className="legend-sample sold" />
          <span>Sold</span>
        </div>
        <div className="booking-legend-item">
          <span className="legend-sample held" />
          <span>Held by another user</span>
        </div>
      </div>
    </div>
  );
}
