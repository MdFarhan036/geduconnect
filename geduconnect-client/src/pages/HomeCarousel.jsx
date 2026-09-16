import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./HeroCarousel.css";

const IMAGE_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000";

export default function HomeCarousel() {
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetchHome();
  }, []);

  useEffect(() => {
    if (!data?.hero?.images?.length) return;

    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % data.hero.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  const fetchHome = async () => {
    try {
      const res = await api.get("/public/home");
      setData(res.data);
    } catch (err) {
      console.error("Error loading home:", err);
    }
  };

  if (!data?.hero) return null;

  const slides = data.hero.images || [];

  const getMediaUrl = (path) =>
    path ? `${IMAGE_BASE}${path.startsWith("/") ? "" : "/"}${path}` : "";

  return (
    <div className="carousel">
      {slides.length === 0 ? (
        <div className="color-banner">
          <div className="hero-content">
            <h2>{data.hero.title}</h2>
            <p>{data.hero.subtitle}</p>
          </div>
        </div>
      ) : (
        slides.map((slide, index) => {
          const mediaUrl = getMediaUrl(slide.image_url);
          return (
            <div
              key={slide.id || index}
              className={`slide ${index === current ? "active" : ""}`}
              style={{ backgroundImage: `url(${mediaUrl})` }}
            >
              <div
                className="color-banner"
                style={{ backgroundColor: slide.banner_color || "rgba(0,0,0,0.6)" }}
              >
                <div className="hero-content">
                  <h2>{slide.title}</h2>
                  <p>{slide.description}</p>

                  {slide.primary_cta_text && (
                    <a href={slide.primary_cta_link} className="hero-btn">
                      {slide.primary_cta_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* DOTS */}
      {slides.length > 0 && (
        <div className="dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === current ? "active-dot" : ""}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}