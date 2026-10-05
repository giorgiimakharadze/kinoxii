import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Timer, Ticket } from "lucide-react";
import { moviesApi } from "../../services/api";
import "./Hero.css";

const AUTOPLAY = 6000; // 6 secs movie on display

function formatPremiereDate(dateStr) {
  if (!dateStr) return "NOW SHOWING";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "NOW SHOWING";

  const day = date.getUTCDate();
  const month = date
    .toLocaleString("en-GB", { month: "short", timeZone: "UTC" })
    .toUpperCase();

  return `WEEK OF ${day} ${month}`;
}

export default function Hero({ onBuyTickets, onAllSessions }) {
  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      try {
        const res = await moviesApi.getFeatured();
        if (cancelled) return;
        setMovies(res?.data || []);
        setActiveIndex(0);
      } catch (err) {
        if (!cancelled) console.error("Failed to load featured movies:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = movies.length;
  const autoplay = total > 1;
  const paused = isHovered || hasFocus;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (total ? (prev + 1) % total : 0));
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (total ? (prev - 1 + total) % total : 0));
  }, [total]);

  if (loading) return <div className="skeleton" />;
  if (total === 0) return null; // failed or nothing featured, render nothing

  const currentMovie = movies[activeIndex];

  return (
    <section
      className="section"
      aria-roledescription="carousel"
      aria-label="Featured films"
      style={{ "--autoplay-ms": `${AUTOPLAY}ms` }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={(e) => {
        if (e.target.matches(":focus-visible")) setHasFocus(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHasFocus(false);
      }}
    >
      {/* background backdrops with smooth fade */}
      <div className="backdrop-cont" aria-hidden="true">
        {movies.map((movie, idx) => (
          <div
            key={movie.id}
            className={`backdrop-slide ${idx === activeIndex ? "active" : ""}`}
            style={{
              backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
            }}
          />
        ))}
        <div className="gradient-overlay" />
      </div>

      <div className="content" aria-live={autoplay && !paused ? "off" : "polite"}>
        {/* premiere tag */}
        <div className="premiere-tag">
          <span className="premiere-highlight">PREMIERE</span>
          <span className="premiere-separator">·</span>
          <span>{formatPremiereDate(currentMovie.releaseDate)}</span>
        </div>

        {/* title */}
        <h1 key={`title-${currentMovie.id}`} className="title">
          {currentMovie.title}
        </h1>

        {/* age, runtime, formats */}
        <div className="badges">
          {currentMovie.ageRating && (
            <span className="badge age-badge">{currentMovie.ageRating.code}</span>
          )}

          {currentMovie.runtimeMinutes && (
            <span className="badge meta-badge">
              <Timer size={14} className="badge-icon" />
              {currentMovie.runtimeMinutes} Min
            </span>
          )}

          {currentMovie.formats?.map((fmt) => (
            <span key={fmt.id} className="badge format-badge">
              {fmt.name}
            </span>
          ))}
        </div>

        {/* synopsis */}
        <p key={`synopsis-${currentMovie.id}`} className="synopsis">
          {currentMovie.synopsis}
        </p>

        {/* action buttons */}
        <div className="actions">
          <button
            type="button"
            className="buy-btn"
            onClick={() => onBuyTickets?.(currentMovie)}
          >
            <Ticket size={16} />
            <span>Buy tickets</span>
          </button>
          <button
            type="button"
            className="sessions-btn"
            onClick={() => onAllSessions?.(currentMovie)}
          >
            All sessions
          </button>
        </div>

      </div>

      {/* bottom bar: progress segments (CSS animation, no JS timers) + arrows */}
      <div className="bottom-bar">
        <div className="segments">
          {movies.map((m, idx) => {
            const isActive = idx === activeIndex;

            let fill;
            if (isActive && autoplay) {
              // key restarts the animation whenever the slide changes
              fill = (
                <span
                  key={`fill-${m.id}-${activeIndex}`}
                  className={`segment-fill playing ${paused ? "paused" : ""}`}
                  onAnimationEnd={nextSlide}
                />
              );
            } else {
              fill = (
                <span
                  className="segment-fill"
                  style={{
                    width: isActive || idx < activeIndex ? "100%" : "0%",
                  }}
                />
              );
            }

            return (
              <button
                key={m.id}
                type="button"
                className="segment-track"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Go to ${m.title}`}
                aria-current={isActive}
              >
                {fill}
              </button>
            );
          })}
        </div>

        <div className="nav-arrows">
          <button
            type="button"
            className="arrow-btn"
            onClick={prevSlide}
            aria-label="Previous film"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="arrow-btn"
            onClick={nextSlide}
            aria-label="Next film"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}