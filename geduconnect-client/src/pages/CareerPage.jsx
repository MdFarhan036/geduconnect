import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import api from "../api/api";
import "./CareerPage.css";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CareerPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    api
      .get("/careers/public")
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="career-loader">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="career-no-data">
        No Data Found
      </div>
    );
  }

  const { page, jobs, faqs } = data;

  return (
    <>
      {/* =========================================================
          SEO
      ========================================================= */}

      <Helmet>
        <title>
          {page?.meta_title ||
            "Careers - G Educonnect"}
        </title>

        <meta
          name="description"
          content={
            page?.meta_description ||
            "Explore exciting career opportunities at G Educonnect."
          }
        />
      </Helmet>

      {/* =========================================================
          PAGE
      ========================================================= */}

      <div className="career">

        {/* =========================================================
            HERO
        ========================================================= */}

        <section
          className="career-hero"
          style={
            page?.hero_image
              ? {
                  backgroundImage: `url(${BASE_URL}${page.hero_image})`,
                }
              : {}
          }
        >

          <div className="career-hero-overlay" />

          <div className="career-hero-content">

            <span className="career-badge">
              Careers at G Educonnect
            </span>

            <h1>{page?.hero_title}</h1>

            <p>
              Build your future with one
              of India’s fastest-growing
              education partnership
              networks.
            </p>

          </div>

        </section>

        {/* =========================================================
            JOIN SECTION
        ========================================================= */}

        <section className="career-section">

          <div className="career-container">

            <div className="career-about">

              {/* LEFT */}

              <div className="career-about-content">

                <span className="career-section-tag">
                  Join Our Team
                </span>

                <h2>
                  {page?.join_title}
                </h2>

                <p>
                  {page?.join_description}
                </p>

                {page?.resume_email && (

                  <div className="career-mail-box">

                    <span>
                      Send your resume at
                    </span>

                    <a
                      href={`mailto:${page.resume_email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {page.resume_email}
                    </a>

                  </div>
                )}

              </div>

              {/* RIGHT */}

              {page?.join_image && (

                <div className="career-about-image">

                  <img
                    src={`${BASE_URL}${page.join_image}`}
                    alt="Join G Educonnect Team"
                  />

                </div>
              )}

            </div>

          </div>

        </section>

        {/* =========================================================
            JOBS SECTION
        ========================================================= */}

        {jobs?.length > 0 && (

          <section className="career-jobs-section">

            <div className="career-container">

              <div className="career-job-header">

                <span className="career-section-tag">
                  Open Positions
                </span>

                <h2>
                  We Are Hiring
                </h2>

                <p>
                  Explore opportunities and
                  become part of a fast-growing
                  educational ecosystem.
                </p>

              </div>

              {/* JOB GRID */}

              <div className="career-job-grid">

                {jobs.map((job) => (

                  <div
                    className="career-job-card"
                    key={job.id}
                  >

                    {/* TOP */}

                    <div className="career-job-top">

                      <h3>
                        {job.position}
                      </h3>

                      <span className="career-job-status">

                        {job.is_active === 1
                          ? "Open"
                          : "Closed"}

                      </span>

                    </div>

                    {/* META */}

                    <div className="career-job-meta">

                      <div>

                        <strong>
                          Location
                        </strong>

                        <span>
                          {job.location}
                        </span>

                      </div>

                      <div>

                        <strong>
                          Experience
                        </strong>

                        <span>
                          {job.experience}
                        </span>

                      </div>

                      <div>

                        <strong>
                          Salary
                        </strong>

                        <span>
                          {job.salary_range}
                        </span>

                      </div>

                    </div>

                    {/* BUTTON */}

                    {job.is_active === 1 ? (

                      <a
                        href={`mailto:${page.resume_email}?subject=${encodeURIComponent(
                          `Application for ${job.position}`
                        )}`}
                        className="career-apply-btn"
                      >
                        Apply Now
                      </a>

                    ) : (

                      <button
                        className="career-closed-btn"
                        disabled
                      >
                        Applications Closed
                      </button>

                    )}

                  </div>
                ))}

              </div>

            </div>

          </section>
        )}

        {/* =========================================================
            FAQ SECTION
        ========================================================= */}

        {faqs?.length > 0 && (

          <section className="career-section">

            <div className="career-container">

              <div className="career-job-header">

                <span className="career-section-tag">
                  FAQs
                </span>

                <h2>
                  Frequently Asked Questions
                </h2>

              </div>

              <div className="career-faqs">

                {faqs.map((faq, index) => {

                  const isOpen =
                    activeFaq === index;

                  return (

                    <div
                      className={`career-faq-item ${
                        isOpen ? "active" : ""
                      }`}
                      key={faq.id || index}
                    >

                      <button
                        className="career-faq-question"
                        onClick={() =>
                          setActiveFaq(
                            isOpen ? null : index
                          )
                        }
                      >

                        <span>
                          {faq.question}
                        </span>

                        <span className="career-faq-icon">
                          {isOpen ? "−" : "+"}
                        </span>

                      </button>

                      <div
                        className={`career-faq-answer ${
                          isOpen ? "show" : ""
                        }`}
                      >

                        <p>
                          {faq.answer}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </section>
        )}

      </div>
    </>
  );
}