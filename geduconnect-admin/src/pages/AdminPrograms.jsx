import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/admin/programs");
      setPrograms(res.data || []);
    } catch (err) {
      console.error("Error fetching programs");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;

    try {
      await api.delete(`/admin/programs/${id}`);
      fetchPrograms();
    } catch (err) {
      alert("Error deleting program");
    }
  };

  const filteredPrograms = programs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Programs</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/admin/programs/add")}
        >
          + Add Program
        </button>
      </div>

      <input
        type="text"
        placeholder="Search programs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search"
      />

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Degree</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <tr key={program.id}>
                <td>{program.id}</td>
                <td>{program.name}</td>
                <td>{program.degree}</td>
                <td>{program.mode}</td>
                <td>
                  <span
                    className={
                      program.is_active
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {program.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() =>
                      navigate(`/admin/programs/edit/${program.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(program.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No programs found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}