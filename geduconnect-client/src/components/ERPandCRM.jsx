import React from "react";
import "./ERPandCRM.css";

import erpandcrmimg from "../assets/banner-1.png";
import erpimage from "../assets/erp.jpeg";
import crmimage from "../assets/crm.webp";
import collaborateimg from "../assets/collaborate.png";

import iconimage from "../assets/cloud.png";
import collab1 from "../assets/laptop.png";
import collab2 from "../assets/diamond.png";
import collab3 from "../assets/right-arrow.png";

export const ERPandCRM = () => {
  return (
    <div className="erpcrm">

      {/* =======================================================
          HERO
      ======================================================= */}

      <section className="erpcrm-hero">

        <div className="erpcrm-container">

          <div className="erpcrm-hero-grid">

            <div className="erpcrm-hero-left">

              <span className="erpcrm-tag">
                ERP & CRM Solutions
              </span>

              <h1>
                Smart ERP &
                <br />
                CRM Systems
                <br />
                For Modern
                <br />
                Institutions
              </h1>

              <p>
                Streamline admissions,
                operations, customer
                relationships, finance,
                and communication with
                intelligent enterprise
                solutions built for
                growth.
              </p>

              <div className="erpcrm-hero-buttons">

                <a href="#">
                  Get Started
                </a>

                <a href="#">
                  Book Demo
                </a>

              </div>

            </div>

            <div className="erpcrm-hero-right">

              <img
                src={erpandcrmimg}
                alt=""
              />

            </div>

          </div>

        </div>

      </section>

      {/* =======================================================
          ERP + CRM
      ======================================================= */}

      <section className="erpcrm-section">

        <div className="erpcrm-container">

          {/* ERP */}

          <div className="erpcrm-split">

            <div className="erpcrm-image">

              <img
                src={erpimage}
                alt=""
              />

            </div>

            <div className="erpcrm-content">

              <span className="erpcrm-mini-tag">
                ERP SYSTEM
              </span>

              <h2>
                Enterprise Resource
                Planning
              </h2>

              <p>
                ERP systems integrate
                finance, HR, inventory,
                operations, and workflows
                into one centralized
                ecosystem.
              </p>

              <p>
                Manage institutional
                operations with better
                automation, real-time
                reporting, and seamless
                collaboration between
                departments.
              </p>

            </div>

          </div>

          {/* CRM */}

          <div className="erpcrm-split reverse">

            <div className="erpcrm-content">

              <span className="erpcrm-mini-tag">
                CRM SYSTEM
              </span>

              <h2>
                Customer Relationship
                Management
              </h2>

              <p>
                Build stronger student
                relationships with
                centralized communication,
                lead tracking, admissions
                workflows, and automation.
              </p>

              <p>
                Deliver better experiences,
                improve conversion rates,
                and manage the full
                student journey from
                enquiry to enrollment.
              </p>

            </div>

            <div className="erpcrm-image">

              <img
                src={crmimage}
                alt=""
              />

            </div>

          </div>

        </div>

      </section>

      {/* =======================================================
          FEATURES
      ======================================================= */}

      <section className="erpcrm-features">

        <div className="erpcrm-container">

          <div className="erpcrm-heading">

            <span className="erpcrm-mini-tag">
              WHY CHOOSE US
            </span>

            <h2>
              Powerful Features
              <br />
              Built For Scale
            </h2>

          </div>

          <div className="erpcrm-feature-grid">

            <div className="erpcrm-feature-card">

              <div className="erpcrm-icon">
                <img
                  src={iconimage}
                  alt=""
                />
              </div>

              <h3>
                Cloud Compatibility
              </h3>

              <p>
                Access systems securely
                from anywhere with modern
                cloud infrastructure.
              </p>

            </div>

            <div className="erpcrm-feature-card">

              <div className="erpcrm-icon orange">
                <img
                  src={iconimage}
                  alt=""
                />
              </div>

              <h3>
                Real-Time Insights
              </h3>

              <p>
                Analyze institutional
                data instantly using
                dynamic dashboards.
              </p>

            </div>

            <div className="erpcrm-feature-card">

              <div className="erpcrm-icon">
                <img
                  src={iconimage}
                  alt=""
                />
              </div>

              <h3>
                Open Architecture
              </h3>

              <p>
                Flexible systems designed
                for integrations and
                scalability.
              </p>

            </div>

            <div className="erpcrm-feature-card">

              <div className="erpcrm-icon orange">
                <img
                  src={iconimage}
                  alt=""
                />
              </div>

              <h3>
                HR Management
              </h3>

              <p>
                Manage employees,
                workflows, payroll,
                and performance
                efficiently.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =======================================================
          COLLABORATION
      ======================================================= */}

      <section className="erpcrm-collab">

        <div className="erpcrm-container">

          <div className="erpcrm-collab-grid">

            <div className="erpcrm-collab-image">

              <img
                src={collaborateimg}
                alt=""
              />

            </div>

            <div className="erpcrm-collab-content">

              <span className="erpcrm-mini-tag">
                SMART COLLABORATION
              </span>

              <h2>
                Work Better
                <br />
                Together
              </h2>

              <div className="erpcrm-points">

                <div className="erpcrm-point">

                  <img
                    src={collab1}
                    alt=""
                  />

                  <div>

                    <h4>
                      Notes & Tracking
                    </h4>

                    <p>
                      Organize tasks,
                      discussions, and
                      workflows efficiently.
                    </p>

                  </div>

                </div>

                <div className="erpcrm-point">

                  <img
                    src={collab2}
                    alt=""
                  />

                  <div>

                    <h4>
                      User Management
                    </h4>

                    <p>
                      Handle permissions,
                      roles, and access
                      seamlessly.
                    </p>

                  </div>

                </div>

                <div className="erpcrm-point">

                  <img
                    src={collab3}
                    alt=""
                  />

                  <div>

                    <h4>
                      Progress Tracking
                    </h4>

                    <p>
                      Track institutional
                      growth and operational
                      performance.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};