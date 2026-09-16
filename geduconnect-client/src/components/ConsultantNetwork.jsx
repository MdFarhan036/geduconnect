import {
  MapContainer,
  GeoJSON,
  Marker,
  useMap,
  ZoomControl,
} from "react-leaflet";
import consultantAbout from "../assets/consultant-about.jpg";
import "leaflet/dist/leaflet.css";
import "./ConsultantNetwork.css";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import L from "leaflet";

import api from "../api/api.js";
import * as Icons from "lucide-react";

/* ── Fix default Leaflet marker icons ─────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const INDIA_BOUNDS = [[6.0, 68.0], [37.5, 97.5]];
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";
const BASE_URL =
  API_BASE.replace("/api", "");

const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  const cleanPath =
    path.replace(/^\/+/, "");

  return `${BASE_URL}/${cleanPath}`;
};

/* ── getCentroid: lat/lng center of a GeoJSON feature ─── */
function getCentroid(feature) {
  try {
    const layer = L.geoJSON(feature);
    const bounds = layer.getBounds();
    const c = bounds.getCenter();
    return [c.lat, c.lng];
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────
   FitBoundsToGeoJSON
───────────────────────────────────────────────────────── */
function FitBoundsToGeoJSON({ geojsonData, selectedState }) {
  const map = useMap();

  useEffect(() => {
    map.dragging.enable();
    map.touchZoom.enable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.setMaxBounds(null);
  }, [map]);

  useEffect(() => {
    if (!geojsonData || !geojsonData.features.length) return;
    try {
      const layer = L.geoJSON(geojsonData);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
      }
    } catch {
      map.fitBounds(INDIA_BOUNDS, { padding: [30, 30] });
    }
  }, [geojsonData, selectedState, map]);

  return null;
}

/* ── Animated Counter ─────────────────────────────────── */
function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => { started.current = false; setCount(0); }, [target]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ── Main Component ───────────────────────────────────── */
export default function IndiaDashboard() {
  const [indiaData, setIndiaData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState(null);
  const [cities, setCities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [selectedState, setSelectedState] =
    useState("");
  const stateData = cities.reduce(
    (acc, city) => {
      const state =
        city.state_name ||
        city.state;

      if (!state) return acc;

      if (!acc[state]) {
        acc[state] = {
          name: state,
          consultant_count: 0,
        };
      }

      acc[state].consultant_count +=
        Number(
          city.consultant_count || 0
        );

      return acc;
    },
    {}
  );

  const allStates =
    Object.values(stateData)
      .sort(
        (a, b) =>
          b.consultant_count -
          a.consultant_count
      );
  useEffect(() => {
    if (
      allStates.length &&
      !selectedState
    ) {
      setSelectedState(
        allStates[0].name
      );
    }
  }, [allStates, selectedState]);

  const filteredCities =
    selectedState
      ? cities.filter(
        (city) =>
          city.state_name ===
          selectedState ||
          city.state ===
          selectedState
      )
      : cities;
  const [activeCity, setActiveCity] = useState(null);

  const years = settings?.years_experience || 0;
  const partners = settings?.active_consultants || 0;
  const students = settings?.admissions_managed || 0;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/consultant-network/public");
      setSettings(res.data.settings || {});
      setCities(res.data.cities || []);
      setFeatures(res.data.features || []);
      fetch("/india.json")
        .then((r) => r.json())
        .then((data) => setIndiaData(data));
      setTimeout(() => setLoaded(true), 100);
    } catch (err) {
      console.error("Consultant network fetch failed:", err);
    }
  };

  const totalConsultants =
    cities.reduce(
      (sum, city) =>
        sum +
        Number(
          city.consultant_count || 0
        ),
      0
    );
  const maxCount =
    Math.max(
      ...allStates.map(
        (s) =>
          s.consultant_count
      ),
      1
    );
  /* ── Combined state marker: count circle + name pill ─── */
  const stateMarkerIcon = (stateName, count) =>
    L.divIcon({
      className: "",
      html: `
        <div style="
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:6px;
          pointer-events:none;
          user-select:none;
        ">
          <!-- count bubble -->
          <div style="
            width:36px;
            height:36px;
            border-radius:50%;
            background:linear-gradient(135deg,#7a1f2b,#c9922a);
            border:2.5px solid white;
            box-shadow:0 4px 14px rgba(122,31,43,0.4);
            display:flex;
            align-items:center;
            justify-content:center;
            color:white;
            font-weight:700;
            font-size:11px;
            font-family:'DM Sans',sans-serif;
          ">${count}</div>
          <!-- name pill -->
          <div style="
            background:white;
            color:#7a1f2b;
            padding:5px 14px;
            border-radius:999px;
            font-size:12px;
            font-weight:700;
            font-family:'DM Sans',sans-serif;
            white-space:nowrap;
            box-shadow:0 3px 12px rgba(0,0,0,0.18);
            border:1.5px solid rgba(122,31,43,0.12);
            letter-spacing:0.01em;
          ">${stateName}</div>
        </div>`,
      iconSize: [0, 0],
      iconAnchor: [-18, 50],  // horizontally center the marker on the centroid
    });

  /* ── GeoJSON for selected state ──────────────────────── */
  const filteredGeoFeatures = indiaData
    ? {
      type: "FeatureCollection",
      features: indiaData.features.filter((f) => {
        const n = f.properties.NAME_1 || f.properties.ST_NM ||
          f.properties.state || f.properties.name;
        return n === selectedState;
      }),
    }
    : null;

  /* ── One centroid marker per GeoJSON feature ─────────── */
  const stateCentroidMarkers = filteredGeoFeatures
    ? (() => {
      // For MultiPolygon states pick the feature with the largest bbox area
      // (mainland) so the label lands on the main body, not an island.
      const sorted = [...filteredGeoFeatures.features].sort((a, b) => {
        const area = (f) => {
          try {
            const b = L.geoJSON(f).getBounds();
            return (b.getEast() - b.getWest()) * (b.getNorth() - b.getSouth());
          } catch { return 0; }
        };
        return area(b) - area(a);
      });
      // Keep only the largest feature for label placement
      const best = sorted[sorted.length - 1];
      if (!best) return [];
      const pos = getCentroid(best);
      const name = best.properties.NAME_1 || best.properties.ST_NM ||
        best.properties.state || best.properties.name;
      const count =
        stateData[name]
          ?.consultant_count || 0;
      return pos ? [{ pos, name, count }] : [];
    })()
    : [];

  /* ── Cities for sidebar (use demo if API empty) ──────── */

  return (
    <div className={`cn-db ${loaded ? "cn-loaded" : ""}`}>

      {/* ============= HERO ============= */}
      <section className="cn-hero">
        <div className="cn-hero-noise" />
        <div className="cn-hero-radial" />
        <div className="cn-hero-lines" />
        <div className="cn-hero-badge">{settings?.hero_badge}</div>
        <h1 className="cn-hero-title">{settings?.hero_title}</h1>
        <p className="cn-hero-sub">{settings?.hero_subtitle}</p>
        <div className="cn-hero-divider">
          <span /><em>Est. 2015 · Pan-India Network</em><span />
        </div>
        <div className="cn-hero-stats">
          {[
            { num: years, suffix: "+", label: "Years Experience" },
            { num: partners, suffix: "+", label: "Active Consultants" },
            { num: students, suffix: "+", label: "Admissions Managed" },
          ].map((s, i) => (
            <div className="cn-hero-stat" key={i}>
              <div className="cn-hero-stat-num">
                <AnimatedCounter target={s.num} />{s.suffix}
              </div>
              <div className="cn-hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="cn-hero-scroll">
          <div className="cn-hero-scroll-line" />Scroll
        </div>
      </section>

      {/* ============= ABOUT ============= */}
      <section className="cn-section cn-about-section">
        <div className="cn-about-grid">
          <div className="cn-about-visual">
            <div className="cn-about-img-wrap">
              <img
                src={consultantAbout}
                alt="About"
                loading="lazy"
              />
            </div>
            <div className="cn-about-float-card">
              <strong>10+</strong>
              <span>Years of Excellence</span>
            </div>
          </div>
          <div className="cn-about-content">
            <div className="cn-section-label">About Us</div>
            <h2 className="cn-section-title">{settings?.about_title}</h2>
            <p>{settings?.about_description_1}</p>
            <p>{settings?.about_description_2}</p>
            <div className="cn-about-features">
              {features.map((f) => {
                const IconComponent = Icons[f.icon] || Icons.Star;
                return (
                  <div className="cn-about-feature" key={f.id}>
                    <div className="cn-about-feature-icon" style={{
                      width: "22px", height: "22px", borderRadius: "8px",
                      background: "linear-gradient(135deg,var(--cn-crimson),var(--cn-gold))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", flexShrink: 0, color: "#fff",
                    }}>
                      <IconComponent size={24} />
                    </div>
                    <div className="cn-about-feature-text">
                      <strong>{f.title}</strong>
                      <span>{f.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============= METRICS ============= */}
      <section className="cn-section cn-metrics-section">
        <div className="cn-metrics-inner">
          <div className="cn-metrics-header">
            <div>
              <div className="cn-section-label">By the Numbers</div>
              <h2 className="cn-section-title">Our <em>Impact</em> at a Glance</h2>
            </div>
            <p>Real results built over a decade of dedication, partnerships, and student success stories.</p>
          </div>
          <div className="cn-metrics-grid">
            {[
              { icon: "📅", num: years, suffix: "+", label: "Years of Experience", width: "100%" },
              { icon: "🤝", num: partners, suffix: "+", label: "Total Consultants", width: "80%" },
              { icon: "🎓", num: students, suffix: "+", label: "Admissions Managed", width: "95%" },
            ].map((m, i) => (
              <div className="cn-metric-card" key={i}>
                <span className="cn-metric-icon">{m.icon}</span>
                <div className="cn-metric-num">
                  <AnimatedCounter target={m.num} duration={2200} />
                  <span className="cn-metric-suffix">{m.suffix}</span>
                </div>
                <div className="cn-metric-label">{m.label}</div>
                <div className="cn-metric-bar">
                  <div className="cn-metric-bar-fill" style={{ width: m.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= MAP ============= */}
      <section className="cn-section cn-map-section">
        <div className="cn-map-inner">
          <div className="cn-map-header">
            <div className="cn-section-label">Network Map</div>
            <h2 className="cn-section-title">Our <em>Presence</em> Across India</h2>

            {/* State Filter Chips */}
            <div className="cn-state-chips">
              {allStates.map((state) => (
                <button
                  key={state.name}
                  className={`cn-chip ${selectedState === state.name ? "cn-chip-active" : ""}`}
                  onClick={() => setSelectedState(state.name)}
                >
                  <span className="cn-chip-dot" />
                  {state.name}
                </button>
              ))}
            </div>
          </div>

          <div className="cn-map-layout">
            <div className="cn-map-container">
              <MapContainer
                center={[22.5, 79]}
                zoom={5}
                minZoom={3}
                maxZoom={10}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
                dragging={true}
                doubleClickZoom={false}
                worldCopyJump={false}
                style={{ height: "700px", width: "100%", background: "#f5f5f5" }}
              >
                <ZoomControl position="bottomright" />

                <FitBoundsToGeoJSON
                  geojsonData={filteredGeoFeatures}
                  selectedState={selectedState}
                />

                {/* State shape */}
                {filteredGeoFeatures && (
                  <GeoJSON
                    key={selectedState}
                    data={filteredGeoFeatures}
                    style={() => ({
                      fillColor: "#ef6c00",
                      fillOpacity: 1,
                      color: "#ffffff",
                      weight: 2,
                    })}
                  />
                )}

                {/* Single combined marker: count + state name */}
                {stateCentroidMarkers.map((item, i) => (
                  <Marker
                    key={`state-label-${i}`}
                    position={item.pos}
                    icon={stateMarkerIcon(item.name, item.count)}
                    interactive={false}
                    zIndexOffset={1000}
                  />
                ))}
              </MapContainer>
            </div>

            {/* SIDEBAR */}
            <div className="cn-sidebar">
              <div className="cn-sidebar-card cn-crimson">
                <div className="cn-sidebar-card-label">Network Total</div>
                <div className="cn-sidebar-card-num">
                  <AnimatedCounter target={totalConsultants} />
                </div>
                <div className="cn-sidebar-card-sub">Active Consultants</div>
              </div>

              <div className="cn-sidebar-card">
                <div className="cn-sidebar-card-label">Consultants in State</div>
                <div className="cn-sidebar-card-num">
                  {
                    stateData[selectedState]
                      ?.consultant_count || 0
                  }
                </div>
                <div className="cn-sidebar-card-sub">In {selectedState}</div>
              </div>

              <div className="cn-city-list-card">
                <div className="cn-city-list-title">All States Overview</div>
                {allStates.map(
                  (state, i) => {
                    const count =
                      state.consultant_count;
                    return (
                      <div
                        className={`cn-city-entry ${activeCity === state.name ? "cn-active" : ""}`}
                        key={i}
                        onClick={() => {
                          setSelectedState(state.name);
                          setActiveCity(
                            activeCity === state.name
                              ? null
                              : state.name
                          );
                        }}
                      >
                        <div className="cn-city-entry-top">
                          <span className="cn-city-name">{state.name}</span>
                          <span className="cn-city-count">{count}</span>
                        </div>
                        <div className="cn-city-bar-track">
                          <div
                            className="cn-city-bar-fill"
                            style={{
                              width: `${(count / maxCount) *
                                100
                                }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}