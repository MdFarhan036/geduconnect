import db from "../config/db.js";


/* =========================================================
   ADD COMMON COURSE
   POST /api/admin/courses
========================================================= */

export const addCourse = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            duration,
            mode,
            is_active,
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Course name is required",
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO courses
            (
                name,
                slug,
                description,
                duration,
                mode,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                name.trim(),
                slug || null,
                description || null,
                duration || null,
                mode || null,
                is_active === false ? 0 : 1,
            ]
        );

        res.status(201).json({
            message: "Course added successfully",
            course_id: result.insertId,
        });

    } catch (err) {
        console.error("ADD COURSE ERROR:", err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Course slug already exists",
            });
        }

        res.status(500).json({
            message: "Failed to add course",
        });
    }
};


/* =========================================================
   GET ALL COMMON COURSES
   GET /api/admin/courses
========================================================= */
export const getAllCourses = async (req, res) => {
    try {
        const { mode } = req.query;

        let sql = `
            SELECT
                id,
                name,
                slug,
                description,
                duration,
                mode,
                is_active,
                created_at,
                updated_at

            FROM courses

            WHERE is_active = 1
        `;

        const params = [];

        /* ================= MODE FILTER ================= */

        if (mode) {
            sql += `
                AND LOWER(TRIM(mode)) =
                    LOWER(TRIM(?))
            `;

            params.push(mode);
        }

        sql += `
            ORDER BY name ASC
        `;

        const [rows] = await db.query(
            sql,
            params
        );

        res.json(rows);

    } catch (err) {
        console.error(
            "GET ALL COURSES ERROR:",
            err
        );

        res.status(500).json({
            message:
                "Failed to fetch courses",
        });
    }
};

/* =========================================================
   GET SINGLE COURSE
========================================================= */

export const getSingleCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT *
            FROM courses
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error("GET SINGLE COURSE ERROR:", err);

        res.status(500).json({
            message: "Failed to fetch course",
        });
    }
};


/* =========================================================
   UPDATE COURSE
========================================================= */

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            slug,
            description,
            duration,
            mode,
            is_active,
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Course name is required",
            });
        }

        const [result] = await db.query(
            `
            UPDATE courses
            SET
                name = ?,
                slug = ?,
                description = ?,
                duration = ?,
                mode = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                name.trim(),
                slug || null,
                description || null,
                duration || null,
                mode || null,
                is_active === false ? 0 : 1,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.json({
            message: "Course updated successfully",
        });

    } catch (err) {
        console.error("UPDATE COURSE ERROR:", err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Course slug already exists",
            });
        }

        res.status(500).json({
            message: "Failed to update course",
        });
    }
};


/* =========================================================
   DELETE COURSE
========================================================= */

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `
            DELETE FROM courses
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        res.json({
            message: "Course deleted successfully",
        });

    } catch (err) {
        console.error("DELETE COURSE ERROR:", err);

        res.status(500).json({
            message: "Failed to delete course",
        });
    }
};


/* =========================================================
   GET COURSES ASSIGNED TO UNIVERSITY
   PUBLIC
========================================================= */

export const getCoursesByUniversity = async (req, res) => {
    try {
        const { universityId } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                c.id,
                c.name,
                c.slug,
                c.description,
                c.duration,
                c.mode,
                c.is_active

            FROM university_courses uc

            INNER JOIN courses c
                ON c.id = uc.course_id

            WHERE
                uc.university_id = ?
                AND uc.is_active = 1
                AND c.is_active = 1

            ORDER BY c.name ASC
            `,
            [universityId]
        );

        res.json(rows);

    } catch (err) {
        console.error(
            "GET UNIVERSITY COURSES ERROR:",
            err
        );

        res.status(500).json({
            message: "Failed to fetch university courses",
        });
    }
};