import db from "../config/db.js";


/* =========================================================
   GET ALL COMMON COURSES
   ADMIN

   GET /api/admin/university-courses/:universityId
========================================================= */

export const getUniversityCourses = async (req, res) => {
    try {
        const { universityId } = req.params;

        if (!universityId) {
            return res.status(400).json({
                message: "University ID is required",
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                c.id,
                c.name,
                c.slug,
                c.description,
                c.duration,
                c.mode,
                c.is_active,

                CASE
                    WHEN uc.id IS NOT NULL
                    THEN 1
                    ELSE 0
                END AS assigned

            FROM courses c

            LEFT JOIN university_courses uc
                ON uc.course_id = c.id
                AND uc.university_id = ?

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


/* =========================================================
   ASSIGN COURSES TO UNIVERSITY
   ADMIN

   PUT /api/admin/universities/:universityId/courses
========================================================= */

export const syncUniversityCourses = async (req, res) => {
    try {
        const { universityId } = req.params;
        const { course_ids } = req.body;

        if (!universityId) {
            return res.status(400).json({
                message: "University ID is required",
            });
        }

        if (!Array.isArray(course_ids)) {
            return res.status(400).json({
                message: "course_ids must be an array",
            });
        }


        /* =====================================================
           VERIFY UNIVERSITY
        ===================================================== */

        const [universityRows] = await db.query(
            `
            SELECT id
            FROM universities
            WHERE id = ?
            LIMIT 1
            `,
            [universityId]
        );

        if (universityRows.length === 0) {
            return res.status(404).json({
                message: "University not found",
            });
        }


        /* =====================================================
           VERIFY COURSES
        ===================================================== */

        if (course_ids.length > 0) {

            const placeholders = course_ids
                .map(() => "?")
                .join(",");

            const [courseRows] = await db.query(
                `
                SELECT id
                FROM courses
                WHERE id IN (${placeholders})
                `,
                course_ids
            );

            const validCourseIds = courseRows.map(
                (course) => Number(course.id)
            );

            const invalidCourseIds = course_ids.filter(
                (courseId) =>
                    !validCourseIds.includes(
                        Number(courseId)
                    )
            );

            if (invalidCourseIds.length > 0) {
                return res.status(400).json({
                    message: "One or more courses are invalid",
                    invalid_course_ids: invalidCourseIds,
                });
            }
        }


        /* =====================================================
           REMOVE OLD ASSIGNMENTS
        ===================================================== */

        await db.query(
            `
            DELETE FROM university_courses
            WHERE university_id = ?
            `,
            [universityId]
        );


        /* =====================================================
           INSERT NEW ASSIGNMENTS
        ===================================================== */

        if (course_ids.length > 0) {

            const values = course_ids.map(
                (courseId) => [
                    universityId,
                    courseId,
                    1,
                ]
            );

            await db.query(
                `
                INSERT INTO university_courses
                (
                    university_id,
                    course_id,
                    is_active
                )
                VALUES ?
                `,
                [values]
            );
        }


        res.json({
            message: "University courses updated successfully",
        });

    } catch (err) {

        console.error(
            "SYNC UNIVERSITY COURSES ERROR:",
            err
        );

        res.status(500).json({
            message: "Failed to update university courses",
        });
    }
};


/* =========================================================
   PUBLIC
   GET COURSES ASSIGNED TO UNIVERSITY

   GET /api/public/universities/:universityId/courses
========================================================= */

export const getPublicUniversityCourses = async (
    req,
    res
) => {
    try {
        const { universityId } = req.params;

        if (!universityId) {
            return res.status(400).json({
                message: "University ID is required",
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                c.id,
                c.name,
                c.slug,
                c.description,
                c.duration,
                c.mode

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
            "GET PUBLIC UNIVERSITY COURSES ERROR:",
            err
        );

        res.status(500).json({
            message: "Failed to fetch university courses",
        });
    }
};