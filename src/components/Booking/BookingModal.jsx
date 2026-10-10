import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { bookingApi } from '../../services/api';
import SeatMap from './Step1Seats/SeatMap';
import SelectedSeatsPanel from './Step1Seats/SelectedSeatsPanel';
import './BookingModal.css';

export default function BookingModal({
  session,
  user,
  isOpen,
  onClose,
  onNavigateToProfile,
  onOpenLogin,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holdData, setHoldData] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(''), 4000);
  };

  const loadSeatMap = useCallback(async () => {
    if (!session?.id) return;
    try {
      const res = await bookingApi.getSeatMap(session.id);
      if (res?.data) {
        setSeatMap(res.data);
      }
    } catch (err) {
      console.warn('Failed to load seats:', err);
    }
  }, [session?.id]);

  useEffect(() => {
    if (isOpen && session) {
      setCurrentStep(1);
      setSelectedSeats([]);
      setHoldData(null);
      setTimeLeft(null);
      setToastMessage('');
      loadSeatMap();
    }
  }, [isOpen, session, loadSeatMap]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);


  useEffect(() => {
    if (!holdData?.expiresAt) return;

    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(holdData.expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        clearInterval(timerIntervalRef.current);
        showToast('Your hold time expired. Please re-select your seats.');
        setHoldData(null);
        setSelectedSeats([]);
        setCurrentStep(1);
        loadSeatMap();
      }
    };

    tick();
    timerIntervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, [holdData, loadSeatMap]);

  const formatTimer = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds === undefined) return '8:00';
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleToggleSeat = (seat) => {
    const isAlreadySelected = selectedSeats.some((s) => s.code === seat.code);

    if (isAlreadySelected) {
      setSelectedSeats((prev) => prev.filter((s) => s.code !== seat.code));
    } else {
      if (selectedSeats.length >= 3) {
        showToast('Maximum 3 seats allowed per order.');
        return;
      }
      setSelectedSeats((prev) => [
        ...prev,
        {
          seatId: seat.id,
          code: seat.code,
          ticketType: 'adult',
        },
      ]);
    }
  };

  const handleRemoveSeat = (code) => {
    setSelectedSeats((prev) => prev.filter((s) => s.code !== code));
  };

  const handleTicketTypeChange = (code, type) => {
    setSelectedSeats((prev) =>
      prev.map((s) => (s.code === code ? { ...s, ticketType: type } : s))
    );
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      onOpenLogin?.();
      return;
    }
    if (!user.profileComplete) {
      onClose();
      onNavigateToProfile?.();
      return;
    }

    if (selectedSeats.length === 0) return;

    setIsHolding(true);
    try {
      const payload = selectedSeats.map((s) => ({
        seatId: s.seatId,
        ticketType: s.ticketType,
      }));

      const res = await bookingApi.createHold(session.id, payload);
      if (res?.data) {
        setHoldData(res.data);
        setCurrentStep(2);
      }
    } catch (err) {
      if (err.status === 409) {
        const contested = err.data?.contested || [];
        showToast(
          contested.length > 0
            ? `Seats ${contested.join(', ')} were just taken by someone else.`
            : 'Some of your chosen seats are no longer available.'
        );

        setSelectedSeats((prev) => prev.filter((s) => !contested.includes(s.code)));

        await loadSeatMap();
      } else {
        showToast(err.message || 'Could not hold seats. Please try again.');
      }
    } finally {
      setIsHolding(false);
    }
  };

  if (!isOpen || !session) return null;

  const movie = session.movie;
  const langName = session.language?.name || session.language?.code || 'Original + Subtitles';

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-card">
        <button
          type="button"
          className="booking-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="booking-modal-header">
          <div className="booking-header-left">
            <h2 className="booking-movie-title">{movie?.title || 'Movie Title'}</h2>
            <div className="booking-session-meta">
              <span>{session.venue?.name}</span>
              <span>·</span>
              <span>{session.hall?.name ? `Hall ${session.hall.name}` : ''}</span>
              <span>·</span>
              <span>{session.date} {session.time}</span>
              <span>·</span>
              <span>{session.format?.name}</span>
              <span>·</span>
              <span>{langName}</span>
            </div>
          </div>

          {holdData && (
            <div className="booking-timer-badge">
              <span className="booking-timer-label">SEATS HELD</span>
              <span className="booking-timer-clock">{formatTimer(timeLeft)}</span>
            </div>
          )}
        </div>

        <div className="booking-steps-bar">
          <button
            type="button"
            className={`booking-step-btn ${currentStep === 1 ? 'active' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            SEATS
          </button>
          <button
            type="button"
            className={`booking-step-btn ${currentStep === 2 ? 'active' : ''}`}
            disabled={!holdData}
          >
            CHECKOUT
          </button>
        </div>

        <div className="booking-modal-body">
          {currentStep === 1 ? (
            <div className="booking-step1-layout">
              <div className="booking-step1-map-col">
                <SeatMap
                  seatMapData={seatMap}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                />
              </div>

              <div className="booking-step1-panel-col">
                <SelectedSeatsPanel
                  selectedSeats={selectedSeats}
                  basePrice={session.price}
                  filmAgeRating={movie?.ageRating}
                  onTypeChange={handleTicketTypeChange}
                  onRemoveSeat={handleRemoveSeat}
                  onProceed={handleProceedToCheckout}
                  isHolding={isHolding}
                />
              </div>
            </div>
          ) : (
            <div className="booking-checkout-placeholder">
              <h3>Step 2: Checkout not implemented yet</h3>
              <p>Hold ID: {holdData?.holdId}</p>
            </div>
          )}
        </div>

        {toastMessage && (
          <div className="booking-toast-alert">
            <AlertCircle size={18} />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
