import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminPrograms() {
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);

    const [search, setSearch] = useState("");
    const [courseFilter, setCourseFilter] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    /* =====================================================
       LOAD DATA
    ===================================================== */

    useEffect(() => {
        fetchCourses();
        fetchPrograms();
    }, []);

    /* =====================================================
       FETCH COMMON COURSES
    ===================================================== */

    const fetchCourses = async () => {
        try {
            const res = await api.get("/admin/courses");

            setCourses(
                Array.isArray(res.data)
                    ? res.data
                    : res.data.courses || []
            );
        } catch (err) {
            console.error(
                "Error fetching courses:",
                err
            );
        }
    };

    /* =====================================================
       FETCH COMMON PROGRAMS
    ===================================================== */

    const fetchPrograms = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                "/admin/programs"
            );

            setPrograms(
                Array.isArray(res.data)
                    ? res.data
                    : res.data.programs || []
            );

        } catch (err) {
            console.error(
                "Error fetching programs:",
                err
            );

        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Delete this program?"
            )
        ) {
            return;
        }

        try {
            await api.delete(
                `/admin/programs/${id}`
            );

            await fetchPrograms();

        } catch (err) {
            console.error(
                "Delete program error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Error deleting program"
            );
        }
    };

    /* =====================================================
       FILTER
    ===================================================== */

    const filteredPrograms = useMemo(() => {
        const searchValue =
            search.trim().toLowerCase();

        return programs.filter((program) => {

            const matchesSearch =
                !searchValue ||
                program.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                program.course_name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                program.degree
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesCourse =
                !courseFilter ||
                String(program.course_id) ===
                    String(courseFilter);

            return (
                matchesSearch &&
                matchesCourse
            );
        });

    }, [
        programs,
        search,
        courseFilter,
    ]);

    return (
        <div className="admin-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-header">

                <div>
                    <h2>
                        Common Programs
                    </h2>

                    <p>
                        Manage programs under
                        common courses.
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={() =>
                        navigate(
                            "/admin/programs/add"
                        )
                    }
                >
                    + Add Program
                </button>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                }}
            >

                <input
                    type="text"
                    placeholder="Search programs..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="admin-search"
                    style={{
                        marginBottom: 0,
                        flex: 1,
                        minWidth: "250px",
                    }}
                />

                <select
                    value={courseFilter}
                    onChange={(e) =>
                        setCourseFilter(
                            e.target.value
                        )
                    }
                    style={{
                        minWidth: "220px",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                    }}
                >

                    <option value="">
                        All Courses
                    </option>

                    {courses.map((course) => (
                        <option
                            key={course.id}
                            value={course.id}
                        >
                            {course.name}
                        </option>
                    ))}

                </select>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="admin-table-wrapper">

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Course
                            </th>

                            <th>
                                Program
                            </th>

                            <th>
                                Degree
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

                        {loading ? (

                            <tr>
                                <td
                                    colSpan="8"
                                    style={{
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    Loading programs...
                                </td>
                            </tr>

                        ) : filteredPrograms.length >
                          0 ? (

                            filteredPrograms.map(
                                (program) => (
                                    <tr
                                        key={
                                            program.id
                                        }
                                    >

                                        <td>
                                            {
                                                program.id
                                            }
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    program.course_name ||
                                                    "-"
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {
                                                program.name
                                            }
                                        </td>

                                        <td>
                                            {
                                                program.degree ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                program.duration ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                program.mode ||
                                                "-"
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    Number(
                                                        program.is_active
                                                    ) ===
                                                    1
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >
                                                {
                                                    Number(
                                                        program.is_active
                                                    ) ===
                                                    1
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/programs/edit/${program.id}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn-delete"
                                                onClick={() =>
                                                    handleDelete(
                                                        program.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                )
                            )

                        ) : (

                            <tr>

                                <td
                                    colSpan="8"
                                    style={{
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    No programs found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}