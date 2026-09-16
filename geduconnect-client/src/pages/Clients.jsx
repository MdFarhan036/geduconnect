import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Clients.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = API_BASE.replace("/api", "");

const getImageUrl = (path) => {
  if (!path) return "";
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

/* ─────────────────────────────────────────
   3D CAROUSEL
───────────────────────────────────────── */
function Carousel3D({ items, onCardClick }) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const total = items.length;

  const prev = useCallback(() =>
    setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() =>
    setActive((a) => (a + 1) % total), [total]);

  /* drag / swipe */
  const onPointerDown = (e) => {
    dragStart.current = e.clientX;
    setDragging(false);
  };
  const onPointerMove = (e) => {
    if (dragStart.current === null) return;
    if (Math.abs(e.clientX - dragStart.current) > 6) setDragging(true);
  };
  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    dragStart.current = null;
  };

  /* keyboard */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  /* auto-rotate every 5 seconds */
  useEffect(() => {
    const timer = setInterval(() => next(), 2000);
    return () => clearInterval(timer);
  }, [next]);

  /* position each card */
  const getCardStyle = (i) => {
    const offset = ((i - active + total) % total);
    const normalized = offset > total / 2 ? offset - total : offset;
    const visible = Math.abs(normalized) <= 3;

    const absOff = Math.abs(normalized);
    const sign = normalized < 0 ? -1 : normalized > 0 ? 1 : 0;

    // Spread cards further apart to fill the wide stage
    const gaps = [0, 240, 430, 580];
    const translateX = sign * (gaps[Math.min(absOff, 3)] || 510);
    const translateZ = -absOff * 90;
    const rotateY   = sign * Math.min(absOff * 12, 36);
    const scale     = absOff === 0 ? 1 : absOff === 1 ? 0.84 : absOff === 2 ? 0.68 : 0.54;
    const opacity   = visible ? (absOff === 0 ? 1 : absOff === 1 ? 0.88 : absOff === 2 ? 0.65 : 0.38) : 0;
    const zIndex    = visible ? 10 - absOff : 0;
    const blur      = absOff >= 2 ? 1.5 : 0;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      pointerEvents: visible && !dragging ? "auto" : "none",
    };
  };

  if (!total) return null;

  return (
    <div className="c3d-root">
      <div
        className="c3d-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="c3d-track">
          {items.map((item, i) => {
            const isCenter = ((i - active + total) % total) === 0;
            return (
              <div
                key={item.id || i}
                className={`c3d-card${isCenter ? " c3d-card--active" : ""}`}
                style={getCardStyle(i)}
                onClick={() => {
                  if (dragging) return;
                  if (isCenter && item.slug) onCardClick(item.slug);
                  else if (!isCenter) setActive(i);
                }}
              >
                {/* logo */}
                <div className="c3d-logo-wrap">
                  {item.logo_url ? (
                    <img
                      src={getImageUrl(item.logo_url)}
                      alt={item.name}
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <div className="c3d-logo-placeholder">
                      {item.name?.charAt(0)}
                    </div>
                  )}
                </div>

                {/* info — only on active */}
                {isCenter && (
                  <div className="c3d-info">
                    <h4>{item.name}</h4>
                    {item.total_courses != null && (
                      <span>{item.total_courses} Courses</span>
                    )}
                    {item.slug && (
                      <button className="c3d-cta">
                        Explore →
                      </button>
                    )}
                  </div>
                )}

                {/* shimmer on active */}
                {isCenter && <div className="c3d-shimmer" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* dots + arrows */}
      <div className="c3d-controls">
        <div className="c3d-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`c3d-dot${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="c3d-arrows">
          <button className="c3d-arrow" onClick={prev} aria-label="Previous">←</button>
          <button className="c3d-arrow" onClick={next} aria-label="Next">→</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [activeMode, setActiveMode] = useState("online");

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get("/public/clients");
      setClients(res.data || []);
    } catch (err) {
      console.error("Error loading clients:", err);
    }
  };

  if (!clients.length) return null;

  const universities = clients.filter(
    (c) => c.type === "university" && c.mode === activeMode
  );
  const partners = clients.filter((c) => c.type === "partner");

  const MODES = ["online", "regular", "distance"];

  return (
    <>
      {/* ═══════════════════════════════════════
          UNIVERSITIES — 3D CAROUSEL
      ═══════════════════════════════════════ */}
      <section className="cl-section">

        {/* heading */}
        <div className="cl-head">
          <div className="cl-eyebrow">Our Network</div>
          <h2 className="cl-title">Partnered Universities</h2>
          <p className="cl-sub">Explore our partner universities by mode of study.</p>
        </div>

        {/* mode tabs */}
        <div className="cl-tabs">
          {MODES.map((m) => (
            <button
              key={m}
              className={`cl-tab${activeMode === m ? " cl-tab--active" : ""}`}
              onClick={() => setActiveMode(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* carousel */}
        {universities.length > 0 ? (
          <Carousel3D
            items={universities}
            onCardClick={(slug) => navigate(`/university/${slug}`)}
          />
        ) : (
          <p className="cl-empty">No universities available in this mode.</p>
        )}
      </section>

      {/* ═══════════════════════════════════════
          PARTNERS — logo strip
      ═══════════════════════════════════════ */}
      {partners.length > 0 && (
        <section className="cl-section cl-section--dark">
          <div className="cl-head">
            <div className="cl-eyebrow cl-eyebrow--light">Trusted By</div>
            <h2 className="cl-title cl-title--light">Our Global Partners</h2>
          </div>
          <div className="cl-partner-strip">
            {partners.map((p) => (
              <div key={p.id} className="cl-partner-card">
                {p.logo_url && (
                  <img src={getImageUrl(p.logo_url)} alt={p.name} loading="lazy" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}