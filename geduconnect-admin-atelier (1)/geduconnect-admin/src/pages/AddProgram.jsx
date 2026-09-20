import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

export default function AddProgram() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const courseIdFromUrl = searchParams.get("course_id");

    const [courses, setCourses] = useState([]);
    const [modeOptions, setModeOptions] = useState([]);

    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingModes, setLoadingModes] = useState(true);

    const [form, setForm] = useState({
        course_id: courseIdFromUrl || "",
        name: "",
        slug: "",
        degree: "",
        duration: "",
        mode: "",
        description: "",
        eligibility: "",
        fees: "",
        is_active: true,
    });

    /* =====================================================
       LOAD COURSES + MODES
    ===================================================== */

    useEffect(() => {
        fetchCourses();
        fetchModes();
    }, []);

    /* =====================================================
       LOAD COMMON COURSES
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
            console.error(
                "Failed to load courses:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load courses"
            );

        } finally {
            setLoadingCourses(false);
        }
    };

    /* =====================================================
       LOAD MODES
    ===================================================== */

    const fetchModes = async () => {
        try {
            setLoadingModes(true);

            const response = await api.get("/admin/modes");

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
                error.response?.data?.message ||
                "Failed to load modes"
            );

        } finally {
            setLoadingModes(false);
        }
    };

    /* =====================================================
       NAME → SLUG
    ===================================================== */

    const generateSlug = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

    const handleNameChange = (e) => {
        const value = e.target.value;

        setForm((previous) => ({
            ...previous,
            name: value,
            slug: generateSlug(value),
        }));
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

        setForm((previous) => ({
            ...previous,
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

        if (!form.course_id) {
            alert("Please select a course");
            return;
        }

        if (!form.name.trim()) {
            alert("Program name is required");
            return;
        }

        if (!form.mode) {
            alert("Please select a mode");
            return;
        }

        try {
            await api.post(
                `/admin/courses/${form.course_id}/programs`,
                {
                    name: form.name,
                    slug: form.slug,
                    degree: form.degree,
                    duration: form.duration,
                    mode: form.mode,
                    description: form.description,
                    eligibility: form.eligibility,
                    fees: form.fees,
                    is_active: form.is_active,
                }
            );

            alert("Program added successfully!");

            navigate("/admin/programs");

        } catch (error) {
            console.error(
                "ADD PROGRAM ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Error adding program"
            );
        }
    };

    /* =====================================================
       SELECTED COURSE
    ===================================================== */

    const selectedCourse = courses.find(
        (course) =>
            String(course.id) ===
            String(form.course_id)
    );

    /* =====================================================
       LOADING
    ===================================================== */

    if (loadingCourses || loadingModes) {
        return (
            <div className="admin-form-page">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="admin-form-page">

            <h2>
                Add Common Program
            </h2>

            <p>
                Create a program under a common
                course. This program can later be
                assigned to universities.
            </p>

            <form
                onSubmit={handleSubmit}
                className="admin-form"
            >

                {/* =================================================
                    COURSE
                ================================================= */}

                <label>
                    Course *
                </label>

                <select
                    name="course_id"
                    value={form.course_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Select Course
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

                {/* Selected Course Info */}

                {selectedCourse && (
                    <div
                        style={{
                            marginTop: "8px",
                            marginBottom: "15px",
                            padding: "10px 12px",
                            background: "#f5f7fa",
                            borderRadius: "6px",
                            fontSize: "14px",
                        }}
                    >
                        Creating program under:

                        <strong
                            style={{
                                marginLeft: "5px",
                            }}
                        >
                            {selectedCourse.name}
                        </strong>
                    </div>
                )}

                {/* =================================================
                    PROGRAM NAME
                ================================================= */}

                <label>
                    Program Name *
                </label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleNameChange}
                    placeholder="e.g. B.Tech CSE"
                    required
                />

                {/* =================================================
                    SLUG
                ================================================= */}

                <label>
                    Slug
                </label>

                <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="e.g. btech-cse"
                />

                {/* =================================================
                    DEGREE
                ================================================= */}

                <label>
                    Degree
                </label>

                <input
                    type="text"
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech"
                />

                {/* =================================================
                    DURATION
                ================================================= */}

                <label>
                    Duration
                </label>

                <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 4 Years"
                />

                {/* =================================================
                    MODE - FROM MASTER
                ================================================= */}

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
                                Number(mode.is_active) === 1
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

                {/* =================================================
                    ELIGIBILITY
                ================================================= */}

                <label>
                    Eligibility
                </label>

                <textarea
                    name="eligibility"
                    value={form.eligibility}
                    onChange={handleChange}
                    placeholder="Program eligibility"
                    rows="3"
                />

                {/* =================================================
                    FEES
                ================================================= */}

                <label>
                    Fees
                </label>

                <input
                    type="text"
                    name="fees"
                    value={form.fees}
                    onChange={handleChange}
                    placeholder="e.g. ₹2,50,000"
                />

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <label>
                    Description
                </label>

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Program description"
                    rows="5"
                />

                {/* =================================================
                    ACTIVE
                ================================================= */}

                <label>
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                    />

                    {" "}Active
                </label>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "20px",
                    }}
                >
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                            navigate("/admin/programs")
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Save Program
                    </button>
                </div>

            </form>

        </div>
    );
}