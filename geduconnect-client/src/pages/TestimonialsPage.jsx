import { useEffect, useState } from "react";
import api from "../api/api";
import "./TestimonialsPage.css";

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

/* =========================================================
   AVATAR (with initials fallback)
========================================================= */
const Avatar = ({ src, name }) => {
  const [err, setErr] = useState(false);

  const initials = (name || "")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "•";

  return (
    <div className="ts-avatar">
      {src && !err ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setErr(true)}
        />
      ) : (
        <div className="ts-avatar-fallback">{initials}</div>
      )}
    </div>
  );
};

/* =========================================================
   TESTIMONIALS PAGE
========================================================= */
export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [pageContent, setPageContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [testRes, pageRes] = await Promise.all([
        api.get("/public/testimonials"),
        api.get("/public/testimonials-page"),
      ]);

      setTestimonials(testRes.data || []);
      setPageContent(pageRes.data || {});
    } catch (err) {
      console.error("Error loading testimonials page:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ts-page">
        <div className="ts-loading">Loading...</div>
      </div>
    );
  }

  /* hero background style */
  const heroBgStyle = pageContent?.hero_image_url
    ? { backgroundImage: `url(${getImageUrl(pageContent.hero_image_url)})` }
    : {};

  return (
    <div className="ts-page">
      {/* ============= HERO ============= */}
      <section className="ts-hero" style={heroBgStyle}>
        <div className="ts-hero-lines" />

        <div className="ts-hero-content">
          <span className="ts-hero-eyebrow">Voices</span>

          <h1 className="ts-hero-title">
            {pageContent.hero_title || (
              <>
                Stories of <em>Success</em>
              </>
            )}
          </h1>

          {pageContent.hero_subtitle && (
            <p className="ts-hero-subtitle">{pageContent.hero_subtitle}</p>
          )}

          <div className="ts-hero-divider">
            <span />
            <em>Real Words · Real People</em>
            <span />
          </div>
        </div>
      </section>

      {/* ============= ABOUT ============= */}
      {(pageContent.about_title || pageContent.about_description) && (
        <section className="ts-section ts-section--light">
          <div className="ts-container">
            <div className="ts-about-grid">
              <div className="ts-about-content">
                <div className="ts-head ts-about-head-left">
                  <span className="ts-eyebrow">About</span>
                  {pageContent.about_title && (
                    <h2 className="ts-title">{pageContent.about_title}</h2>
                  )}
                </div>

                {pageContent.about_description && (
                  <p className="ts-about-desc">
                    {pageContent.about_description}
                  </p>
                )}
              </div>

              {pageContent.about_image_url && (
                <div className="ts-about-image">
                  <img
                    src={getImageUrl(pageContent.about_image_url)}
                    alt="About testimonials"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============= TESTIMONIALS ============= */}
      <section className="ts-section">
        <div className="ts-container">
          <div className="ts-head">
            <span className="ts-eyebrow">Testimonials</span>
            <h2 className="ts-title">
              What Our <em>Clients</em> Say
            </h2>
            <p className="ts-subtitle">
              We think our clients say it best — real stories from students,
              partners, and institutions we've worked with.
            </p>
          </div>

          {testimonials.length === 0 ? (
            <div className="ts-empty">No testimonials available yet.</div>
          ) : (
            <div className="ts-grid">
              {testimonials.map((t, i) => (
                <article
                  className="ts-card"
                  key={t.id}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {/* decorative quotes */}
                  <span className="ts-card-quote">“</span>
                  <span className="ts-card-quote-bottom">“</span>

                  {/* message */}
                  <p className="ts-card-message">{t.message}</p>

                  {/* divider */}
                  <div className="ts-card-divider" />

                  {/* author */}
                  <div className="ts-card-author">
                    <Avatar
                      src={getImageUrl(t.image_url)}
                      name={t.name}
                    />

                    <div className="ts-card-meta">
                      <h4 className="ts-name">{t.name}</h4>

                      {t.designation && (
                        <span className="ts-designation">
                          {t.designation}
                        </span>
                      )}

                      {t.organization && (
                        <span className="ts-organization">
                          {t.organization}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}