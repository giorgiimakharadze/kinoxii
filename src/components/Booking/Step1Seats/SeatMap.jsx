import React, { useRef, useEffect } from 'react';
import Panzoom from '@panzoom/panzoom';
import SeatButton from './SeatButton';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export default function SeatMap({
  seatMapData,
  selectedSeats = [],
  onToggleSeat,
}) {
  const panzoomAreaRef = useRef(null);
  const panzoomInstanceRef = useRef(null);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const elem = panzoomAreaRef.current;
    if (!elem) return;

    const panzoom = Panzoom(elem, {
      maxScale: 3,
      minScale: 0.5,
      step: 0.15,
      cursor: 'grab',
      excludeClass: 'booking-seat-btn',
    });
    panzoomInstanceRef.current = panzoom;

    const parent = elem.parentElement;

    const onWheel = (event) => {
      event.preventDefault();
      panzoom.zoomWithWheel(event);
    };

    const onPointerDown = (event) => {
      hasMovedRef.current = false;
      pointerStartRef.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerMove = (event) => {
      const dx = Math.abs(event.clientX - pointerStartRef.current.x);
      const dy = Math.abs(event.clientY - pointerStartRef.current.y);
      if (dx > 5 || dy > 5) {
        hasMovedRef.current = true;
      }
    };

    parent.addEventListener('wheel', onWheel, { passive: false });
    parent.addEventListener('pointerdown', onPointerDown);
    parent.addEventListener('pointermove', onPointerMove);

    return () => {
      parent.removeEventListener('wheel', onWheel);
      parent.removeEventListener('pointerdown', onPointerDown);
      parent.removeEventListener('pointermove', onPointerMove);
      panzoom.destroy();
    };
  }, [seatMapData]);

  const handleSeatClick = (seat) => {
    if (hasMovedRef.current) return;
    onToggleSeat?.(seat);
  };

  const zoomIn = () => panzoomInstanceRef.current?.zoomIn();
  const zoomOut = () => panzoomInstanceRef.current?.zoomOut();
  const reset = () => panzoomInstanceRef.current?.reset();

  if (!seatMapData?.sections) {
    return (
      <div className="booking-seatmap-loading">
        Loading seat map...
      </div>
    );
  }

  const selectedCodes = new Set(selectedSeats.map((s) => s.code));

  return (
    <div className="booking-panzoom-container">
      <div className="booking-panzoom-controls">
        <button type="button" onClick={zoomIn} title="Zoom In" className="panzoom-btn">
          <Plus size={16} />
        </button>
        <button type="button" onClick={zoomOut} title="Zoom Out" className="panzoom-btn">
          <Minus size={16} />
        </button>
        <button type="button" onClick={reset} title="Reset View" className="panzoom-btn">
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="booking-panzoom-viewport">
        <div ref={panzoomAreaRef} className="booking-panzoom-area">
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
                              onToggle={() => handleSeatClick(seat)}
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

          {/* legend */}
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
      </div>
    </div>
  );
}
