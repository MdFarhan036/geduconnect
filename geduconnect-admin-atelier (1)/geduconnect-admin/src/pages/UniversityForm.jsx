import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function UniversityForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    established: "",
    naac_grade: "",
    type: "Private",
    status: "Published",
    description: "",
    short_description: "",
    meta_title: "",
    meta_description: ""
  });

  const [programs, setPrograms] = useState([
    { name: "", duration: "", eligibility: "", fees: "" }
  ]);

  const [placement, setPlacement] = useState({
    highest_package: "",
    average_package: "",
    placement_rate: ""
  });

  const [banner, setBanner] = useState(null);
  const [logo, setLogo] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= PROGRAMS ================= */

  const handleProgramChange = (index, field, value) => {
    const updated = [...programs];
    updated[index][field] = value;
    setPrograms(updated);
  };

  const addProgram = () => {
    setPrograms([
      ...programs,
      { name: "", duration: "", eligibility: "", fees: "" }
    ]);
  };

  const removeProgram = (index) => {
    const updated = programs.filter((_, i) => i !== index);
    setPrograms(updated);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    formData.append("programs", JSON.stringify(programs));
    formData.append("placement", JSON.stringify(placement));

    if (banner) formData.append("banner", banner);
    if (logo) formData.append("logo", logo);

    await api.post("/admin/university", formData);

    navigate("/universities");
  };

  return (
    <div className="admin-container">
      <h2>Add University</h2>

      <form onSubmit={handleSubmit} className="admin-form">

        {/* BASIC INFO */}
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

        {/* SEO */}
        <h3>SEO Settings</h3>
        <input name="meta_title" placeholder="Meta Title" onChange={handleChange}/>
        <textarea name="meta_description" placeholder="Meta Description" onChange={handleChange}/>

        {/* PROGRAMS */}
        <h3>Programs</h3>
        {programs.map((program, index) => (
          <div key={index} className="program-box">
            <input
              placeholder="Program Name"
              onChange={(e) =>
                handleProgramChange(index, "name", e.target.value)
              }
            />
            <input
              placeholder="Duration"
              onChange={(e) =>
                handleProgramChange(index, "duration", e.target.value)
              }
            />
            <input
              placeholder="Eligibility"
              onChange={(e) =>
                handleProgramChange(index, "eligibility", e.target.value)
              }
            />
            <input
              placeholder="Fees"
              onChange={(e) =>
                handleProgramChange(index, "fees", e.target.value)
              }
            />

            {index > 0 && (
              <button type="button" onClick={() => removeProgram(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addProgram}>
          + Add Program
        </button>

        {/* PLACEMENT */}
        <h3>Placement</h3>
        <input
          placeholder="Highest Package"
          onChange={(e) =>
            setPlacement({ ...placement, highest_package: e.target.value })
          }
        />
        <input
          placeholder="Average Package"
          onChange={(e) =>
            setPlacement({ ...placement, average_package: e.target.value })
          }
        />
        <input
          placeholder="Placement Rate %"
          onChange={(e) =>
            setPlacement({ ...placement, placement_rate: e.target.value })
          }
        />

        {/* IMAGE UPLOAD */}
        <h3>Images</h3>
        <input type="file" onChange={(e) => setBanner(e.target.files[0])} />
        <input type="file" onChange={(e) => setLogo(e.target.files[0])} />

        <button type="submit" className="btn-primary">
          Save University
        </button>
      </form>
    </div>
  );
}