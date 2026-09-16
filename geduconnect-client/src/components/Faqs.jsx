import { useEffect, useState } from "react";
import api from "../api/api";

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const fetchFaqs = async () => {
    try {
      const res = await api.get("/public/faqs");
      setFaqs(res.data.faqs || []);
    } catch (err) {
      console.error("Error loading FAQs:", err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!faqs.length) return null;

  return (
    <section className="row-section">
      <div className="container">
        <div className="info-wrap">
          
          {/* FAQ SECTION */}
          <div className="faq">
            <div className="accordion">
              <h2 className="faq-title">
                Frequently Asked Questions
              </h2>

              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className={`accordion-item ${
                    activeIndex === index ? "active" : ""
                  }`}
                >
                  <div
                    className="accordion-header"
                    onClick={() => toggle(index)}
                  >
                    {faq.question}
                    <span className="icon">+</span>
                  </div>

                  <div className="accordion-body">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="form-wrap">
            <form className="contact-form">
              <h3>GET IN TOUCH!</h3>

              <input
                className="input-text"
                type="text"
                placeholder="Full Name"
                required
              />

              <input
                className="input-text"
                type="email"
                placeholder="Email Address"
                required
              />

              <div className="phone-wrap">
                <span className="flag">🇮🇳 +91</span>
                <input
                  className="input-text"
                  type="tel"
                  placeholder="Mobile Number"
                  required
                />
              </div>

              <label htmlFor="services" className="mb-10">
                What services are you interested in?*
              </label>

              <select id="services" required>
                <option value="">Select Services</option>
                <option>Consultant Network</option>
                <option>ERP/CRM</option>
                <option>Publishing</option>
                <option>Admission Support</option>
              </select>

              <div className="term-condition">
                <input type="radio" required />
                <p>
                  I agree to Terms & Conditions and Privacy Policy*
                </p>
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}