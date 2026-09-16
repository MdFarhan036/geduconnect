import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProgramCard({ program }) {
  const navigate = useNavigate();

  return (
    <div
      className="program-card"
      onClick={() => navigate(`/program/${program.slug}`)}
    >
      <h3>{program.name}</h3>
      <p className="program-university">{program.university_name}</p>

      <div className="program-meta">
        <span>{program.duration}</span>
        <span>{program.mode}</span>
      </div>

      <div className="program-fees">
        ₹ {program.fees?.toLocaleString()}
      </div>
    </div>
  );
}