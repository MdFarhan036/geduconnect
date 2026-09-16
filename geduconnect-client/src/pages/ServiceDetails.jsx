import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import "./ServiceDetails.css";

/* ================= BASE URL ================= */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const BASE_URL = API_BASE.replace(
  "/api",
  ""
);

export default function ServiceDetails() {
  const { slug } = useParams();

  const [service, setService] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (slug) {
      fetchService();
    }
  }, [slug]);

  const fetchService = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/public/services/${slug}`
      );

      const data =
        res.data.data ||
        res.data;

      setService({
        ...data,
        features:
          data.features || [],
        faqs:
          data.faqs || [],
        banners:
          data.banners || [],
      });

      setError(null);
    } catch (err) {
      console.error(
        "Error loading service:",
        err
      );

      setError(
        "Failed to load service."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEO ================= */

  useEffect(() => {
    if (!service) return;

    document.title =
      service.meta_title ||
      service.title;

    const metaDescription =
      document.querySelector(
        'meta[name="description"]'
      );

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        service.meta_description ||
        service.description ||
        ""
      );
    }
  }, [service]);

  /* ================= IMAGE URL ================= */

  const getImageUrl = (path) => {
    if (!path) return null;

    if (
      path.startsWith("http")
    ) {
      return path;
    }

    return `${BASE_URL}${path.startsWith("/")
        ? ""
        : "/"
      }${path}`;
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="servicedetails__page">
        <div className="servicedetails__skeleton-hero" />

        <div className="servicedetails__container">
          <div className="servicedetails__skeleton-row" />
          <div className="servicedetails__skeleton-row" />
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error || !service) {
    return (
      <div className="servicedetails__page">
        <div className="servicedetails__container">
          <div className="servicedetails__empty">
            {error ||
              "Service not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="servicedetails__page">

      {/* ================= HERO ================= */}

      <section
        className="servicedetails__hero"
        style={{
          backgroundImage:
            service.image_url
              ? `url(${getImageUrl(
                service.image_url
              )})`
              : service.banners
                ?.length > 0
                ? `url(${getImageUrl(
                  service.banners[0]
                    .image_url
                )})`
                : `linear-gradient(
                  135deg,
                  #0f172a,
                  #1e293b
                )`,
        }}
      >
        <div className="servicedetails__hero-overlay" />

        <div className="servicedetails__hero-texture" />

        <div className="servicedetails__hero-content">

          <span className="servicedetails__hero-eyebrow">
            Our Services
          </span>

          <h1 className="servicedetails__hero-title">
            {service.title}
          </h1>

          {service.subtitle && (
            <p className="servicedetails__hero-subtitle">
              {service.subtitle}
            </p>
          )}

          <div className="servicedetails__hero-accent" />

        </div>
      </section>

      {/* ================= INTRO ================= */}

      {/* ================= ABOUT SECTION ================= */}

      {service.description && (
        <section className="servicedetails__about">
          <div className="servicedetails__container">

            <div className="servicedetails__about-grid">

              {/* CONTENT */}

              <div className="servicedetails__about-content">



                <h2 className="servicedetails__about-title">
                  About Our{" "}
                  {service.title}
                </h2>

                <div className="servicedetails__about-accent" />

                <p className="servicedetails__about-text">
                  {service.description}
                </p>

              </div>

              {/* IMAGE */}

              {service.image_url && (
                <div className="servicedetails__about-image-wrap">

                  <img
                    src={getImageUrl(
                      service.image_url
                    )}
                    alt={service.title}
                    className="servicedetails__about-image"
                  />

                  <div className="servicedetails__about-frame" />

                </div>
              )}

            </div>

          </div>
        </section>
      )}
      {/* ================= FEATURES ================= */}

      {service.features
        ?.length > 0 && (
          <section className="servicedetails__features">
            <div className="servicedetails__container">

              <div className="servicedetails__features-head">

                <span className="servicedetails__features-eyebrow">
                  What We Offer
                </span>

                <h2 className="servicedetails__features-title">
                  Why Choose Our
                  Services
                </h2>

                <div className="servicedetails__features-accent" />

              </div>

              <div className="servicedetails__features-grid">

                {service.features.map(
                  (
                    feature,
                    idx
                  ) => (
                    <article
                      key={
                        feature.id
                      }
                      className="servicedetails__feature-card"
                      style={{
                        animationDelay: `${idx * 0.08}s`,
                      }}
                    >
                      <div className="servicedetails__feature-corner" />

                      <div className="servicedetails__feature-icon-wrap">

                        {feature.icon_url ? (
                          <img
                            src={getImageUrl(
                              feature.icon_url
                            )}
                            alt={
                              feature.title
                            }
                            className="servicedetails__feature-icon"
                          />
                        ) : (
                          <div className="servicedetails__feature-icon-fallback" />
                        )}

                      </div>

                      <h4 className="servicedetails__feature-title">
                        {
                          feature.title
                        }
                      </h4>

                      <p className="servicedetails__feature-desc">
                        {
                          feature.description
                        }
                      </p>

                    </article>
                  )
                )}

              </div>

            </div>
          </section>
        )}

      {/* ================= HTML CONTENT ================= */}

      {service.html_content?.trim() && (
        <>
          {/* <div className="servicedetails__container"> */}

            <div
              className="servicedetails__html-content"
              dangerouslySetInnerHTML={{
                __html:
                  service.html_content ||
                  "",
              }}
            />

          {/* </div> */}
        </>
      )}

    </div>
  );
}