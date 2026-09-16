import { useEffect, useState } from "react";
import api from "../api/api";

export default function HomeHero() {
  const [hero, setHero] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    api.get("/public/home").then(res => {
      setHero(res.data.hero || {});
    });
  }, []);

  /* ================= AUTO SLIDER ================= */
  useEffect(() => {
    if (!hero?.images || hero.images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImage(prev =>
        prev === hero.images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [hero]);

  if (!hero) return null;

  const bgImage =
    hero.images && hero.images.length > 0
      ? `${api.defaults.baseURL}${hero.images[currentImage].image_url}`
      : "";

  return (
    <section
      className="bg-light row-section hero-section"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container">
        <div className="banner-wrap">
          <div className="banner-left">
            <div className="banner-content">
              <h1>{hero.title}</h1>
              <h3>{hero.subtitle}</h3>
            </div>

            <div className="cta">
              {hero.primary_cta_text && (
                <a
                  href={hero.primary_cta_link}
                  className="first"
                >
                  {hero.primary_cta_text}
                </a>
              )}

              {hero.secondary_cta_text && (
                <a href={hero.secondary_cta_link}>
                  {hero.secondary_cta_text}
                </a>
              )}
            </div>
          </div>

          <div className="banner-right">
            {hero.side_image && (
              <img
                src={`${api.defaults.baseURL}${hero.side_image}`}
                alt="hero"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
