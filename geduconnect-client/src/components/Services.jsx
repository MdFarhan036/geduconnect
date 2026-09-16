import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Services.css";

/* ================= BASE URL ================= */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const BASE_URL = API_BASE.replace("/api", "");

/* ================= IMAGE URL FIX ================= */

const getImageUrl = (path) => {
  if (!path) return null;

  // already full URL
  if (path.startsWith("http")) return path;

  return `${BASE_URL}${
    path.startsWith("/") ? "" : "/"
  }${path}`;
};

/* =========================================================
   SINGLE CARD
========================================================= */

function ServiceCard({ service, index, onClick }) {
  const [visible, setVisible] = useState(false);

  const ref = useRef(null);

  /* ================= INTERSECTION ================= */

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  /* ================= HOVER EFFECT ================= */

  const handleMouseMove = (e) => {
    const card = ref.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX =
      ((y - centerY) / centerY) * -8;

    const rotateY =
      ((x - centerX) / centerX) * 8;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);

    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-10px)
      scale(1.02)
    `;
  };

  const resetCard = () => {
    if (!ref.current) return;

    ref.current.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0px)
      scale(1)
    `;
  };

  /* ================= UI ================= */

  return (
    <div
      ref={ref}
      className={`svc-card ${
        visible ? "svc-card--visible" : ""
      }`}
      style={{
        "--delay": `${index * 0.12}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetCard}
      onClick={onClick}
    >
      {/* EFFECTS */}

      <div className="svc-card__noise"></div>

      <div className="svc-card__gradient"></div>

      <div className="svc-card__spotlight"></div>

      <div className="svc-card__border"></div>

      {/* INDEX */}

      <span className="svc-card__index">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* ICON */}

      <div className="svc-card__icon-wrap">
        {service.icon ? (
          <img
            src={service.icon}
            alt={service.title}
          />
        ) : (
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />

            <path d="M12 6v6l4 2" />
          </svg>
        )}
      </div>

      {/* BODY */}

      <div className="svc-card__body">
        <h3 className="svc-card__title">
          {service.title}
        </h3>

        <p className="svc-card__desc">
          {service.subtitle ||
            "Explore our premium education services."}
        </p>
      </div>

      {/* CTA */}

      <div className="svc-card__cta">
        <span>Explore Service</span>

        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>

      <div className="svc-card__bar"></div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export const Services = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const res = await api.get("/public/services");

      setServices(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(
        "Error loading services:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <section className="svc-section">
        <div className="svc-container">
          <div className="svc-loading">
            Loading services...
          </div>
        </div>
      </section>
    );
  }

  /* ================= EMPTY ================= */

  if (!services.length) {
    return (
      <section className="svc-section">
        <div className="svc-container">
          <div className="svc-empty">
            No services available
          </div>
        </div>
      </section>
    );
  }

  /* ================= UI ================= */

  return (
    <section className="svc-section">
      {/* BG ELEMENTS */}

      <div className="svc-bg-circle svc-bg-circle--tr" />

      <div className="svc-bg-circle svc-bg-circle--bl" />

      <div className="svc-container">
        {/* ================= HEADER ================= */}

        <div className="svc-head">
          <div className="svc-head__left">
            <p className="svc-eyebrow">
              What We Offer
            </p>

            <h2 className="svc-title">
              End-to-End <em>Education</em>{" "}
              Solutions
            </h2>

            <p className="svc-subtitle">
              At G Educonnect, we offer
              end-to-end solutions to help
              universities and education
              consultants grow faster and
              smarter — from admissions and
              marketing to publishing and
              tailored ERP/CRM tools.
            </p>
          </div>

          {/* COUNT */}

          <div className="svc-head__right">
            <div className="svc-count-pill">
              <span className="svc-count-pill__num">
                {services.length}
              </span>

              <span className="svc-count-pill__text">
                Premium Services
              </span>
            </div>
          </div>
        </div>

        {/* ================= DIVIDER ================= */}

        <div className="svc-divider">
          <span className="svc-divider__line" />

          <span className="svc-divider__diamond" />

          <span className="svc-divider__line svc-divider__line--rev" />
        </div>

        {/* ================= GRID ================= */}

        <div className="svc-grid">
          {services.map((service, i) => (
            <ServiceCard
              key={
                service.id || service.slug || i
              }
              index={i}
              service={{
                title:
                  service.title || "Untitled",

                subtitle: service.subtitle
                  ? service.subtitle.slice(
                      0,
                      110
                    ) + "…"
                  : "Explore our premium education solutions.",

                icon: getImageUrl(
                  service.icon_url
                ),
              }}
              onClick={() => {
                if (service.slug) {
                  navigate(
                    `/services/${service.slug}`
                  );
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};