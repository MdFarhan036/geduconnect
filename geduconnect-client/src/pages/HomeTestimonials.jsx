import { useEffect, useState } from "react";
import api from "../api/api";
import "./HomeTestimonials.css";

// Card width + gap must match CSS exactly:
// .ht-card flex: 0 0 300px  +  gap: 20px  = 320px per slot
const CARD_SLOT = 320; // px — keep in sync with CSS

export default function HomeTestimonials() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/public/testimonials").then((res) => {
      setData(res.data.slice(0, 4));
    });
  }, []);

  // Triple-duplicate so there's always a full set visible
  // while the first set scrolls out — prevents any gap/jump
  const loopData = [...data, ...data, ...data];

  return (
    <section className="home-testimonials">
      <div className="ht-bg ht-bg-one" />
      <div className="ht-bg ht-bg-two" />

      <div className="ht-container">

        {/* HEADER */}
        <div className="ht-header">
          <span className="ht-tag">Testimonials</span>
          <h2>
            Trusted By Students,<br />
            Institutions &amp; Professionals
          </h2>
          <p>
            Real experiences from learners, university partners and working
            professionals who transformed their educational journey with us.
          </p>
        </div>

        {/* MARQUEE TRACK
            --card-count  = original card count (1 set)
            --card-slot   = card width + gap in px
            CSS animates translateX by exactly (--card-count × --card-slot)
            which is the width of ONE set, so the loop is perfectly seamless */}
        <div className="ht-marquee-wrapper">
          <div
            className="ht-marquee-track"
            style={{
              "--card-count": data.length,
              "--card-slot": `${CARD_SLOT}px`,
            }}
          >
            {loopData.map((t, index) => (
              <div className="ht-card" key={`${t.id}-${index}`}>
                <div className="ht-card-glow" />
                <div className="ht-quote">"</div>

                <div className="ht-content">
                  <p>{t.message}</p>
                </div>

                <div className="ht-footer">
                  <div className="ht-avatar">
                    {t.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="ht-user">
                    <h4>{t.name}</h4>
                    <span>{t.designation}</span>
                    <small>{t.organization}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}