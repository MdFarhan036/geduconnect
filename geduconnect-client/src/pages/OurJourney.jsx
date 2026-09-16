import React, { useEffect, useRef, useState } from "react";
import "./JourneyPage.css"
const journeyData = [
  { year: "2019", title: "Foundation", desc: "Started G Educonnect." },
  { year: "2020", title: "Online Expansion", desc: "Partnered with universities." },
  { year: "2021", title: "National Growth", desc: "Expanded across India." },
  { year: "2022", title: "Corporate Tie-ups", desc: "Employee education programs." },
  { year: "2023", title: "5000+ Students", desc: "Major milestone achieved." },
  { year: "2024", title: "Expansion Phase", desc: "Entered new markets." },
  { year: "2025", title: "Technology Upgrade", desc: "Launched new platform." },
  { year: "2026", title: "Global Presence", desc: "International partnerships." },
];

export default function OurJourneyHorizontal() {
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const calculatePositions = () => {
      const path = pathRef.current;
      const svg = svgRef.current;

      if (!path || !svg) return;

      const length = path.getTotalLength();
      const svgRect = svg.getBoundingClientRect();

      const scaleX = svgRect.width / 2200;
      const scaleY = svgRect.height / 500;

      const newPositions = journeyData.map((_, index) => {
        const point = path.getPointAtLength(
          (length / (journeyData.length - 1)) * index
        );

        return {
          x: point.x * scaleX,
          y: point.y * scaleY,
        };
      });

      setPositions(newPositions);
    };

    calculatePositions();
    window.addEventListener("resize", calculatePositions);

    return () => window.removeEventListener("resize", calculatePositions);
  }, []);

  return (
    <section className="journey-modern">
      <div className="container">
        <div className="journey-header">
          <h2>Our Journey</h2>
          <p>Milestones that shaped G Educonnect.</p>
        </div>

        <div className="journey-path-wrapper">
          <svg
            ref={svgRef}
            viewBox="0 0 2200 500"
            className="journey-path"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              ref={pathRef}
              d="
                M50 260
                C250 120 450 120 650 260
                S1050 400 1250 200
                S1500 120 1650 240
                S1900 360 2100 200
              "
              fill="none"
              stroke="#2f5fd0"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>

          {positions.map((pos, index) => {
            const isTop = index % 2 === 0;

            return (
              <div
                key={index}
                className="milestone"
                style={{
                  left: pos.x,
                  top: pos.y,
                }}
              >
                <div className="milestone-dot" />

                <div
                  className={`milestone-card ${
                    isTop ? "card-top" : "card-bottom"
                  }`}
                >
                  <span className="year">{journeyData[index].year}</span>
                  <h4>{journeyData[index].title}</h4>
                  <p>{journeyData[index].desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}