import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./ClientsPage.css";

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
   LOGO with fallback (first letter on crimson→gold gradient)
========================================================= */
const ClientLogo = ({ src, name }) => {
  const [err, setErr] = useState(false);
  const firstChar = (name?.[0] || "•").toUpperCase();

  if (!src || err) {
    return <div className="cp-logo-fallback">{firstChar}</div>;
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setErr(true)}
    />
  );
};

/* =========================================================
   PARTNER with fallback
========================================================= */
const PartnerLogo = ({ src, name }) => {
  const [err, setErr] = useState(false);
  const firstChar = (name?.[0] || "•").toUpperCase();

  if (!src || err) {
    return <div className="cp-logo-fallback">{firstChar}</div>;
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setErr(true)}
    />
  );
};

/* =========================================================
   CLIENTS PAGE
========================================================= */
export const ClientsPage = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState("online");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [clientsRes, pageRes] = await Promise.all([
        api.get("/public/clients"),
        api.get("/public/clients-page"),
      ]);

      setClients(clientsRes.data || []);
      setPageContent(pageRes.data || null);
    } catch (err) {
      console.error("Failed to load clients page:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const modeClients = clients.filter(
    (c) =>
      (c.type === "client" || c.type === "university") &&
      c.mode === activeMode
  );

  const partners = clients.filter((c) => c.type === "partner");

  /* ================= RENDER ================= */
  if (loading) {
    return (
      <div className="cp-page">
        <div className="cp-loading">Loading...</div>
      </div>
    );
  }

  /* hero background style (only when hero_image_url provided) */
  const heroBgStyle = pageContent?.hero_image_url
    ? { backgroundImage: `url(${getImageUrl(pageContent.hero_image_url)})` }
    : {};

  return (
    <div className="cp-page">
      {/* ================= HERO ================= */}
      <section className="cp-hero" style={heroBgStyle}>
        <div className="cp-hero-lines" />

        <div className="cp-hero-content">
          <span className="cp-hero-eyebrow">G Educonnect</span>

          <h1 className="cp-hero-title">
            {pageContent?.hero_title || (
              <>
                Clients &amp; <em>Partners</em>
              </>
            )}
          </h1>

          {pageContent?.hero_subtitle && (
            <p className="cp-hero-subtitle">{pageContent.hero_subtitle}</p>
          )}

          <div className="cp-hero-divider">
            <span />
            <em>Trusted Network · Pan-India</em>
            <span />
          </div>
        </div>
      </section>

      {/* ================= ABOUT / DESCRIPTION ================= */}
      {pageContent?.section_title && (
        <section className="cp-section cp-section--light">
          <div className="cp-container">
            <div className="cp-about-grid">
              <div className="cp-about-content">
                <div className="cp-head cp-about-head-left">
                  <span className="cp-eyebrow">About</span>
                  <h2 className="cp-title">{pageContent.section_title}</h2>
                </div>

                {pageContent.section_description && (
                  <p className="cp-about-desc">
                    {pageContent.section_description}
                  </p>
                )}
              </div>

              {pageContent.section_image_url && (
                <div className="cp-about-image">
                  <img
                    src={getImageUrl(pageContent.section_image_url)}
                    alt="About clients"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================= UNIVERSITIES (MODE TABS) ================= */}
      <section className="cp-section">
        <div className="cp-container">
          <div className="cp-head">
            <span className="cp-eyebrow">Universities</span>
            <h2 className="cp-title">
              Our <em>University</em> Network
            </h2>
            <p className="cp-subtitle">
              Explore our partner universities by mode of study.
            </p>
          </div>

          {/* MODE TABS */}
          <div className="cp-tabs-row">
            <div className="cp-tabs" role="tablist">
              {["online", "regular", "distance"].map((mode) => (
                <button
                  key={mode}
                  role="tab"
                  aria-selected={activeMode === mode}
                  className={`cp-tab ${
                    activeMode === mode ? "cp-tab--active" : ""
                  }`}
                  onClick={() => setActiveMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {modeClients.length === 0 ? (
            <div className="cp-empty">
              No universities available in this mode.
            </div>
          ) : (
            <div className="cp-clients-grid">
              {modeClients.map((client, i) => (
                <div
                  key={client.id}
                  className="cp-client"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() =>
                    client.slug && navigate(`/university/${client.slug}`)
                  }
                >
                  <div className="cp-client-logo">
                    <ClientLogo
                      src={getImageUrl(client.logo_url)}
                      name={client.name}
                    />
                  </div>

                  <div className="cp-client-content">
                    <h3 className="cp-client-name">{client.name}</h3>

                    {client.description && (
                      <p className="cp-client-desc">{client.description}</p>
                    )}

                    {client.apply_link && (
                      <a
                        href={client.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cp-apply-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Apply Now
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= PARTNERS ================= */}
      <section className="cp-section cp-section--light">
        <div className="cp-container">
          <div className="cp-head">
            <span className="cp-eyebrow">Global Partners</span>
            <h2 className="cp-title">
              Our <em>Global</em> Partners
            </h2>
            <p className="cp-subtitle">
              Trusted institutions and organisations we work with worldwide.
            </p>
          </div>

          {partners.length === 0 ? (
            <div className="cp-empty">No partners available.</div>
          ) : (
            <div className="cp-partners-grid">
              {partners.map((partner, i) => (
                <div
                  key={partner.id}
                  className="cp-partner"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <PartnerLogo
                    src={getImageUrl(partner.logo_url)}
                    name={partner.name}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClientsPage;