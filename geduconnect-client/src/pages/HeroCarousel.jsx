import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./HeroCarousel.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const BASE_URL = API_BASE.replace("/api", "");

const resolveUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

export default function HeroCarousel() {
  const navigate = useNavigate();

  const [hero, setHero] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  /* =========================================================
      LOAD HERO + UNIVERSITIES
  ========================================================= */

  useEffect(() => {
    fetchHero();
    fetchUniversities();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await api.get("/public/home");
      const heroData = {
        ...res.data.hero,
        video_url:
          res.data.hero.video_url ||
          "https://cdn.coverr.co/videos/coverr-business-meeting-2614/1080p.mp4",
      };
      setHero(heroData);
    } catch (err) {
      console.error("Hero load failed:", err);
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/public/clients");
      const filtered = (res.data || []).filter(
        (c) => c.type === "university"
      );
      // Duplicate for seamless infinite loop
      setUniversities([...filtered, ...filtered]);
    } catch (err) {
      console.error("University load failed:", err);
    }
  };

  /* =========================================================
      AUTO CONTINUOUS SCROLL + ACTIVE INDEX
  ========================================================= */

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || universities.length === 0) return;

    let animationFrame;
    const scrollSpeed = 0.5; // px per frame — lower = slower

    const updateActiveIndex = () => {
      const cards = slider.children;
      const sliderCenter = slider.scrollLeft + slider.offsetWidth / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(sliderCenter - cardCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
      setActiveIndex(closestIndex);
    };

    const autoScroll = () => {
      slider.scrollLeft += scrollSpeed;
      // Reset when halfway through the duplicated list (seamless loop)
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      }
      updateActiveIndex();
      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [universities]);

  /* =========================================================
      VIDEO PROGRESS
  ========================================================= */

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  if (!hero) return null;

  const slide = hero.images?.[0] || {};

  const title           = hero.title            || slide.title;
  const subtitle        = hero.subtitle          || slide.subtitle;
  const primaryCtaText  = hero.primary_cta_text  || slide.primary_cta_text;
  const primaryCtaLink  = hero.primary_cta_link  || slide.primary_cta_link;
  const secondaryCtaText = hero.secondary_cta_text || slide.secondary_cta_text;
  const secondaryCtaLink = hero.secondary_cta_link || slide.secondary_cta_link;

  const videoUrl  = resolveUrl(hero.video_url);
  const posterUrl = resolveUrl(hero.poster_url || slide.image_url);

  return (
    <section className="hero">

      {/* =========================================================
          VIDEO
      ========================================================= */}

      <div className="hero-media">
        {videoUrl ? (
          <video
            ref={videoRef}
            className="hero-video"
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
          <div
            className="hero-video hero-video-fallback"
            style={{ backgroundImage: `url(${posterUrl})` }}
          />
        )}
        <div className="hero-overlay" />
      </div>

      {/* =========================================================
          PLAY / PAUSE BUTTON
      ========================================================= */}

      {videoUrl && (
        <button className="hero-play-btn" onClick={togglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <rect x="6"  y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div className="hero-content-wrap">
        <div className="hero-content">

          <h1 className="hero-title">
            <div>INDIA'S FASTEST-</div>
            <div>GROWING UNIVERSITY</div>
            <div>PARTNERSHIP NETWORK</div>
          </h1>

          <div className="hero-cta-row">
            {primaryCtaText && (
              <a href={primaryCtaLink || "#"} className="btn-filled">
                {primaryCtaText}
              </a>
            )}
            {secondaryCtaText && (
              <a href={secondaryCtaLink || "#"} className="btn-outline">
                {secondaryCtaText}
              </a>
            )}
          </div>

          <p className="hero-subtitle">{subtitle}</p>

        </div>
      </div>

      {/* =========================================================
          AUTO-SCROLLING UNIVERSITY STRIP
      ========================================================= */}

      {universities.length > 0 && (
        <div className="university-strip">
          <div className="university-strip__track" ref={sliderRef}>
            {universities.map((uni, index) => {
              const isActive  = index === activeIndex;
              const isHovered = index === hoverIndex;

              return (
                <div
                  key={`${uni.id || uni.name}-${index}`}
                  className={`university-card${isActive ? " active" : ""}`}
                  onClick={() => navigate(`/university/${uni.slug}`)}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {uni.logo_url && (
                    <img
                      src={resolveUrl(uni.logo_url)}
                      alt={uni.name || "Partner"}
                      loading="lazy"
                    />
                  )}

                  <div className={`uni-name${isHovered || isActive ? " show" : ""}`}>
                    {uni.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          PROGRESS BAR
      ========================================================= */}

      <div className="hero-progress">
        <div
          className="hero-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

    </section>
  );
}