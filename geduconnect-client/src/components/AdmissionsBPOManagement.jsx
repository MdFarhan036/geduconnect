import React from "react";
import "./AdmissionsBPOManagement.css";

import admissionsBPOimg from "../assets/Admissions-Processing.webp";
import strategicinitiativesImg from "../assets/strategicinitiatives.png";
import serviceDeliveryImg from "../assets/Service-Delivery.webp";
import datamangImg from "../assets/1693229966091.jpeg";
import costreductionImg from "../assets/Ways-to-Reduce-Your-cost.png";
import streamlinedAdmissionsImg from "../assets/admission-process.jpg";
import scalablesolutionImg from "../assets/scalablesolutionImg.jpg";

export const AdmissionsBPOManagement = () => {
  return (

    <div className="admbpo">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="admbpo-hero-section">

        <div className="main-container">

          <div
            className="inner-hero"
            data-aos="fade-in"
            data-duration="0"
          >

            {/* LEFT */}

            <div className="inner-hero-left adminsion-hero-left">

              <span className="admbpo-tag">
                Admissions & BPO
              </span>

              <h1 className="hero-title-txt">
                Admissions &
                <br />
                BPO Management
              </h1>

              <div className="comm-para">

                <p>
                  In the competitive and
                  fast-paced world of higher
                  education, institutions are
                  increasingly looking for ways
                  to optimize operations,
                  reduce administrative
                  burdens, and improve service
                  delivery.
                </p>

                <p>
                  Admissions & Business Process
                  Outsourcing Management offers
                  universities and colleges an
                  efficient way to manage
                  essential tasks while
                  allowing them to focus on
                  strategic growth and student
                  success.
                </p>

              </div>

            </div>

            {/* RIGHT */}

            <div className="inner-hero-right">

              <img
                src={admissionsBPOimg}
                alt="Admissions BPO"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}

      <section className="comm-section admsn-step-main-div">

        <div className="container-small">

          <div className="adm-proc-steps-wrap">

            {/* =========================================================
                ITEM 1
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-right"
                data-duration="0"
              >

                <span className="admbpo-mini-tag">
                  FEATURE 01
                </span>

                <h3 className="adm-step-title">
                  Streamlined Admissions
                  Process
                </h3>

                <div className="comm-para">

                  <p>
                    The admissions process
                    involves application
                    management, verification,
                    scheduling, and continuous
                    communication with
                    applicants.
                  </p>

                  <p>
                    Our BPO services automate
                    workflows, accelerate
                    processing, and improve
                    communication to increase
                    efficiency and applicant
                    satisfaction.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-left"
                data-duration="0"
              >

                <div className="adm-img">

                  <img
                    src={streamlinedAdmissionsImg}
                    alt="Streamlined Admissions"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                ITEM 2
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-left"
                data-duration="200"
              >

                <span className="admbpo-mini-tag">
                  FEATURE 02
                </span>

                <h3 className="adm-step-title">
                  Cost Reduction
                </h3>

                <div className="comm-para">

                  <p>
                    Outsourcing administrative
                    tasks significantly reduces
                    operational costs and
                    eliminates the burden of
                    large in-house teams.
                  </p>

                  <p>
                    Institutions can redirect
                    resources toward academic
                    excellence, student
                    engagement, and strategic
                    innovation initiatives.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-right"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={costreductionImg}
                    alt="Cost Reduction"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                ITEM 3
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-right"
                data-duration="200"
              >

                <span className="admbpo-mini-tag">
                  FEATURE 03
                </span>

                <h3 className="adm-step-title">
                  Scalable Solutions
                </h3>

                <div className="comm-para">

                  <p>
                    Admissions demand changes
                    throughout the year.
                    Our scalable solutions
                    adapt effortlessly during
                    peak and off-peak cycles.
                  </p>

                  <p>
                    This flexibility ensures
                    uninterrupted workflows
                    without overwhelming
                    institutional staff.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-left"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={scalablesolutionImg}
                    alt="Scalable Solutions"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                ITEM 4
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-left"
                data-duration="200"
              >

                <span className="admbpo-mini-tag">
                  FEATURE 04
                </span>

                <h3 className="adm-step-title">
                  Enhanced Data Management
                </h3>

                <div className="comm-para">

                  <p>
                    Admissions involve large
                    volumes of sensitive
                    academic and financial
                    data.
                  </p>

                  <p>
                    Our secure management
                    systems ensure safe
                    processing while advanced
                    analytics provide insights
                    into applicant behavior
                    and institutional growth.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-right"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={datamangImg}
                    alt="Enhanced Data Management"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                ITEM 5
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-right"
                data-duration="200"
              >

                <span className="admbpo-mini-tag">
                  FEATURE 05
                </span>

                <h3 className="adm-step-title">
                  Improved Service Delivery
                </h3>

                <div className="comm-para">

                  <p>
                    Specialized teams and
                    advanced technologies help
                    deliver consistent,
                    accurate, and high-quality
                    administrative support.
                  </p>

                  <p>
                    Prospective students
                    receive faster responses,
                    seamless onboarding, and
                    better communication
                    throughout the admissions
                    journey.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-left"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={serviceDeliveryImg}
                    alt="Improved Service Delivery"
                  />

                </div>

              </div>

            </div>

            {/* =========================================================
                ITEM 6
            ========================================================= */}

            <div className="adm-proc-steps">

              <div
                className="adm-proc-step-left"
                data-aos="fade-left"
                data-duration="200"
              >

                <span className="admbpo-mini-tag">
                  FEATURE 06
                </span>

                <h3 className="adm-step-title">
                  Focus on Strategic
                  Initiatives
                </h3>

                <div className="comm-para">

                  <p>
                    By outsourcing repetitive
                    operations, universities
                    can focus on innovation,
                    academic quality, student
                    engagement, and future
                    growth.
                  </p>

                  <p>
                    Institutions gain more
                    time and resources to
                    strengthen reputation,
                    improve curriculum, and
                    create better learning
                    experiences.
                  </p>

                </div>

              </div>

              <div
                className="adm-proc-step-right"
                data-aos="fade-right"
                data-duration="200"
              >

                <div className="adm-img">

                  <img
                    src={strategicinitiativesImg}
                    alt="Strategic Initiatives"
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