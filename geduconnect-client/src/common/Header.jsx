import React from "react";
import { Navbar } from "./Navbar";
import "./Header.css";

export const Header = () => {
  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="nav-top">
        <div className="contact">

          {/* PHONE */}
          <div className="num">
            <a href="tel:+919251925827">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  viewBox="0 0 48 48"
                  width="16"
                >
                  <path d="M0 0h48v48H0z" fill="none" />
                  <path d="M13.25 21.59c2.88 5.66 7.51 10.29 13.18 13.17l4.4-4.41c.55-.55 1.34-.71 2.03-.49C35.1 30.6 37.51 31 40 31c1.11 0 2 .89 2 2v7c0 1.11-.89 2-2 2C21.22 42 6 26.78 6 8c0-1.11.9-2 2-2h7c1.11 0 2 .89 2 2 0 2.49.4 4.9 1.14 7.14.22.69.06 1.48-.49 2.03l-4.4 4.42z" />
                </svg>
              </span>
              +91 925-192-5827
            </a>
          </div>

          {/* EMAIL */}
          <div className="email">
            <a href="mailto:admin@geduconnect.com">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="16"
                  height="16"
                >
                  <path d="M256 352c-16.53 0-33.06-5.422-47.16-16.41L0 173.2V400C0 426.5 21.49 448 48 448h416c26.51 0 48-21.49 48-48V173.2l-208.8 162.5C289.1 346.6 272.5 352 256 352zM16.29 145.3l212.2 165.1c16.19 12.6 38.87 12.6 55.06 0l212.2-165.1C505.1 137.3 512 125 512 112C512 85.49 490.5 64 464 64h-416C21.49 64 0 85.49 0 112C0 125 6.01 137.3 16.29 145.3z" />
                </svg>
              </span>
              admin@geduconnect.com
            </a>
          </div>

        </div>

        {/* SOCIAL ICONS */}
        <div className="social">

          {/* FACEBOOK */}
          <a
            href="https://www.facebook.com/geduconnectpvtltd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 320 512"
              fill="white"
            >
              <path d="M279.14 288l14.22-92.66h-88.91V127.31c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.17 44.38-121.17 124.72v70.62H22.89V288h81.3v224h100.2V288z" />
            </svg>
          </a>

          {/* TWITTER / X */}
          <a href="#" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M14.095 10.316L22.286 1h-1.941l-7.115 8.088L7.551 1H1l8.589 12.231L1 23h1.941l7.509-8.543L16.449 23H23l-8.905-12.684z" />
            </svg>
          </a>

          {/* INSTAGRAM */}
          <a
            href="https://www.instagram.com/geduconnect/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
            >
              <path
                fill="#FFFFFF"
                d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm5 7.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z"
              />
            </svg>
          </a>

          {/* LINKEDIN */}
          <a
            href="https://www.linkedin.com/company/geduconnect/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
            >
              <path
                fill="#FFFFFF"
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.369-1.852 3.6 0 4.267 2.368 4.267 5.451v6.292z"
              />
            </svg>
          </a>

        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <Navbar />
    </>
  );
};