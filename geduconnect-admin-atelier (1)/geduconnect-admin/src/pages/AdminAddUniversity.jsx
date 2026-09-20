import { useState } from "react";
import api from "../api";

export default function AdminAddUniversity() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    short_description: "",
    established: "",
    naac_grade: "",
    type: "Private"
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/admin/university", form);
    alert("University Added");
  };

  return (
    <div className="admin-form">
      <h2>Add University</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="University Name" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />
        <input name="established" placeholder="Established Year" onChange={handleChange} />
        <input name="naac_grade" placeholder="NAAC Grade" onChange={handleChange} />
        <select name="type" onChange={handleChange}>
          <option>Private</option>
          <option>Government</option>
        </select>
        <textarea name="short_description" placeholder="Short Description" onChange={handleChange}/>
        <textarea name="description" placeholder="Full Description" onChange={handleChange}/>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}