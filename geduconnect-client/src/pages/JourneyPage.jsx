import React, {
  useRef,
  useEffect,
  useState,
} from "react";

import api from "../api/api";

import "./JourneyPage.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const BASE_URL =
  API_BASE.replace("/api", "");

/* =========================================================
   FIX IMAGE URLS
========================================================= */

const resolveUrl = (url) => {

  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  const cleanUrl =
    url.replace(/^\/+/, "");

  return `${BASE_URL}/${cleanUrl}`;
};

export default function JourneyPage() {

  const scrollRef = useRef(null);

  const [journeyData, setJourneyData] =
    useState([]);

  const [isDragging, setIsDragging] =
    useState(false);

  const dragData = useRef({
    startX: 0,
    scrollLeft: 0,
  });

  /* =========================================================
     FETCH JOURNEY DATA
  ========================================================= */

  useEffect(() => {
    fetchJourney();
  }, []);

  const fetchJourney = async () => {

    try {

      const res = await api.get(
        "/journey/public"
      );

      setJourneyData(
        res.data || []
      );

    } catch (err) {

      console.error(
        "Journey fetch failed:",
        err
      );
    }
  };

  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {

    const container =
      scrollRef.current;

    if (
      !container ||
      journeyData.length === 0
    ) {
      return;
    }

    let animationFrame;

    let paused = false;

    const speed = 0.7;

    const autoScroll = () => {

      if (!paused) {

        container.scrollLeft += speed;

        /* seamless loop */

        if (
          container.scrollLeft >=
          container.scrollWidth / 2
        ) {
          container.scrollLeft = 0;
        }
      }

      animationFrame =
        requestAnimationFrame(
          autoScroll
        );
    };

    animationFrame =
      requestAnimationFrame(
        autoScroll
      );

    /* pause on hover */

    const stop = () =>
      (paused = true);

    const start = () =>
      (paused = false);

    container.addEventListener(
      "mouseenter",
      stop
    );

    container.addEventListener(
      "mouseleave",
      start
    );

    return () => {

      cancelAnimationFrame(
        animationFrame
      );

      container.removeEventListener(
        "mouseenter",
        stop
      );

      container.removeEventListener(
        "mouseleave",
        start
      );
    };

  }, [journeyData]);

  /* =========================================================
     DRAG SCROLL
  ========================================================= */

  const handleMouseDown = (e) => {

    const container =
      scrollRef.current;

    if (!container) return;

    setIsDragging(true);

    container.classList.add(
      "active"
    );

    dragData.current = {
      startX:
        e.pageX -
        container.offsetLeft,

      scrollLeft:
        container.scrollLeft,
    };
  };

  const handleMouseLeave = () => {

    setIsDragging(false);

    scrollRef.current?.classList.remove(
      "active"
    );
  };

  const handleMouseUp = () => {

    setIsDragging(false);

    scrollRef.current?.classList.remove(
      "active"
    );
  };

  const handleMouseMove = (e) => {

    if (!isDragging) return;

    e.preventDefault();

    const container =
      scrollRef.current;

    if (!container) return;

    const x =
      e.pageX -
      container.offsetLeft;

    const walk =
      (x -
        dragData.current.startX) *
      1.8;

    container.scrollLeft =
      dragData.current.scrollLeft -
      walk;
  };

  /* =========================================================
     DUPLICATE FOR INFINITE LOOP
  ========================================================= */

  const loopData = [
    ...journeyData,
    ...journeyData,
  ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <section className="journey-snake">

      <div className="journey-container">

        {/* =========================================================
            HEADER
        ========================================================= */}

        <div className="journey-header">

          <span className="journey-tag">
            Our Growth Story
          </span>

          <h2>
            A Journey of Vision,
            Innovation & Expansion
          </h2>

          <p>
            From our foundation
            to national impact,
            every milestone
            reflects our
            commitment to
            transforming
            education partnerships
            across India.
          </p>

        </div>

        {/* =========================================================
            TIMELINE
        ========================================================= */}

        <div
          className="snake-scroll-wrapper"
          ref={scrollRef}
          onMouseDown={
            handleMouseDown
          }
          onMouseLeave={
            handleMouseLeave
          }
          onMouseUp={
            handleMouseUp
          }
          onMouseMove={
            handleMouseMove
          }
        >

          <div className="snake-row">

            {loopData.map(
              (item, index) => (

                <div
                  key={`${item.id}-${index}`}
                  className="snake-item"
                >

                  {/* DOT */}

                  <div className="snake-dot" />

                  {/* CARD */}

                  <div className="snake-card">

                    <div className="snake-card-glow" />

                    <span className="year">
                      {item.year}
                    </span>

                    <h4>
                      {item.title}
                    </h4>

                    <p>
                      {item.description}
                    </p>

                    <div className="snake-arrow">
                      →
                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </section>
  );
}