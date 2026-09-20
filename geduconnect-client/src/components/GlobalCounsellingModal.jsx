import { useEffect, useState } from "react";
import api from "../api/api";
import "./GlobalCounsellingModal.css";

export default function GlobalCounsellingModal({
  show,
  onClose,
}) {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loadingUniversities, setLoadingUniversities] =
    useState(false);

  const [loadingCourses, setLoadingCourses] =
    useState(false);

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
     LOAD UNIVERSITIES
  ===================================================== */

  useEffect(() => {
    if (!show) return;

    loadUniversities();

    setError("");
    setSuccess("");
  }, [show]);

  const loadUniversities = async () => {
    try {
      setLoadingUniversities(true);
      setError("");

      const response = await api.get(
        "/public/universities"
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.universities)
        ? data.universities
        : [];

      setUniversities(list);
    } catch (err) {
      console.error(
        "Failed to load universities:",
        err
      );

      setUniversities([]);

      setError(
        "Unable to load universities. Please try again."
      );
    } finally {
      setLoadingUniversities(false);
    }
  };

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
      setCourses([]);
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
      console.error(
        "Failed to load courses:",
        err
      );

      setCourses([]);

      setError(
        "Unable to load courses for this university."
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");

    /* University changed */

    if (name === "university_id") {
      setFormData((prev) => ({
        ...prev,
        university_id: value,
        course_id: "",
      }));

      setCourses([]);

      if (value) {
        loadCourses(value);
      }
    }
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

    if (!/^[6-9]\d{9}$/.test(
      formData.mobile.trim()
    )) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.university_id) {
      setError("Please select a university.");
      return;
    }

    if (!formData.course_id) {
      setError("Please select a course.");
      return;
    }

    const selectedUniversity =
      universities.find(
        (university) =>
          String(university.id) ===
          String(formData.university_id)
      );

    const selectedCourse =
      courses.find(
        (course) =>
          String(course.id) ===
          String(formData.course_id)
      );

    const universityName =
      selectedUniversity?.name ||
      selectedUniversity?.title ||
      "";

    const courseName =
      selectedCourse?.name ||
      selectedCourse?.title ||
      selectedCourse?.program_name ||
      selectedCourse?.program ||
      "";

    if (!universityName) {
      setError(
        "Unable to identify the selected university."
      );
      return;
    }

    if (!courseName) {
      setError(
        "Unable to identify the selected course."
      );
      return;
    }

    /* ================= API ================= */

    try {
      setSubmitting(true);

      await api.post(
        "/public/counselling",
        {
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          email: formData.email.trim(),

          university_id:
            formData.university_id,

          university_name:
            universityName,

          course_id:
            formData.course_id,

          course_name:
            courseName,

          message:
            formData.message.trim(),
        }
      );

      setSuccess(
        "Thank you! Our counsellor will contact you shortly."
      );

      setTimeout(() => {
        setFormData({
          name: "",
          mobile: "",
          email: "",
          university_id: "",
          course_id: "",
          message: "",
        });

        setCourses([]);

        onClose();
        setSuccess("");
      }, 2200);

    } catch (err) {
      console.error(
        "Counselling submission error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to submit your counselling request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="global-counselling-overlay"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget &&
          !submitting
        ) {
          handleClose();
        }
      }}
    >

      <div className="global-counselling-modal">

        {/* ================= CLOSE ================= */}

        <button
          className="global-counselling-close"
          type="button"
          onClick={handleClose}
          disabled={submitting}
        >
          ×
        </button>

        {/* ================= LEFT ================= */}

        <div className="global-counselling-left">

          <div className="global-counselling-image">

            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
              alt="Free education counselling"
            />

            <div className="global-image-overlay" />

            <div className="global-counselling-content">

              <span>
                🎓 FREE COUNSELLING
              </span>

              <h2>
                Find the Right
                <br />
                Course & University
              </h2>

              <p>
                Get personalised guidance from
                our education counsellors.
              </p>

            </div>

          </div>

          <div className="global-benefits">

            <div>
              <strong>🎓 Expert Guidance</strong>
              <span>
                Make an informed education decision.
              </span>
            </div>

            <div>
              <strong>🏫 University Selection</strong>
              <span>
                Explore suitable universities.
              </span>
            </div>

            <div>
              <strong>💬 Personal Support</strong>
              <span>
                Talk directly with our counsellors.
              </span>
            </div>

          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="global-counselling-right">

          <div className="global-form-header">

            <span>
              ✨ TALK TO AN EXPERT
            </span>

            <h2>
              Get Free Counselling
            </h2>

            <p>
              Tell us what you're looking for
              and we'll guide you.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="global-counselling-form"
          >

            {/* NAME + MOBILE */}

            <div className="global-form-row">

              <div className="global-form-group">

                <label>
                  Full Name <b>*</b>
                </label>

                <div className="global-input">
                  <span>👤</span>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    disabled={submitting}
                  />
                </div>

              </div>

              <div className="global-form-group">

                <label>
                  Mobile Number <b>*</b>
                </label>

                <div className="global-input">
                  <span>📱</span>

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    maxLength={10}
                    inputMode="numeric"
                    disabled={submitting}
                  />
                </div>

              </div>

            </div>

            {/* EMAIL */}

            <div className="global-form-group">

              <label>
                Email Address <b>*</b>
              </label>

              <div className="global-input">
                <span>✉️</span>

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

            {/* UNIVERSITY + COURSE */}

            <div className="global-form-row">

              <div className="global-form-group">

                <label>
                  University <b>*</b>
                </label>

                <div className="global-input">

                  <span>🏛️</span>

                  <select
                    name="university_id"
                    value={formData.university_id}
                    onChange={handleChange}
                    disabled={
                      submitting ||
                      loadingUniversities
                    }
                  >

                    <option value="">
                      {loadingUniversities
                        ? "Loading universities..."
                        : "Select university"}
                    </option>

                    {universities.map(
                      (university) => (
                        <option
                          key={university.id}
                          value={university.id}
                        >
                          {university.name ||
                            university.title}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              <div className="global-form-group">

                <label>
                  Interested Course <b>*</b>
                </label>

                <div className="global-input">

                  <span>📚</span>

                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    disabled={
                      submitting ||
                      loadingCourses ||
                      !formData.university_id ||
                      courses.length === 0
                    }
                  >

                    <option value="">
                      {loadingCourses
                        ? "Loading courses..."
                        : !formData.university_id
                        ? "Select university first"
                        : courses.length === 0
                        ? "No courses available"
                        : "Select course"}
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={course.id}
                          value={course.id}
                        >
                          {course.name ||
                            course.title ||
                            course.program_name ||
                            course.program}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

            </div>

            {/* MESSAGE */}

            <div className="global-form-group">

              <label>
                How can we help you?
              </label>

              <div className="global-textarea">

                <span>💬</span>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your requirements..."
                  disabled={submitting}
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="global-form-error">
                ⚠️ {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="global-form-success">
                <strong>✓ Request Submitted!</strong>
                <span>
                  Our counsellor will contact you shortly.
                </span>
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              className="global-submit-btn"
              disabled={
                submitting ||
                loadingUniversities ||
                loadingCourses
              }
            >
              {submitting ? (
                <>
                  <span className="global-spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  Get Free Counselling
                  <span>→</span>
                </>
              )}
            </button>

            <small className="global-secure-note">
              🔒 Your information is safe and
              will only be used for counselling.
            </small>

          </form>

        </div>

      </div>
    </div>
  );
}