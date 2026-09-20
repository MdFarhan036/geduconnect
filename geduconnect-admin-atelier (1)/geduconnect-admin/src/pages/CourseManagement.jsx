import { useEffect, useState } from "react";
import "./CourseManagement.css";
import api from "../api";

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [modeOptions, setModeOptions] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        duration: "",
        mode: "",
        is_active: true,
    });

    /* =====================================================
       LOAD COMMON COURSES
    ===================================================== */

    const fetchCourses = async () => {
        try {
            setLoadingCourses(true);

            const response = await api.get(
                "/admin/courses"
            );

            setCourses(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.courses || []
            );

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
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchCourses();
        fetchModes();
    }, []);
    const fetchModes = async () => {
        try {
            const response = await api.get("/admin/modes");

            setModeOptions(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.modes || []
            );
        } catch (error) {
            console.error(
                "Failed to load modes:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load modes"
            );
        }
    };
    /* =====================================================
       FORM CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    /* =====================================================
       OPEN ADD MODAL
    ===================================================== */

    const openAddModal = () => {
        setEditingCourse(null);

        setForm({
            name: "",
            slug: "",
            description: "",
            duration: "",
            mode: "",
            is_active: true,
        });

        setShowModal(true);
    };

    /* =====================================================
       OPEN EDIT MODAL
    ===================================================== */

    const openEditModal = (course) => {
        setEditingCourse(course);

        setForm({
            name: course.name || "",
            slug: course.slug || "",
            description: course.description || "",
            duration: course.duration || "",
            mode: course.mode || "",
            is_active:
                Number(course.is_active) === 1,
        });

        setShowModal(true);
    };

    /* =====================================================
       SAVE COURSE
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.name.trim()) {
            alert("Course name is required");
            return;
        }

        try {
            if (editingCourse) {

                await api.put(
                    `/admin/courses/${editingCourse.id}`,
                    {
                        ...form,
                    }
                );

                alert(
                    "Course updated successfully"
                );

            } else {

                await api.post(
                    "/admin/courses",
                    {
                        ...form,
                    }
                );

                alert(
                    "Course added successfully"
                );
            }

            setShowModal(false);

            setEditingCourse(null);

            await fetchCourses();

        } catch (error) {
            console.error(
                "Save course failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save course"
            );
        }
    };

    /* =====================================================
       DELETE COURSE
    ===================================================== */

    const handleDelete = async (course) => {
        const confirmed = window.confirm(
            `Delete "${course.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(
                `/admin/courses/${course.id}`
            );

            alert(
                "Course deleted successfully"
            );

            await fetchCourses();

        } catch (error) {
            console.error(
                "Delete course failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete course"
            );
        }
    };

    /* =====================================================
       MANAGE PROGRAMS
    ===================================================== */

    const managePrograms = (course) => {
        window.location.href =
            `/admin/programs?course_id=${course.id}`;
    };

    return (
        <div className="course-management">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="course-header">

                <div>
                    <h1>
                        Course Management
                    </h1>

                    <p>
                        Manage common courses used
                        across universities.
                    </p>
                </div>



            </div>


            {/* =================================================
                INFO
            ================================================= */}


            {/* =================================================
                COURSE SECTION
            ================================================= */}

            <div className="course-section">

                <div className="course-section-header">

                    <div>
                        <h2>
                            Common Courses
                        </h2>

                        <p>
                            {courses.length}{" "}
                            course
                            {courses.length !== 1
                                ? "s"
                                : ""}{" "}
                            available
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="primary-btn"
                    >
                        + Add Course
                    </button>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loadingCourses ? (

                    <div className="course-loading">
                        Loading courses...
                    </div>

                ) : courses.length === 0 ? (

                    /* =================================================
                       EMPTY
                    ================================================= */

                    <div className="course-empty">

                        <div className="empty-icon">
                            📚
                        </div>

                        <h3>
                            No courses found
                        </h3>

                        <p>
                            Create your first common
                            course.
                        </p>

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="primary-btn"
                        >
                            + Add Course
                        </button>

                    </div>

                ) : (

                    /* =================================================
                       TABLE
                    ================================================= */

                    <div className="course-table-wrapper">

                        <table className="course-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Slug
                                    </th>

                                    <th>
                                        Duration
                                    </th>

                                    <th>
                                        Mode
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {courses.map(
                                    (
                                        course,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                course.id
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        course.name
                                                    }
                                                </strong>

                                            </td>

                                            <td>
                                                {
                                                    course.slug ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    course.duration ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    course.mode ||
                                                    "-"
                                                }
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        Number(
                                                            course.is_active
                                                        ) ===
                                                            1
                                                            ? "status-active"
                                                            : "status-inactive"
                                                    }
                                                >
                                                    {
                                                        Number(
                                                            course.is_active
                                                        ) ===
                                                            1
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <div className="course-actions">

                                                    <button
                                                        type="button"
                                                        className="program-btn"
                                                        onClick={() =>
                                                            managePrograms(
                                                                course
                                                            )
                                                        }
                                                    >
                                                        Programs
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            openEditModal(
                                                                course
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                course
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (

                <div className="course-modal-overlay">

                    <div className="course-modal">

                        <div className="course-modal-header">

                            <div>
                                <h2>
                                    {editingCourse
                                        ? "Edit Course"
                                        : "Add Common Course"}
                                </h2>

                                <p>
                                    {editingCourse
                                        ? "Update course information"
                                        : "Create a reusable common course"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="course-form"
                        >

                            {/* COURSE NAME */}

                            <div className="form-group">

                                <label>
                                    Course Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. B.Tech"
                                    required
                                />

                            </div>


                            {/* SLUG */}

                            <div className="form-group">

                                <label>
                                    Slug
                                </label>

                                <input
                                    type="text"
                                    name="slug"
                                    value={
                                        form.slug
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. btech"
                                />

                            </div>


                            {/* DURATION + MODE */}

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Duration
                                    </label>

                                    <input
                                        type="text"
                                        name="duration"
                                        value={
                                            form.duration
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 4 Years"
                                    />

                                </div>


                                <div className="form-group">
                                        <label>
                                        Mode
                                    </label>
                                    <select
                                        name="mode"
                                        value={form.mode}
                                        onChange={handleChange}
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

                                </div>

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="4"
                                    placeholder="Course description"
                                />

                            </div>


                            {/* STATUS */}

                            <label className="checkbox-field">

                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        form.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <span>
                                    Active
                                </span>

                            </label>


                            {/* ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    {editingCourse
                                        ? "Update Course"
                                        : "Add Course"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}