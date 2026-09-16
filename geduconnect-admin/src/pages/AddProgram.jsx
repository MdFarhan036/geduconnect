import React, { useState } from "react";
import api from "../api";

export default function AddProgram() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    degree: "",
    duration: "",
    mode: "Online",
    description: "",
    is_active: true,
  });

  const generateSlug = (text) =>
    text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  const handleNameChange = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      name: value,
      slug: generateSlug(value),
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/programs", form);
      alert("Program added successfully!");
    } catch (err) {
      alert("Error adding program");
    }
  };

  return (
    <div className="admin-form-page">
      <h2>Add Program</h2>

      <form onSubmit={handleSubmit} className="admin-form">

        <label>Program Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleNameChange}
          required
        />

        <label>Slug</label>
        <input
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          required
        />

        <label>Degree</label>
        <input
          type="text"
          name="degree"
          value={form.degree}
          onChange={handleChange}
        />

        <label>Duration</label>
        <input
          type="text"
          name="duration"
          value={form.duration}
          onChange={handleChange}
        />

        <label>Mode</label>
        <select name="mode" value={form.mode} onChange={handleChange}>
          <option value="Online">Online</option>
          <option value="Regular">Regular</option>
          <option value="Distance">Distance</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>

        <button type="submit" className="btn-primary">
          Save Program
        </button>

      </form>
    </div>
  );
}