import React from "react";
import "./EscalateAdmissions.css";

import escalateadimg from "../assets/admission-guidance-bnr-img.png";
import escalateadimg1 from "../assets/personalized-guidance.webp";
import escalateadimg2 from "../assets/admission-process.jpg";
import escalateadimg3 from "../assets/blog-tt-process-documentation.jpeg";
import escalateadimg4 from "../assets/admission-offices.webp";
import escalateadimg5 from "../assets/high-school-student-job-or-college-interview.jpg";

export const EscalateAdmissions = () => {
  return (
    <div className="escalateadmission">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <section className="escalateadmission-hero-section">

        <div className="main-container">

          <div
            className="inner-hero"
            data-aos="fade-in"
            data-duration="0"
          >

            {/* LEFT */}

            <div className="inner-hero-left">

              <span className="esc-tag">
                Admission Guidance
              </span>

              <h1 className="hero-title-txt">
                Escalate
                <span className="highlighter">
                  {" "}Admission
                </span>
              </h1>

              <div className="comm-para">

                <p>
                  Navigating the admissions
                  process can be challenging
                  for many students applying
                  to universities, colleges,
                  and professional programs.
                </p>

                <p>
                  Our expert guidance helps
                  students overcome delays,
                  application obstacles,
                  documentation issues, and
                  communication gaps while
                  improving their chances of
                  successful admissions.
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="inner-hero-right">

              <img
                src={escalateadimg}
                alt="Escalate Admission"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          PROCESS SECTION
      ========================================================= */}

      <section className="comm-section admsn-step-main-div">

        <div className="container-small">

          <div className="adm-proc-steps-wrap">

            {/* =========================================================
                STEP 01
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-right"
                data-duration="0"
              >

                <span className="esc-mini-tag">
                  STEP 01
                </span>

                <h3 className="adm-step-title">
                  Personalized Guidance
                </h3>

                <div className="comm-para">

                  <p>
                    We begin by understanding
                    each student's educational
                    background, aspirations,
                    and challenges during the
                    admissions journey.
                  </p>

                  <p>
                    Our team delivers tailored
                    guidance according to
                    university requirements,
                    application expectations,
                    and career goals.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-number"
                data-aos="zoom-in"
                data-duration="0"
              >

                <div className="adm-stp-num-wrap">

                  <div className="adm-stp-num">
                    <p>01</p>
                  </div>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-left"
                data-duration="0"
              >

                <div className="adm-img">

                  <img
                    src={escalateadimg1}
                    alt="Personalized Guidance"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                STEP 02
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-left"
                data-duration="200"
              >

                <span className="esc-mini-tag">
                  STEP 02
                </span>

                <h3 className="adm-step-title">
                  Completing the Admission
                  Process
                </h3>

                <div className="comm-para">

                  <p>
                    University admissions
                    follow structured and
                    competitive pathways
                    depending on programs,
                    entrance exams, and merit
                    criteria.
                  </p>

                  <p>
                    We guide students through
                    every stage including
                    applications, counseling,
                    interviews, document
                    submission, and final
                    enrollment procedures.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-number"
                data-aos="zoom-in"
                data-duration="0"
              >

                <div className="adm-stp-num-wrap">

                  <div className="adm-stp-num">
                    <p>02</p>
                  </div>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-right"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={escalateadimg2}
                    alt="Admission Process"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                STEP 03
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-right"
                data-duration="200"
              >

                <span className="esc-mini-tag">
                  STEP 03
                </span>

                <h3 className="adm-step-title">
                  Essential Documentation
                </h3>

                <div className="comm-para">

                  <p>
                    Proper documentation is
                    critical for successful
                    admissions and appeal
                    processes.
                  </p>

                  <p>
                    We assist students in
                    organizing transcripts,
                    recommendation letters,
                    statements, certificates,
                    and supporting records in
                    a professional format.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-number"
                data-aos="zoom-in"
                data-duration="0"
              >

                <div className="adm-stp-num-wrap">

                  <div className="adm-stp-num">
                    <p>03</p>
                  </div>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-left"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={escalateadimg3}
                    alt="Documentation"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                STEP 04
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-left"
                data-duration="200"
              >

                <span className="esc-mini-tag">
                  STEP 04
                </span>

                <h3 className="adm-step-title">
                  Communication with
                  Admissions Offices
                </h3>

                <div className="comm-para">

                  <p>
                    Effective communication
                    with admissions departments
                    plays an important role in
                    application success.
                  </p>

                  <p>
                    We prepare students for
                    professional email writing,
                    follow-ups, calls, and
                    interactions with
                    university representatives.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-number"
                data-aos="zoom-in"
                data-duration="0"
              >

                <div className="adm-stp-num-wrap">

                  <div className="adm-stp-num">
                    <p>04</p>
                  </div>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-right"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={escalateadimg4}
                    alt="Admissions Offices"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                STEP 05
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-right"
                data-duration="200"
              >

                <span className="esc-mini-tag">
                  STEP 05
                </span>

                <h3 className="adm-step-title">
                  Maximizing Success
                </h3>

                <div className="comm-para">

                  <p>
                    Our strategy combines
                    institutional insights,
                    documentation support,
                    communication guidance,
                    and student profiling.
                  </p>

                  <p>
                    We support applicants at
                    every step to maximize
                    admission success and help
                    students confidently move
                    toward their academic
                    future.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-number"
                data-aos="zoom-in"
                data-duration="0"
              >

                <div className="adm-stp-num-wrap">

                  <div className="adm-stp-num">
                    <p>05</p>
                  </div>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-left"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={escalateadimg5}
                    alt="Success Guidance"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};