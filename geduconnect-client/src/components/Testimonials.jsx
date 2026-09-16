import { useEffect, useState } from "react";
import api from "../api/api";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/public/testimonials");
      setTestimonials(res.data || []);
    } catch (err) {
      console.error("Error loading testimonials:", err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="row-section bg-light">
      <div className="container">
        <div className="testimonial">
          <div className="test-head">
            <h2>Testimonial</h2>
            <span>We think our clients say it best.</span>
          </div>

          <div className="test-body">

            {testimonials.slice(0, 3).map((t, index) => (
              <div
                key={t.id}
                className={`test-card ${
                  index === 0
                    ? "mr-rt-bt"
                    : index === 1
                    ? "mb"
                    : ""
                }`}
              >
                <div className="tp-quote">“</div>

                <div className="test-mid">
                  <p>{t.message}</p>

                  <div className="alg-lt">
                    <h4>{t.name}</h4>
                    {t.designation && <span>{t.designation}</span>}
                    {t.organization && <span>{t.organization}</span>}
                  </div>
                </div>

                <div className="btm-quote">“</div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
