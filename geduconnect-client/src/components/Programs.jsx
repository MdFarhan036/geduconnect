import React, { useEffect, useState } from "react";
import api from "../api/api";
import ProgramCard from "../components/ProgramCard";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/public/programs");
      setPrograms(res.data || []);
    } catch (err) {
      console.error("Error fetching programs", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading programs...</p>;

  return (
    <section className="programs-page">
      <div className="container">
        <h2 className="page-title">All Programs</h2>

        <div className="program-grid">
          {programs.length > 0 ? (
            programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))
          ) : (
            <p>No programs available.</p>
          )}
        </div>
      </div>
    </section>
  );
}