import { useEffect, useState } from "react";
import api from "../api/api";
import "./WhyChooseUs.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const BASE_URL =
  API_BASE.replace("/api", "");

export default function WhyChooseUs() {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {

    try {

      const res = await api.get(
        "/public/why-choose-us"
      );

      setData(res.data);

    } catch (err) {

      console.error(
        "Error loading Why Choose Us:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  /* =========================================================
     STATES
  ========================================================= */

  if (loading) return null;

  if (
    !data ||
    Number(data.is_active) !== 1
  ) {
    return null;
  }

  /* =========================================================
     IMAGE
  ========================================================= */

  const getImageUrl = (path) =>
    `${BASE_URL}${
      path?.startsWith("/")
        ? ""
        : "/"
    }${path}`;

  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <section className="why-section">

      {/* background glows */}

      <div className="why-bg why-bg-one" />
      <div className="why-bg why-bg-two" />

      <div className="why-container">

        <div className="why-grid">

          {/* =========================================================
              LEFT CONTENT
          ========================================================= */}

          <div className="why-left">

            <span className="why-tag">
              Why Choose Us
            </span>

            <h2 className="why-title">
              {data.heading}
            </h2>

            <p className="why-desc">
              {data.description}
            </p>

            {/* OFFERINGS */}

            {data.offerings_title && (

              <div className="why-offerings">

                <div className="why-offerings-head">

                  <div className="why-line" />

                  <h4>
                    {data.offerings_title}
                  </h4>

                </div>

                {data.points?.length >
                  0 && (

                  <div className="why-points">

                    {data.points
                      .sort(
                        (a, b) =>
                          a.sort_order -
                          b.sort_order
                      )
                      .map(
                        (point, index) => (

                          <div
                            className="why-point"
                            key={point.id}
                          >

                            <div className="why-point-icon">
                              0
                              {index + 1}
                            </div>

                            <p>
                              {point.point}
                            </p>

                          </div>
                        )
                      )}

                  </div>
                )}

              </div>
            )}

            {/* CTA */}

            {data.cta_text &&
              data.cta_link && (

                <div className="why-cta">

                  <a
                    href={data.cta_link}
                  >
                    {data.cta_text}

                    <span>
                      →
                    </span>

                  </a>

                </div>
              )}

          </div>

          {/* =========================================================
              RIGHT IMAGE
          ========================================================= */}

          <div className="why-right">

            <div className="why-image-wrap">

              {/* glow */}

              <div className="why-image-glow" />

              {data.image_url ? (

                <img
                  src={getImageUrl(
                    data.image_url
                  )}
                  alt={data.heading}
                  className="why-image"
                />

              ) : (

                <div className="why-no-image">
                  No Image
                </div>
              )}

              {/* floating card */}

              <div className="why-floating-card">

                <h5>
                  Trusted By
                </h5>

                <span>
                  5000+ Students &
                  Institutions
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}