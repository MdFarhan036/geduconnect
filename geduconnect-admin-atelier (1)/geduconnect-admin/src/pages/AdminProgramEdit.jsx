import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function AdminProgramEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

const [courses, setCourses] = useState([]);
const [modeOptions, setModeOptions] = useState([]);

const [loadingCourses, setLoadingCourses] = useState(true);

const [form, setForm] = useState({
  course_id: "",
  name: "",
  degree: "",
  mode: "",
  is_active: true,
});

  const [loading, setLoading] = useState(true);
  const [loadingModes, setLoadingModes] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =====================================================
     LOAD PROGRAM + MODES
  ===================================================== */

useEffect(() => {
  fetchProgram();
  fetchCourses();
  fetchModes();
}, [id]);
  /* =====================================================
     FETCH PROGRAM
  ===================================================== */
const fetchCourses = async () => {
  try {
    setLoadingCourses(true);

    const response = await api.get("/admin/courses");

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.courses || [];

    setCourses(data);

  } catch (error) {
    console.error("Failed to load courses:", error);

    alert(
      error?.response?.data?.message ||
      "Failed to load courses"
    );

  } finally {
    setLoadingCourses(false);
  }
};
  const fetchProgram = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/admin/programs/${id}`);

      const program = res.data;
setForm({
  course_id: program.course_id || "",
  name: program.name || "",
  degree: program.degree || "",
  mode: program.mode || "",
  is_active: Boolean(Number(program.is_active)),
});
    } catch (err) {
      console.error(
        "Error fetching program:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Unable to load program"
      );

      navigate("/admin/programs");

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FETCH MODES FROM MASTER
  ===================================================== */

  const fetchModes = async () => {
    try {
      setLoadingModes(true);

      const response = await api.get(
        "/admin/modes"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.modes || [];

      setModeOptions(data);

    } catch (error) {
      console.error(
        "Failed to load modes:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to load modes"
      );

    } finally {
      setLoadingModes(false);
    }
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Program name is required");
      return;
    }

    if (!form.mode) {
      alert("Please select a mode");
      return;
    }

    try {
      setSaving(true);

    await api.put(`/admin/programs/${id}`, {
  course_id: form.course_id,
  name: form.name.trim(),
  degree: form.degree.trim(),
  mode: form.mode,
  is_active: form.is_active ? 1 : 0,
});

      alert(
        "Program updated successfully"
      );

      navigate("/admin/programs");

    } catch (err) {
      console.error(
        "Error updating program:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Error updating program"
      );

    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading || loadingModes) {
    return (
      <div className="admin-page">
        <h2>Loading Program...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="admin-header">

        <h2>
          Edit Program
        </h2>

        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            navigate("/admin/programs")
          }
        >
          ← Back
        </button>

      </div>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            PROGRAM NAME
        ================================================= */}
{/* =================================================
    COURSE
================================================= */}

<div className="form-group">

  <label>
    Course *
  </label>

  <select
    name="course_id"
    value={form.course_id}
    onChange={handleChange}
    required
    disabled={loadingCourses}
  >
    <option value="">
      {loadingCourses
        ? "Loading courses..."
        : "Select Course"}
    </option>

    {courses
      .filter(
        (course) =>
          Number(course.is_active) === 1
      )
      .map((course) => (
        <option
          key={course.id}
          value={course.id}
        >
          {course.name}
        </option>
      ))}
  </select>

</div>
        <div className="form-group">

          <label>
            Program Name *
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter program name"
            required
          />

        </div>

        {/* =================================================
            DEGREE
        ================================================= */}

        <div className="form-group">

          <label>
            Degree
          </label>

          <input
            type="text"
            name="degree"
            value={form.degree}
            onChange={handleChange}
            placeholder="Example: MBA, BBA, MCA"
          />

        </div>

        {/* =================================================
            MODE FROM MASTER
        ================================================= */}

        <div className="form-group">

          <label>
            Mode *
          </label>

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            required
          >

            <option value="">
              Select Mode
            </option>

            {modeOptions
              .filter(
                (mode) =>
                  Number(mode.is_active) === 1 ||
                  mode.slug === form.mode
              )
              .map((mode) => (
                <option
                  key={mode.id}
                  value={mode.slug}
                >
                  {mode.name}
                </option>
              ))}

          </select>

        </div>

        {/* =================================================
            STATUS
        ================================================= */}

        <div className="form-group checkbox-group">

          <label>

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />

            <span>
              {" "}Active
            </span>

          </label>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="form-actions">

          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              navigate("/admin/programs")
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Program"}
          </button>

        </div>

      </form>

    </div>
  );
}