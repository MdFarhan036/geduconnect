import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function AdminProgramEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    degree: "",
    mode: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      const res = await api.get(`/admin/programs/${id}`);

      const program = res.data;

      setForm({
        name: program.name || "",
        degree: program.degree || "",
        mode: program.mode || "",
        is_active: Boolean(program.is_active),
      });
    } catch (err) {
      console.error("Error fetching program:", err);
      alert("Unable to load program");
      navigate("/admin/programs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Program name is required");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/admin/programs/${id}`, {
        name: form.name.trim(),
        degree: form.degree.trim(),
        mode: form.mode,
        is_active: form.is_active ? 1 : 0,
      });

      alert("Program updated successfully");

      navigate("/admin/programs");
    } catch (err) {
      console.error("Error updating program:", err);

      alert(
        err?.response?.data?.message ||
          "Error updating program"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Loading Program...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Edit Program</h2>

        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/admin/programs")}
        >
          ← Back
        </button>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* PROGRAM NAME */}
        <div className="form-group">
          <label>Program Name *</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter program name"
            required
          />
        </div>

        {/* DEGREE */}
        <div className="form-group">
          <label>Degree</label>

          <input
            type="text"
            name="degree"
            value={form.degree}
            onChange={handleChange}
            placeholder="Example: MBA, BBA, MCA"
          />
        </div>

        {/* MODE */}
        <div className="form-group">
          <label>Mode</label>

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
          >
            <option value="">Select Mode</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Regular">Regular</option>
            <option value="Distance">Distance</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* STATUS */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />

            <span> Active</span>
          </label>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/admin/programs")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Program"}
          </button>
        </div>
      </form>
    </div>
  );
}