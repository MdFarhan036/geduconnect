import { useEffect, useState } from "react";
import api from "../api/api";
import "./CounsellingModal.css";

export default function CounsellingModal({
  show,
  onClose,
  university,
}) {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    university_id: "",
    course_id: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* =====================================================
     LOAD CURRENT UNIVERSITY + COURSES
  ===================================================== */

  useEffect(() => {
    if (!show || !university) return;

    setFormData((prev) => ({
      ...prev,
      university_id: university.id || "",
      course_id: "",
    }));

    setCourses([]);
    setError("");
    setSuccess("");

    if (university.id) {
      loadCourses(university.id);
    }
  }, [show, university]);

  /* =====================================================
     LOAD COURSES
  ===================================================== */

  const loadCourses = async (universityId) => {
    if (!universityId) {
      setCourses([]);
      return;
    }

    try {
      setLoadingCourses(true);
      setError("");

      const response = await api.get(
        `/public/programs/${universityId}`
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setCourses(list);
    } catch (err) {
      console.error("Failed to load courses:", err);

      setCourses([]);

      setError(
        "Unable to load courses. Please try again."
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* =====================================================
     CLOSE
  ===================================================== */

  const handleClose = () => {
    if (submitting) return;

    setError("");
    setSuccess("");

    onClose();
  };

  /* =====================================================
     SUBMIT
  ===================================================== */
const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  /* ================= VALIDATION ================= */

  if (!formData.name.trim()) {
    setError("Please enter your name.");
    return;
  }

  if (!formData.mobile.trim()) {
    setError("Please enter your mobile number.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
    setError("Please enter a valid 10-digit mobile number.");
    return;
  }

  if (!formData.email.trim()) {
    setError("Please enter your email address.");
    return;
  }

  if (!formData.course_id) {
    setError("Please select a course.");
    return;
  }

  if (!university?.id) {
    setError("University information is missing.");
    return;
  }

  /* ================= SELECTED COURSE ================= */

  const selectedCourse = courses.find(
    (course) =>
      String(course.id) === String(formData.course_id)
  );

  const courseName =
    selectedCourse?.name ||
    selectedCourse?.title ||
    selectedCourse?.program_name ||
    selectedCourse?.program ||
    "";

  if (!courseName) {
    setError("Unable to identify the selected course.");
    return;
  }

  /* ================= SUBMIT ================= */

  try {
    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),

      university_id: university.id,
      university_name: university.name || "",

      course_id: formData.course_id,
      course_name: courseName,

      message: formData.message.trim(),
    };

    console.log("COUNSELLING REQUEST:", payload);

    const response = await api.post(
      "/public/counselling",
      payload
    );

    console.log(
      "COUNSELLING RESPONSE:",
      response.data
    );

    /* ================= SUCCESS ================= */

    setSuccess(
      "Thank you! Our counsellor will contact you shortly."
    );

    setTimeout(() => {
      setFormData({
        name: "",
        mobile: "",
        email: "",
        university_id: university?.id || "",
        course_id: "",
        message: "",
      });

      onClose();
      setSuccess("");
    }, 2200);

  } catch (err) {
    console.error(
      "Counselling enquiry error:",
      err
    );

    setError(
      err?.response?.data?.message ||
        "Unable to submit your counselling request. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};


  /* =====================================================
     DON'T SHOW
  ===================================================== */

  if (!show) return null;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="counselling-modal-overlay"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget &&
          !submitting
        ) {
          handleClose();
        }
      }}
    >

      {/* Floating background decorations */}

      <div className="counselling-floating-shape shape-one" />
      <div className="counselling-floating-shape shape-two" />
      <div className="counselling-floating-shape shape-three" />


      {/* =================================================
          MODAL
      ================================================= */}

      <div className="counselling-modal">

        {/* =================================================
            LEFT PANEL
        ================================================= */}

        <div className="counselling-info">

          <button
            className="mobile-close"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>

          <div className="counselling-image-wrapper">

            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
              alt="Education counselling"
              className="counselling-image"
            />

            <div className="image-overlay" />

            <div className="image-content">

              <div className="image-badge">
                🎓 FREE COUNSELLING
              </div>

              <h2>
                Your Education.
                <br />
                Your Future.
              </h2>

              <p>
                Get personalised guidance from
                our education counsellors.
              </p>

            </div>

          </div>


          {/* Benefits */}

          <div className="counselling-benefits">

            <div className="benefit-item">

              <div className="benefit-icon">
                🎓
              </div>

              <div>
                <strong>
                  Course Guidance
                </strong>

                <span>
                  Choose the right course for your goals
                </span>
              </div>

            </div>


            <div className="benefit-item">

              <div className="benefit-icon">
                🏫
              </div>

              <div>
                <strong>
                  University Guidance
                </strong>

                <span>
                  Understand your university options
                </span>
              </div>

            </div>


            <div className="benefit-item">

              <div className="benefit-icon">
                💬
              </div>

              <div>
                <strong>
                  Personalised Support
                </strong>

                <span>
                  Speak directly with our counsellors
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT FORM
        ================================================= */}

        <div className="counselling-form-panel">

          {/* Close */}

          <button
            type="button"
            className="desktop-close"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>


          {/* Header */}

          <div className="counselling-form-header">

            <span className="form-eyebrow">
              ✨ TALK TO AN EXPERT
            </span>

            <h2>
              Get Free Counselling
            </h2>

            <p>
              Fill in your details and we'll
              help you make the right choice.
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            className="counselling-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name <span>*</span>
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={submitting}
                />

              </div>

            </div>


            {/* MOBILE */}

            <div className="form-group">

              <label>
                Mobile Number <span>*</span>
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  📱
                </span>

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  disabled={submitting}
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address <span>*</span>
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={submitting}
                />

              </div>

            </div>


            {/* UNIVERSITY */}

            <div className="form-group">

              <label>
                University
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🏛️
                </span>

                <input
                  type="text"
                  value={university?.name || ""}
                  readOnly
                  disabled={submitting}
                />

              </div>

            </div>


            {/* COURSE */}

            <div className="form-group full-width">

              <label>
                Interested Course <span>*</span>
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  📚
                </span>

                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  disabled={
                    submitting ||
                    loadingCourses ||
                    courses.length === 0
                  }
                >

                  <option value="">
                    {loadingCourses
                      ? "Loading courses..."
                      : courses.length === 0
                      ? "No courses available"
                      : "Select your course"}
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.name ||
                        course.title ||
                        course.program_name ||
                        course.program ||
                        `Course ${course.id}`}
                    </option>
                  ))}

                </select>

              </div>

            </div>


            {/* MESSAGE */}

            <div className="form-group full-width">

              <label>
                How can we help you?
              </label>

              <div className="input-wrapper textarea-wrapper">

                <span className="input-icon textarea-icon">
                  💬
                </span>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  rows={3}
                  disabled={submitting}
                />

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="counselling-error">
                <span>⚠️</span>
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div className="counselling-success">

                <span className="success-check">
                  ✓
                </span>

                <div>
                  <strong>
                    Request Submitted!
                  </strong>

                  <small>
                    Our counsellor will contact
                    you shortly.
                  </small>
                </div>

              </div>
            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="counselling-submit"
              disabled={
                submitting ||
                loadingCourses
              }
            >

              {submitting ? (
                <>
                  <span className="submit-spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  Get Free Counselling
                  <span className="submit-arrow">
                    →
                  </span>
                </>
              )}

            </button>


            <div className="secure-note">
              🔒 Your information is safe and
              will only be used for counselling.
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
