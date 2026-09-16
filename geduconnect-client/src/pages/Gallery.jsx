import { useEffect, useState } from "react";
import api from "../api/api";
import "./Gallery.css";

/* =========================================================
   BASE URL
========================================================= */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = API_BASE.replace("/api", "");

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

/* =========================================================
   SLIDER IMAGE
========================================================= */
const SliderImg = ({ img }) => {
  const [err, setErr] = useState(false);
  const src = getImageUrl(img.image_url);

  if (!src || err) {
    return <div className="gallery__slider-fallback" />;
  }

  return (
    <img
      src={src}
      alt={img.title || "Gallery"}
      className="gallery__slider-img"
      onError={() => setErr(true)}
    />
  );
};

/* =========================================================
   GRID CARD — rounded image + title below
========================================================= */
const GridCard = ({ img, onClick }) => {
  const [err, setErr] = useState(false);
  const src = getImageUrl(img.image_url);
  const showFallback = !src || err;

  return (
    <div className="gallery__grid-card" onClick={onClick}>
      <div className="gallery__grid-img-wrap">
        {showFallback ? (
          <div className="gallery__grid-fallback">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 15l5-5 4 4 3-3 4 4" />
              <circle cx="8.5" cy="8.5" r="1.5" />
            </svg>
          </div>
        ) : (
          <img
            src={src}
            alt={img.title || "Gallery"}
            loading="lazy"
            className="gallery__grid-img"
            onError={() => setErr(true)}
          />
        )}
        {/* hover overlay */}
        <div className="gallery__grid-hover">
          <span className="gallery__grid-preview">👁 Preview</span>
        </div>
      </div>
      {/* title below card */}
      <p className="gallery__grid-title">{img.title || "Gallery Image"}</p>
    </div>
  );
};

/* =========================================================
   LIGHTBOX
========================================================= */
const Lightbox = ({ images, activeIndex, onClose, onPrev, onNext }) => {
  const active = images[activeIndex];
  if (!active) return null;
  const stop = (e) => e.stopPropagation();

  return (
    <div className="gallery__lightbox" onClick={onClose}>
      {/* counter */}
      <div className="gallery__lightbox-counter" onClick={stop}>
        <strong>{activeIndex + 1}</strong> / {images.length}
      </div>

      {/* close */}
      <span
        className="gallery__lightbox-close"
        onClick={(e) => { stop(e); onClose(); }}
      >
        ×
      </span>

      {/* prev */}
      {images.length > 1 && (
        <span
          className="gallery__lightbox-prev"
          onClick={(e) => { stop(e); onPrev(); }}
        >
          ‹
        </span>
      )}

      {/* image */}
      <img
        key={active.id}
        src={getImageUrl(active.image_url)}
        alt={active.title}
        className="gallery__lightbox-img"
        onClick={stop}
      />

      {/* next */}
      {images.length > 1 && (
        <span
          className="gallery__lightbox-next"
          onClick={(e) => { stop(e); onNext(); }}
        >
          ›
        </span>
      )}

      {/* info panel */}
      {(active.title || active.caption || active.date || active.location || active.category) && (
        <div className="gallery__lightbox-info" onClick={stop}>
          {active.title && (
            <h3 className="gallery__lightbox-info-title">{active.title}</h3>
          )}
          {active.caption && (
            <p className="gallery__lightbox-info-caption">{active.caption}</p>
          )}
          <div className="gallery__lightbox-meta">
            {active.date && (
              <span><strong>Date:</strong> {formatDate(active.date)}</span>
            )}
            {active.location && (
              <span><strong>Location:</strong> {active.location}</span>
            )}
            {active.category && (
              <span><strong>Category:</strong> {active.category}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   GALLERY MAIN
========================================================= */
const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get("/public/gallery");
      setImages(res.data || []);
    } catch (err) {
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  /* ── Slider ─────────────────────────── */
  const sliderPrev = () =>
    setSliderIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const sliderNext = () =>
    setSliderIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  /* ── Lightbox ────────────────────────── */
  const openLightbox = (i) => {
    setLightboxIndex(i);
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "auto";
  };
  const lbPrev = () =>
    setLightboxIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const lbNext = () =>
    setLightboxIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  /* ── Keyboard ────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") lbNext();
      if (e.key === "ArrowLeft") lbPrev();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, images]);

  const sliderImg = images[sliderIndex] || null;

  return (
    <>
      <section className="gallery__section">
        <div className="gallery__container">

          {/* ============================================
              HEADER
          ============================================ */}
          <div className="gallery__header">
            <h1 className="gallery__header-title">Our Gallery</h1>
            <p className="gallery__header-subtitle">
              Moments, Milestones &amp; Memories at G Educonnect
            </p>
          </div>

          {/* ============================================
              SLIDER
          ============================================ */}
          {loading ? (
            <div className="gallery__slider-skeleton" />
          ) : images.length > 0 && sliderImg && (
            <div className="gallery__slider">
              {/* bg image */}
              <SliderImg img={sliderImg} />

              {/* dark overlay for text contrast */}
              <div className="gallery__slider-overlay" />

              {/* caption + meta at bottom */}
              <div className="gallery__slider-bottom">
                {sliderImg.caption && (
                  <p className="gallery__slider-caption">{sliderImg.caption}</p>
                )}
                <div className="gallery__slider-meta">
                  {sliderImg.date && (
                    <span>
                      <strong>Date: </strong>{formatDate(sliderImg.date)}
                    </span>
                  )}
                  {sliderImg.location && (
                    <span>
                      <strong>Location: </strong>{sliderImg.location}
                    </span>
                  )}
                  {sliderImg.category && (
                    <span>
                      <strong>Category: </strong>{sliderImg.category}
                    </span>
                  )}
                </div>
              </div>

              {/* arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className="gallery__slider-arrow gallery__slider-arrow--prev"
                    onClick={sliderPrev}
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    className="gallery__slider-arrow gallery__slider-arrow--next"
                    onClick={sliderNext}
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}

          {/* ============================================
              GRID
          ============================================ */}
          {loading ? (
            <div className="gallery__grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="gallery__grid-skeleton" key={i} />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="gallery__empty">No gallery images yet.</div>
          ) : (
            <div className="gallery__grid">
              {images.map((img, index) => (
                <GridCard
                  key={img.id}
                  img={img}
                  onClick={() => openLightbox(index)}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ============================================
          LIGHTBOX
      ============================================ */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={lbPrev}
          onNext={lbNext}
        />
      )}
    </>
  );
};

export default Gallery;