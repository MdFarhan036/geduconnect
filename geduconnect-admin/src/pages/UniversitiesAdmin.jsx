import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function UniversitiesAdmin() {
  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/admin/universities");
      setUniversities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this university?")) return;

    try {
      await api.delete(`/admin/university/${id}`);
      fetchUniversities();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Universities</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/universities/new")}
        >
          + Add University
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Type</th>
            <th>NAAC</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((uni) => (
            <tr key={uni.id}>
              <td>{uni.name}</td>
              <td>{uni.location}</td>
              <td>{uni.type}</td>
              <td>{uni.naac_grade}</td>
              <td>{uni.status}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() =>
                    navigate(`/universities/edit/${uni.id}`)
                  }
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(uni.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}