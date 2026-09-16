import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "./Navbar.css";
import logo from "../assets/Gedu_logo_2.png";

export const Navbar = () => {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [serviceOpen, setServiceOpen]   = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [sticky, setSticky]             = useState(false);
  const [services, setServices]         = useState([]);
  const [isMobile, setIsMobile]         = useState(window.innerWidth <= 768);

  const serviceTimer  = useRef(null);
  const resourceTimer = useRef(null);
  const navRef        = useRef(null);

  /* ── Sticky scroll ── */
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Track viewport width ── */
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Lock body scroll when mobile menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* ── Click outside closes dropdowns ── */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setServiceOpen(false);
        setResourceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Fetch services ── */
  useEffect(() => {
    api
      .get("/public/services")
      .then((res) => setServices(res.data || []))
      .catch((err) => console.error("Failed to load services:", err));
  }, []);

  const closeAll = () => {
    setMenuOpen(false);
    setServiceOpen(false);
    setResourceOpen(false);
  };

  /* ── Hover helpers with delay so cursor can reach submenu ── */
  const handleServiceEnter = () => {
    if (isMobile) return;
    clearTimeout(serviceTimer.current);
    setServiceOpen(true);
  };
  const handleServiceLeave = () => {
    if (isMobile) return;
    serviceTimer.current = setTimeout(() => setServiceOpen(false), 140);
  };

  const handleResourceEnter = () => {
    if (isMobile) return;
    clearTimeout(resourceTimer.current);
    setResourceOpen(true);
  };
  const handleResourceLeave = () => {
    if (isMobile) return;
    resourceTimer.current = setTimeout(() => setResourceOpen(false), 140);
  };

  /* ── Toggle service on desktop click (open/close) ── */
  const handleServiceClick = () => {
    if (isMobile) {
      setServiceOpen(!serviceOpen);
    } else {
      setServiceOpen((prev) => !prev);
      setResourceOpen(false);
    }
  };

  /* ── Toggle resource on desktop click (open/close) ── */
  const handleResourceClick = () => {
    if (isMobile) {
      setResourceOpen(!resourceOpen);
    } else {
      setResourceOpen((prev) => !prev);
      setServiceOpen(false);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`nav-bottom${sticky ? " sticky" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >

        {/* ── LOGO ── */}
        <div className="logo-wrap">
          <Link to="/" onClick={closeAll} aria-label="Go to homepage">
            <img src={logo} alt="G Educonnect" />
          </Link>
        </div>

        {/* ── MOBILE HAMBURGER ── */}
        <div
          id="menuToggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </div>

        {/* ── MENU ── */}
        <div className={`menu${menuOpen ? " open" : ""}`}>

          {/* Mobile logo inside drawer */}
          {isMobile && (
            <div className="mobile-menu-header">
              <Link to="/" onClick={closeAll}>
                <img src={logo} alt="G Educonnect" />
              </Link>
            </div>
          )}

          <ul role="menubar">

  {/* ABOUT */}
  <li role="none">
    <Link
      to="/about"
      onClick={closeAll}
      role="menuitem"
      className="nav-roll"
    >
      <div className="nav-roll-inner">
        <span className="nav-text">About Us</span>
        <span className="nav-text-hover">About Us</span>
      </div>
    </Link>
  </li>

  {/* ── SERVICES DROPDOWN ── */}
  <li
    className="has-submenu"
    role="none"
    onMouseEnter={handleServiceEnter}
    onMouseLeave={handleServiceLeave}
  >
    <div
      className="submenu-title"
      role="menuitem"
      aria-haspopup="true"
      aria-expanded={serviceOpen}
      onClick={handleServiceClick}
    >

      <div className="nav-roll services-roll">
        <div className="nav-roll-inner">
          <span className="nav-text">Our Services</span>
          <span className="nav-text-hover">Our Services</span>
        </div>
      </div>

      <span className={`toggle-icon${serviceOpen ? " open" : ""}`}>
        +
      </span>
    </div>

    {/* Always in DOM — visibility toggled via class */}
    <ul
      className={`submenu${serviceOpen ? " visible" : ""}`}
      role="menu"
      onMouseEnter={handleServiceEnter}
      onMouseLeave={handleServiceLeave}
    >
      {services.length === 0 && (
        <li
          style={{
            padding: "14px 16px",
            color: "#999",
            fontSize: 13,
          }}
        >
          Loading…
        </li>
      )}

      {services.map((service) => (
        <li key={service.id} role="none">
          <Link
            to={`/services/${
              service.page_link || service.slug || service.id
            }`}
            onClick={closeAll}
            role="menuitem"
          >
            {service.title}
          </Link>
        </li>
      ))}
    </ul>
  </li>

  {/* CONSULTANT NETWORK */}
  <li role="none">
    <Link
      to="/consultantNetwork"
      onClick={closeAll}
      role="menuitem"
      className="nav-roll"
    >
      <div className="nav-roll-inner">
        <span className="nav-text">Consultant Network</span>
        <span className="nav-text-hover">Consultant Network</span>
      </div>
    </Link>
  </li>

  {/* ── RESOURCES DROPDOWN ── */}
  <li
    className="has-submenu"
    role="none"
    onMouseEnter={handleResourceEnter}
    onMouseLeave={handleResourceLeave}
  >
    <div
      className="submenu-title"
      role="menuitem"
      aria-haspopup="true"
      aria-expanded={resourceOpen}
      onClick={handleResourceClick}
    >

      <div className="nav-roll resources-roll">
        <div className="nav-roll-inner">
          <span className="nav-text">Resources</span>
          <span className="nav-text-hover">Resources</span>
        </div>
      </div>

      <span className={`toggle-icon${resourceOpen ? " open" : ""}`}>
        +
      </span>
    </div>

    {/* Always in DOM — visibility toggled via class */}
    <ul
      className={`submenu${resourceOpen ? " visible" : ""}`}
      role="menu"
      onMouseEnter={handleResourceEnter}
      onMouseLeave={handleResourceLeave}
    >
      <li role="none">
        <Link to="/blog" onClick={closeAll} role="menuitem">
          Blog
        </Link>
      </li>

      <li role="none">
        <Link to="/gallery" onClick={closeAll} role="menuitem">
          Gallery
        </Link>
      </li>

      <li role="none">
        <Link to="/clients" onClick={closeAll} role="menuitem">
          Clients &amp; Partners
        </Link>
      </li>

      <li role="none">
        <Link to="/compare" onClick={closeAll} role="menuitem">
          Compare Universities
        </Link>
      </li>

      <li role="none">
        <Link to="/testimonial" onClick={closeAll} role="menuitem">
          Testimonials
        </Link>
      </li>

      <li role="none">
        <Link to="/careerpage" onClick={closeAll} role="menuitem">
          Careers
        </Link>
      </li>
    </ul>
  </li>

  {/* CONTACT */}
  <li role="none">
    <Link
      to="/contact"
      onClick={closeAll}
      role="menuitem"
      className="nav-roll"
    >
      <div className="nav-roll-inner">
        <span className="nav-text">Contact Us</span>
        <span className="nav-text-hover">Contact Us</span>
      </div>
    </Link>
  </li>

</ul>

          {/* ── CTA BUTTON ── */}
          <div className="cta">
            <a
              href="https://admissions.geduconnect.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire Now
            </a>
          </div>

        </div>
      </nav>

      {/* Mobile backdrop overlay */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={closeAll}
          role="presentation"
          aria-hidden="true"
        />
      )}
    </>
  );
};