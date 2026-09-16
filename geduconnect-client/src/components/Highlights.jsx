import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import "./Highlights.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = API_BASE.replace("/api", "");

const resolveUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

/* ── Animated counter that eases out ── */
function Counter({ target, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTs = null;
          const duration = 1200;

          const tick = (ts) => {
            if (!startTs) startTs = ts;
            const progress = Math.min((ts - startTs) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };

          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="hl-number">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function Highlights() {
  const [highlights, setHighlights] = useState([]);
  const [meta, setMeta] = useState({
    title: "HIGHLIGHTS",
    subtitle: "Education Through People, Partnerships & Purpose",
    background_image_url: "",
    is_active: 1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      /* ── stat items ── */
      const res = await api.get("/public/highlights");
      setHighlights(res.data || []);

      /* ── section meta (title, subtitle, bg image) ──
         Adjust this endpoint to wherever your CMS stores section config.
         Falls back gracefully if endpoint doesn't exist yet. */
      try {
        const metaRes = await api.get("/public/highlights/meta");
        if (metaRes.data) setMeta((prev) => ({ ...prev, ...metaRes.data }));
      } catch {
        /* no meta endpoint yet — defaults stay */
      }
    } catch (err) {
      console.error("Error loading highlights:", err);
    }
  };

  if (!highlights.length) return null;
  if (Number(meta.is_active) === 0) return null;

  const bgStyle = meta.background_image_url
    ? { backgroundImage: `url(${resolveUrl(meta.background_image_url)})` }
    : {};

  return (
    <section className="hl-section" style={bgStyle}>
      {/* dark overlay so text is always legible */}
      <div className="hl-overlay" />

      {/* grain texture */}
      <div className="hl-grain" />

      <div className="hl-inner">

        {/* ── HEADING ── */}
        <div className="hl-head">
          <h2 className="hl-title">{meta.title || "HIGHLIGHTS"}</h2>
          {meta.subtitle && (
            <p className="hl-subtitle">{meta.subtitle}</p>
          )}
          <div className="hl-title-rule" />
        </div>

        {/* ── STATS ROW ── */}
        <div className="hl-stats">
          {highlights.map((item, i) => (
            <div
              key={item.id || i}
              className="hl-stat"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* vertical separator (hidden on first) */}
              {i !== 0 && <div className="hl-sep" />}

              <div className="hl-stat-inner">
                <div className="hl-num-wrap">
                  <Counter
                    target={Number(item.value)}
                    suffix={item.suffix || "+"}
                  />
                </div>
                <span className="hl-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}