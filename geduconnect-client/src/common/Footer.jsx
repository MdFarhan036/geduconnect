import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "./Footer.css";

import logo from "../assets/Gedu_logo_2.png";
import whatsappimg from "../assets/whatsapp.png";
import facebookIcon from "../assets/facebook.png";
import twitterIcon from "../assets/twitter.png";
import instagramIcon from "../assets/instagram.png";
import linkedinIcon from "../assets/linkedin.png";
import Faqs from "../components/Faqs";

export const Footer = () => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/public/services");
        setServices(res.data.services || res.data || []);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const getServiceLink = (service) =>
    `/services/${service.slug || service.page_link || service.id}`;

  return (
    <>
      {/* FAQ Section */}
      <Faqs />

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="ft-root">

        {/* diagonal accent strip */}
        <div className="ft-accent-strip" />

        {/* grain overlay */}
        <div className="ft-grain" />

        <div className="ft-inner">

          {/* ── BRAND COL ── */}
          <div className="ft-brand">
            <Link to="/" className="ft-logo-link">
              <img src={logo} alt="G Educonnect" className="ft-logo" />
            </Link>

            <p className="ft-tagline">
              G Educonnect partners with <strong>750+ consultants</strong> and{" "}
              <strong>25+ universities</strong> across India, offering
              admission, publishing, and tech solutions.
            </p>

            {/* social row */}
            <div className="ft-social">
              {[
                { href: "https://www.facebook.com/geduconnectpvtltd/", src: facebookIcon, alt: "Facebook" },
                { href: "#", src: twitterIcon, alt: "Twitter" },
                { href: "https://www.instagram.com/geduconnect/", src: instagramIcon, alt: "Instagram" },
                { href: "https://www.linkedin.com/company/geduconnect/", src: linkedinIcon, alt: "LinkedIn" },
              ].map(({ href, src, alt }) => (
                <a key={alt} href={href} target="_blank" rel="noopener noreferrer"
                   className="ft-social-link">
                  <img src={src} alt={alt} />
                </a>
              ))}
            </div>

            {/* newsletter */}
            <div className="ft-newsletter">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>

          {/* ── SERVICES ── */}
          <div className="ft-col">
            <h4 className="ft-col-title">
              <span>Services</span>
              <div className="ft-col-rule" />
            </h4>
            <ul className="ft-list">
              {loadingServices && <li className="ft-list-loading">Loading…</li>}
              {!loadingServices && services.length === 0 && (
                <li>No services available</li>
              )}
              {services.map((service) => (
                <li key={service.id}>
                  <Link to={getServiceLink(service)}>{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── QUICK LINKS ── */}
          <div className="ft-col">
            <h4 className="ft-col-title">
              <span>Quick Links</span>
              <div className="ft-col-rule" />
            </h4>
            <ul className="ft-list">
              {[
                { to: "/about",       label: "About Us" },
                { to: "/clients",     label: "Clients & Partners" },
                { to: "/contact",     label: "Contact Us" },
                { to: "/testimonial", label: "Testimonials" },
                { to: "/gallery",     label: "Gallery" },
                { to: "/careerpage",  label: "Careers" },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* ── CONTACT ── */}
          <div className="ft-col">
            <h4 className="ft-col-title">
              <span>Get In Touch</span>
              <div className="ft-col-rule" />
            </h4>
            <ul className="ft-list ft-contact-list">
              <li>
                <a href="tel:+919251925827">
                  <span className="ft-contact-icon">📞</span>
                  +91 925-192-5827
                </a>
              </li>
              <li>
                <a href="mailto:admin@geduconnect.com">
                  <span className="ft-contact-icon">✉️</span>
                  admin@geduconnect.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps?q=B-3,+Shivam+Apartment,+Adarsh+Nagar,+Jaipur,+Rajasthan+302004"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ft-contact-icon">📍</span>
                  B-3, Shivam Apartment, Adarsh Nagar,<br />
                  Jaipur, Rajasthan 302004
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="ft-bottom">
          <div className="ft-bottom-inner">
            <span className="ft-copy">
              © {new Date().getFullYear()} G Educonnect Private Limited. All rights reserved.
            </span>
            <div className="ft-bottom-links">
              <Link to="/termsandconditions">Terms & Conditions</Link>
              <span className="ft-bottom-sep">·</span>
              <Link to="/privacypolicy">Privacy Policy</Link>
            </div>
          </div>
        </div>

      </footer>

      {/* ── WHATSAPP FLOAT ── */}
      <a
        href="https://wa.me/919251925827"
        className="ft-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <img src={whatsappimg} alt="WhatsApp" />
      </a>
    </>
  );
};