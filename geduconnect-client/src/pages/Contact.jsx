import React, { useState, useRef, useEffect } from "react";
import api from "../api/api";
import contactBg from "../assets/contact.jpg";
import "./Contact.css";

export const Contact = () => {

  const contactForm = useRef();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const maxMessageLength = 500;

  /* =========================================================
      FETCH SERVICES
  ========================================================= */

  useEffect(() => {

    const fetchServices = async () => {

      try {

        const res = await api.get("/public/services");

        setServices(res.data || []);

      } catch (err) {

        console.error(
          "Failed to load services",
          err
        );
      }
    };

    fetchServices();

  }, []);

  /* =========================================================
      SUBMIT
  ========================================================= */

  const formSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    setStatus("Submitting...");

    const formData =
      new FormData(contactForm.current);

    const payload = {
      name:
        formData.get("from_name")?.trim(),

      email:
        formData.get("email")?.trim(),

      phone:
        formData.get("mobile")?.trim(),

      service_id:
        selectedService || null,

      message:
        formData.get("message")?.trim(),
    };

    try {

      await api.post(
        "/enquiries",
        payload
      );

      setStatus(
        "Enquiry submitted successfully!"
      );

      contactForm.current.reset();

      setSelectedService("");

      setCharCount(0);

    } catch (err) {

      console.error(
        "Enquiry Error:",
        err
      );

      setStatus(
        "Something went wrong. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        className="contact-hero"
        style={{
          backgroundImage:
            `url(${contactBg})`,
        }}
      >

        <div className="contact-overlay" />

        <div className="contact-hero-content">

          <span className="contact-tag">
            Get In Touch
          </span>

          <h1>
            Let’s Build
            <br />
            Something Great
          </h1>

          <p>
            Connect with G Educonnect for
            admissions, partnerships,
            counselling, and educational
            growth opportunities.
          </p>

        </div>

      </section>

      {/* =========================================================
          MAIN SECTION
      ========================================================= */}

      <section className="contact-main-section">

        <div className="contact-container">

          <div className="contact-grid">

            {/* =========================================================
                LEFT SIDE
            ========================================================= */}

            <div className="contact-info-card">

              <span className="contact-section-tag">
                Contact Details
              </span>

              <h2>
                We’d Love To Hear
                From You
              </h2>

              <p className="contact-description">
                Whether you're a student,
                university partner, or
                educational consultant —
                our team is here to help.
              </p>

              <div className="contact-detail-box">

                <div className="contact-detail-item">

                  <div className="contact-icon">
                    📞
                  </div>

                  <div>

                    <span>
                      Phone Number
                    </span>

                    <a href="tel:+919251925827">
                      +91 925-192-5827
                    </a>

                  </div>

                </div>

                <div className="contact-detail-item">

                  <div className="contact-icon">
                    ✉️
                  </div>

                  <div>

                    <span>
                      Email Address
                    </span>

                    <a href="mailto:admin@geduconnect.com">
                      admin@geduconnect.com
                    </a>

                  </div>

                </div>

                <div className="contact-detail-item">

                  <div className="contact-icon">
                    📍
                  </div>

                  <div>

                    <span>
                      Office Address
                    </span>

                    <p>
                      B-3, Shivam Apartment,
                      Anand Puri,
                      Adarsh Nagar,
                      Jaipur, Rajasthan
                      302004
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =========================================================
                RIGHT SIDE
            ========================================================= */}

            <div className="contact-map-card">

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.1427576235515!2d75.8232835!3d26.8989641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6beffedf2ef%3A0x108fbcacbf1a545!2sG%20Educonnect%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1749793539524!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};