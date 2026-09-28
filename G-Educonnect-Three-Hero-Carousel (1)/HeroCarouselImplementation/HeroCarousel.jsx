import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Network,
  Play,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";
import api from "../api/api";
import networkArtwork from "../assets/hero-network-campus.png";
import journeyArtwork from "../assets/hero-education-journey.png";
import togetherArtwork from "../assets/hero-education-together.png";
import "./HeroCarousel.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = API_BASE.replace(/\/api\/?$/, "");

const resolveUrl = (url) =>
  !url ? "" : /^(https?:|data:|blob:)/.test(url) ? url : `${BASE_URL}/${url.replace(/^\//, "")}`;

const audiences = {
  student: { text: "Get Guidance", href: "/contact?audience=student" },
  university: { text: "Partner With Us", href: "/contact?audience=university" },
  consultant: { text: "Join Our Network", href: "/consultantNetwork" },
};

const slides = [
  {
    id: "network",
    theme: "dark",
    image: networkArtwork,
    eyebrow: "India’s fastest growing",
    title: <>Educational<br />Institutions<br />Network<span>.</span></>,
    subtitle: <>Admissions <i>|</i> Partnerships <i>|</i> Technology <i>|</i> Growth</>,
    note: <>Same goal.<br />Brighter<br />futures.</>,
  },
  {
    id: "journey",
    theme: "light",
    image: journeyArtwork,
    eyebrow: "From aspiration to achievement",
    title: <>We Simplify<br />the <span>Education</span><br /><span>Journey</span></>,
    subtitle: <>Trusted guidance. Real opportunities.<br />A connected ecosystem.</>,
  },
  {
    id: "together",
    theme: "light",
    image: togetherArtwork,
    eyebrow: "Your partner in education growth",
    title: <>Empowering<br />Education<br /><span>Together</span></>,
    subtitle: <>Connecting Students, Universities and Consultants<br />for a Brighter Future.</>,
    note: <>Better<br />Education.<br />Brighter<br />Tomorrows</>,
  },
];

const stats = [
  { value: "500+", label: "University Partners", Icon: School },
  { value: "10,000+", label: "Students Guided", Icon: GraduationCap },
  { value: "200+", label: "Consultants", Icon: Users },
  { value: "95%", label: "Satisfaction Rate", Icon: ShieldCheck },
];

const roleCards = [
  { title: "Students", text: "Get personalised guidance", Icon: GraduationCap },
  { title: "Universities", text: "Reach the right students", Icon: School },
  { title: "Consultants", text: "Tools to grow faster", Icon: Users },
  { title: "Our Platform", text: "Technology that connects", Icon: Network },
];

export default function HeroCarousel() {
  const [universities, setUniversities] = useState([]);
  const [audience, setAudience] = useState("student");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);
  const cta = audiences[audience];
  const slide = slides[active];

  useEffect(() => {
    const controller = new AbortController();
    api.get("/public/clients", { signal: controller.signal })
      .then(({ data }) => setUniversities(Array.isArray(data) ? data.filter((c) => c.type === "university") : []))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const moveSlide = (direction) =>
    setActive((current) => (current + direction + slides.length) % slides.length);

  const scrollPartners = (direction) =>
    trackRef.current?.scrollBy({
      left: direction * Math.max(180, trackRef.current.clientWidth * 0.65),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });

  return (
    <section
      className={`ge-home-hero ge-home-hero--${slide.theme} ge-home-hero--${slide.id}`}
      aria-roledescription="carousel"
      aria-label="G Educonnect highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") moveSlide(-1);
        if (event.key === "ArrowRight") moveSlide(1);
      }}
    >
      <div className="ge-home-hero__slides">
        {slides.map((item, index) => (
          <img
            key={item.id}
            className={`ge-home-hero__art ${index === active ? "is-active" : ""}`}
            src={item.image}
            alt=""
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}
      </div>
      <div className="ge-home-hero__shade" />

      <div className="ge-home-hero__body" key={slide.id}>
        <div className="ge-home-hero__copy">
          <p className="ge-home-hero__eyebrow">{slide.eyebrow}</p>
          <h1 id="ge-home-title">{slide.title}</h1>
          <p className="ge-home-hero__subtitle">{slide.subtitle}</p>

          {slide.id === "network" ? (
            <div className="ge-home-hero__guidance">
              <label className="ge-home-hero__select">
                <span>I am a</span>
                <select value={audience} onChange={(event) => setAudience(event.target.value)} aria-label="Choose your role">
                  <option value="student">Student</option>
                  <option value="university">University</option>
                  <option value="consultant">Consultant</option>
                </select>
              </label>
              <Link to={cta.href} className="ge-home-hero__cta">{cta.text}<ArrowRight size={20} /></Link>
            </div>
          ) : (
            <div className="ge-home-hero__actions">
              <Link to="/contact" className="ge-home-hero__primary">Enquire Now</Link>
              <Link to={slide.id === "journey" ? "/services" : "/about"} className="ge-home-hero__secondary">
                <span><Play size={14} fill="currentColor" /></span>
                {slide.id === "journey" ? "Explore How It Works" : "Learn More"}
              </Link>
            </div>
          )}
        </div>

        {slide.note && <div className="ge-home-hero__note" aria-hidden="true">{slide.note}</div>}

        {slide.id === "journey" && (
          <div className="ge-home-hero__signs" aria-hidden="true">
            <span>Explore New Opportunities</span><span>Get Expert Guidance</span>
            <span>Secure Admissions</span><span>Build a Better Future</span>
          </div>
        )}
      </div>

      <button className="ge-home-hero__arrow ge-home-hero__arrow--left" type="button" onClick={() => moveSlide(-1)} aria-label="Previous slide"><ChevronLeft /></button>
      <button className="ge-home-hero__arrow ge-home-hero__arrow--right" type="button" onClick={() => moveSlide(1)} aria-label="Next slide"><ChevronRight /></button>

      <div className="ge-home-hero__dots" role="tablist" aria-label="Choose hero slide">
        {slides.map((item, index) => (
          <button key={item.id} type="button" className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`Show slide ${index + 1}`} aria-selected={index === active} role="tab" />
        ))}
      </div>

      {slide.id === "journey" ? (
        <div className="ge-home-hero__role-grid">
          {roleCards.map(({ title, text, Icon }) => <div key={title}><Icon /><strong>{title}</strong><small>{text}</small></div>)}
        </div>
      ) : (
        <div className="ge-home-hero__lower-card">
          <div className="ge-home-hero__stats">
            {stats.map(({ value, label, Icon }) => <div key={label}><Icon /><strong>{value}</strong><small>{label}</small></div>)}
          </div>

          {universities.length > 0 && (
            <div className="ge-home-hero__partners" aria-label="Our partner universities">
              <p>Our Partner Universities</p>
              <div className="ge-home-hero__partner-row">
                <button type="button" aria-label="Previous universities" onClick={() => scrollPartners(-1)}><ChevronLeft size={18} /></button>
                <div className="ge-home-hero__track" ref={trackRef}>
                  {universities.map((uni, index) => (
                    <Link key={uni.id || `${uni.slug}-${index}`} to={uni.slug ? `/university/${uni.slug}` : "/clients"} className="ge-home-hero__partner" title={uni.name || undefined}>
                      {uni.logo_url && <img src={resolveUrl(uni.logo_url)} alt={uni.name || "Partner university"} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false; }} />}
                      <span hidden={Boolean(uni.logo_url)}>{uni.name || "University"}</span>
                    </Link>
                  ))}
                </div>
                <button type="button" aria-label="Next universities" onClick={() => scrollPartners(1)}><ChevronRight size={18} /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
