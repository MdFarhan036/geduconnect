import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { Helmet } from "react-helmet";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const BASE_URL = API_BASE.replace("/api", "");

export default function UniversityPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUniversity();
  }, [slug]);

  const fetchUniversity = async () => {
    try {
      setLoading(true);

      const uniRes = await api.get(`/public/university/${slug}`);
      const progRes = await api.get(
        `/public/university/${slug}/programs`
      );

      setData(uniRes.data);
      setPrograms(progRes.data || []);
    } catch (err) {
      console.error("University load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) =>
    `${BASE_URL}${path?.startsWith("/") ? "" : "/"}${path}`;

  if (loading) return <div className="container">Loading...</div>;
  if (!data) return <div className="container">University not found</div>;

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>{data.name} | Admission 2025</title>
        <meta
          name="description"
          content={data.short_description}
        />
      </Helmet>

      {/* ================= HERO ================= */}
      <section
        className="uni-hero"
        style={{
          backgroundImage: data.banner_image
            ? `url(${getImageUrl(data.banner_image)})`
            : "",
        }}
      >
        <div className="container hero-inner">
          <div className="hero-left">
            {data.logo_url && (
              <img
                src={getImageUrl(data.logo_url)}
                alt={data.name}
                className="uni-logo"
              />
            )}
            <h1>{data.name}</h1>
            <p>{data.short_description}</p>

            {data.apply_link && (
              <a
                href={data.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn primary"
              >
                Apply Now
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="row-section">
        <div className="container">
          <h2>About {data.name}</h2>
          <p>{data.full_description}</p>
        </div>
      </section>

      {/* ================= HIGHLIGHTS ================= */}
      <section className="row-section bg-light">
        <div className="container highlights">
          <div className="highlight-box">
            <h4>Accreditation</h4>
            <p>{data.accreditation || "UGC Approved"}</p>
          </div>

          <div className="highlight-box">
            <h4>Ranking</h4>
            <p>{data.ranking || "Top Ranked University"}</p>
          </div>

          <div className="highlight-box">
            <h4>Mode</h4>
            <p>{data.mode}</p>
          </div>
        </div>
      </section>

      {/* ================= PROGRAMS ================= */}
      <section className="row-section">
        <div className="container">
          <h2>Programs Offered</h2>

          {programs.length === 0 ? (
            <p>No programs available.</p>
          ) : (
            <div className="program-grid">
              {programs.map(program => (
                <div key={program.id} className="program-card">
                  <h3>{program.program_name}</h3>
                  <p><strong>Duration:</strong> {program.duration}</p>
                  <p><strong>Fees:</strong> {program.fees}</p>

                  {data.apply_link && (
                    <a
                      href={data.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn small"
                    >
                      Apply
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= ADMISSION PROCESS ================= */}
      <section className="row-section bg-light">
        <div className="container">
          <h2>Admission Process</h2>
          <ol className="admission-steps">
            <li>Register Online</li>
            <li>Submit Required Documents</li>
            <li>Pay Application Fees</li>
            <li>Admission Confirmation</li>
          </ol>
        </div>
      </section>

      {/* ================= STICKY APPLY ================= */}
      {data.apply_link && (
        <div className="sticky-apply">
          <a
            href={data.apply_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now
          </a>
        </div>
      )}
    </>
  );
}