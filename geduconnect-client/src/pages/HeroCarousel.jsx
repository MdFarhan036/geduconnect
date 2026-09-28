import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Network,
  Play,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";

import api from "../api/api";

import "./HeroCarousel.css";

/* =========================================================
   API / ASSET URL
========================================================= */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const BASE_URL = API_BASE.replace(/\/api\/?$/, "");

const resolveUrl = (url) => {
  if (!url) return "";

  if (/^(https?:|data:|blob:)/i.test(url)) {
    return url;
  }

  return `${BASE_URL}/${url.replace(/^\/+/, "")}`;
};

/* =========================================================
   AUDIENCE CTA FALLBACK
========================================================= */

const audiences = {
  student: {
    text: "Get Guidance",
    href: "/contact?audience=student",
  },

  university: {
    text: "Partner With Us",
    href: "/contact?audience=university",
  },

  consultant: {
    text: "Join Our Network",
    href: "/consultantNetwork",
  },
};

/* =========================================================
   STATS
========================================================= */

const stats = [
  {
    value: "500+",
    label: "University Partners",
    Icon: School,
  },
  {
    value: "10,000+",
    label: "Students Guided",
    Icon: GraduationCap,
  },
  {
    value: "200+",
    label: "Consultants",
    Icon: Users,
  },
  {
    value: "95%",
    label: "Satisfaction Rate",
    Icon: ShieldCheck,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function HeroCarousel() {
  const [universities, setUniversities] = useState([]);
  const [heroes, setHeroes] = useState([]);

  const [audience, setAudience] = useState("student");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  const trackRef = useRef(null);

  /* =======================================================
     FETCH HERO
  ======================================================= */

  useEffect(() => {
    const controller = new AbortController();

    const fetchHero = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/public/home", {
          signal: controller.signal,
        });

        const images = Array.isArray(data?.hero?.images)
          ? data.hero.images
          : [];

        const sortedImages = [...images].sort(
          (a, b) =>
            Number(a?.sort_order || 0) -
            Number(b?.sort_order || 0)
        );

        setHeroes(sortedImages);
        setActive(0);
      } catch (error) {
        if (
          error?.name !== "CanceledError" &&
          error?.code !== "ERR_CANCELED"
        ) {
          console.error(
            "Failed to load hero data:",
            error
          );
        }

        setHeroes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();

    return () => controller.abort();
  }, []);

  /* =======================================================
     FETCH UNIVERSITY PARTNERS
  ======================================================= */

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/public/clients", {
        signal: controller.signal,
      })
      .then(({ data }) => {
        const clients = Array.isArray(data)
          ? data
          : data?.clients || data?.data || [];

        setUniversities(
          clients.filter(
            (client) =>
              String(client?.type || "").toLowerCase() ===
              "university"
          )
        );
      })
      .catch((error) => {
        if (
          error?.name !== "CanceledError" &&
          error?.code !== "ERR_CANCELED"
        ) {
          console.error(
            "Failed to load universities:",
            error
          );
        }
      });

    return () => controller.abort();
  }, []);

  /* =======================================================
     AUTO SLIDER
  ======================================================= */

  useEffect(() => {
    if (
      paused ||
      heroes.length <= 1 ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActive(
        (current) =>
          (current + 1) % heroes.length
      );
    }, 6500);

    return () => window.clearInterval(timer);
  }, [paused, heroes.length]);

  /* =======================================================
     KEEP ACTIVE INDEX VALID
  ======================================================= */

  useEffect(() => {
    if (heroes.length === 0) {
      setActive(0);
      return;
    }

    if (active >= heroes.length) {
      setActive(0);
    }
  }, [heroes.length, active]);

  /* =======================================================
     MOVE SLIDE
  ======================================================= */

  const moveSlide = (direction) => {
    if (heroes.length <= 1) return;

    setActive(
      (current) =>
        (current + direction + heroes.length) %
        heroes.length
    );
  };

  /* =======================================================
     PARTNER SCROLL
  ======================================================= */

  const scrollPartners = (direction) => {
    if (!trackRef.current) return;

    trackRef.current.scrollBy({
      left:
        direction *
        Math.max(
          180,
          trackRef.current.clientWidth * 0.65
        ),
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="ge-home-hero">
        <div className="ge-home-hero__body">
          <div className="ge-home-hero__copy">
            <p className="ge-home-hero__eyebrow">
              YOUR PARTNER IN EDUCATION GROWTH
            </p>

            <h1>
              Empowering Education
              <br />
              <span>Together</span>
            </h1>

            <p className="ge-home-hero__subtitle">
              Connecting Students, Universities and
              Consultants for a Brighter Future.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     NO HERO
  ======================================================= */

  if (!heroes.length) {
    return null;
  }

  /* =======================================================
     ACTIVE HERO
  ======================================================= */

  const slide = heroes[active] || heroes[0];

  /* =======================================================
     DATABASE FIELDS
  ======================================================= */

  const imageUrl = resolveUrl(
    slide?.image_url
  );

  const subtitle =
    slide?.subtitle || "";

  const title =
    slide?.title || "";

  const description =
    slide?.description || "";

  /* =======================================================
     CTA 1
  ======================================================= */

  const audienceCta =
    audiences[audience] ||
    audiences.student;

  const cta1Text =
    slide?.primary_cta_text ||
    audienceCta.text;

  const cta1Link =
    slide?.primary_cta_link ||
    audienceCta.href;

  /* =======================================================
     CTA 2
  ======================================================= */

  const cta2Text =
    slide?.secondary_cta_text ||
    "";

  const cta2Link =
    slide?.secondary_cta_link ||
    "/about";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      className="ge-home-hero"
      aria-roledescription="carousel"
      aria-label="G Educonnect highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          moveSlide(-1);
        }

        if (event.key === "ArrowRight") {
          moveSlide(1);
        }
      }}
      tabIndex={0}
    >
      {/* =================================================
          HERO MAIN
      ================================================= */}

      <div
        className="ge-home-hero__main"
        key={slide?.id || active}
      >
        {/* =================================================
            LEFT CONTENT
        ================================================= */}

        <div className="ge-home-hero__body">
          <div className="ge-home-hero__copy">

            {/* SUBTITLE */}

            {subtitle && (
              <p className="ge-home-hero__eyebrow">
                {subtitle}
              </p>
            )}

            {/* TITLE */}

            {title && (
              <h1 id="ge-home-title">
                {title}
              </h1>
            )}

            {/* DESCRIPTION */}

            {description && (
              <p className="ge-home-hero__subtitle">
                {description}
              </p>
            )}

            {/* CTA AREA */}

            {(cta1Text || cta2Text) && (
              <div className="ge-home-hero__actions-row">

                {/* PRIMARY CTA */}

                {cta1Text && (
                  <Link
                    to={cta1Link || "#"}
                    className="ge-home-hero__cta"
                  >
                    {cta1Text}

                    <ArrowRight
                      size={19}
                      aria-hidden="true"
                    />
                  </Link>
                )}

                {/* SECONDARY CTA */}

                {cta2Text && (
                  <Link
                    to={cta2Link || "#"}
                    className="ge-home-hero__secondary"
                  >
                    <span className="ge-home-hero__play">
                      <Play
                        size={12}
                        fill="currentColor"
                      />
                    </span>

                    {cta2Text}
                  </Link>
                )}
              </div>
            )}

            {/* OPTIONAL AUDIENCE SELECTOR */}

       
          </div>
        </div>

        {/* =================================================
            RIGHT IMAGE
        ================================================= */}

     <div className="ge-home-hero__visual">

  <div className="ge-home-hero__slides">
    {heroes.map((item, index) => {
      const image = resolveUrl(
        item?.image_url
      );

      if (!image) return null;

      return (
        <img
          key={
            item?.id ||
            `${item?.image_url}-${index}`
          }
          className={`ge-home-hero__art ${
            index === active
              ? "is-active"
              : ""
          }`}
          src={image}
          alt={item?.title || ""}
          fetchPriority={
            index === active
              ? "high"
              : "auto"
          }
        />
      );
    })}
  </div>

  <div
    className="ge-home-hero__note"
    aria-hidden="true"
  >
    Better
    <br />
    Education
    <br />
    Brighter
    <br />
    Tomorrows

    <svg
      viewBox="0 0 130 110"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M100 5C145 58 73 82 16 95m0 0 12-17m-12 17 23 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>

</div>
        {/* =================================================
            SLIDE ARROWS
        ================================================= */}

        {heroes.length > 1 && (
          <>
            <button
              className="ge-home-hero__arrow ge-home-hero__arrow--left"
              type="button"
              onClick={() => moveSlide(-1)}
              aria-label="Previous slide"
            >
              <ChevronLeft />
            </button>

            <button
              className="ge-home-hero__arrow ge-home-hero__arrow--right"
              type="button"
              onClick={() => moveSlide(1)}
              aria-label="Next slide"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* =================================================
            DOTS
        ================================================= */}

        {heroes.length > 1 && (
          <div
            className="ge-home-hero__dots"
            role="tablist"
            aria-label="Choose hero slide"
          >
            {heroes.map((item, index) => (
              <button
                key={item?.id || index}
                type="button"
                className={
                  index === active
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  setActive(index)
                }
                aria-label={`Show slide ${
                  index + 1
                }`}
                aria-selected={
                  index === active
                }
                role="tab"
              />
            ))}
          </div>
        )}
      </div>

      {/* =================================================
          LOWER CARD
      ================================================= */}

      <div className="ge-home-hero__lower-card">

        {/* STATS */}

        <div className="ge-home-hero__stats">
          {stats.map(
            ({
              value,
              label,
              Icon,
            }) => (
              <div key={label}>
                <Icon />

                <strong>
                  {value}
                </strong>

                <small>
                  {label}
                </small>
              </div>
            )
          )}
        </div>

        {/* PARTNER UNIVERSITIES */}

        {universities.length > 0 && (
          <div
            className="ge-home-hero__partners"
            aria-label="Our partner universities"
          >
            <p>
              Our Partner Universities
            </p>

            <div className="ge-home-hero__partner-row">

              <button
                type="button"
                aria-label="Previous universities"
                onClick={() =>
                  scrollPartners(-1)
                }
              >
                <ChevronLeft size={18} />
              </button>

              <div
                className="ge-home-hero__track"
                ref={trackRef}
              >
                {universities.map(
                  (uni, index) => (
                    <Link
                      key={
                        uni?.id ||
                        `${uni?.slug}-${index}`
                      }
                      to={
                        uni?.slug
                          ? `/university/${uni.slug}`
                          : "/clients"
                      }
                      className="ge-home-hero__partner"
                      title={
                        uni?.name ||
                        undefined
                      }
                    >
                      {uni?.logo_url ? (
                        <img
                          src={resolveUrl(
                            uni.logo_url
                          )}
                          alt={
                            uni?.name ||
                            "Partner university"
                          }
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.hidden =
                              true;

                            if (
                              event.currentTarget
                                .nextElementSibling
                            ) {
                              event.currentTarget
                                .nextElementSibling
                                .hidden = false;
                            }
                          }}
                        />
                      ) : null}

                      <span
                        hidden={Boolean(
                          uni?.logo_url
                        )}
                      >
                        {uni?.name ||
                          "University"}
                      </span>
                    </Link>
                  )
                )}
              </div>

              <button
                type="button"
                aria-label="Next universities"
                onClick={() =>
                  scrollPartners(1)
                }
              >
                <ChevronRight size={18} />
              </button>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
