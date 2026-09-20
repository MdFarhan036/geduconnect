import db from "../config/db.js";


/* =========================================================
   ADD COMMON PROGRAM
   POST /api/admin/courses/:courseId/programs
========================================================= */

export const addProgram = async (req, res) => {
    try {
        const { courseId } = req.params;

        const {
            name,
            slug,
            degree,
            duration,
            mode,
            description,
            eligibility,
            fees,
            is_active,
        } = req.body;

        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required",
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Program name is required",
            });
        }

        /* ================= VERIFY COMMON COURSE ================= */

        const [courseRows] = await db.query(
            `
            SELECT id, name, slug
            FROM courses
            WHERE id = ?
            LIMIT 1
            `,
            [courseId]
        );

        if (courseRows.length === 0) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        /* ================= INSERT ================= */

        const [result] = await db.query(
            `
            INSERT INTO programs
            (
                course_id,
                name,
                slug,
                degree,
                duration,
                mode,
                description,
                eligibility,
                fees,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                courseId,
                name.trim(),
                slug || null,
                degree || null,
                duration || null,
                mode || null,
                description || null,
                eligibility || null,
                fees || null,
                is_active === false ? 0 : 1,
            ]
        );

        res.status(201).json({
            message: "Program added successfully",
            program_id: result.insertId,
        });

    } catch (err) {
        console.error("ADD PROGRAM ERROR:", err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Program slug already exists",
            });
        }

        res.status(500).json({
            message: "Failed to add program",
        });
    }
};


/* =========================================================
   GET ALL COMMON PROGRAMS
   GET /api/admin/programs
========================================================= */

export const getAllPrograms = async (req, res) => {
    try {
        const { mode, course_id } = req.query;

        let sql = `
            SELECT
                p.id,
                p.course_id,
                p.name,
                p.slug,
                p.description,
                p.duration,
                p.eligibility,
                p.fees,
                p.degree,
                p.mode,
                p.is_active,
                p.created_at,
                p.updated_at,

                c.name AS course_name,
                c.slug AS course_slug

            FROM programs p

            INNER JOIN courses c
                ON c.id = p.course_id

            WHERE p.is_active = 1
              AND c.is_active = 1
        `;

        const params = [];

        /* ================= MODE FILTER ================= */

        if (mode) {
            sql += `
                AND LOWER(TRIM(p.mode)) =
                    LOWER(TRIM(?))
            `;

            params.push(mode);
        }

        /* ================= COURSE FILTER ================= */

        if (course_id) {
            sql += `
                AND p.course_id = ?
            `;

            params.push(course_id);
        }

        sql += `
            ORDER BY
                c.name ASC,
                p.name ASC
        `;

        const [rows] = await db.query(
            sql,
            params
        );

        res.json(rows);

    } catch (err) {
        console.error(
            "GET ALL PROGRAMS ERROR:",
            err
        );

        res.status(500).json({
            message:
                "Failed to fetch programs",
        });
    }
};

/* =========================================================
   GET PROGRAMS BY COMMON COURSE
   GET /api/admin/courses/:courseId/programs
========================================================= */

export const getProgramsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required",
            });
        }

        const [rows] = await db.query(
            `
            SELECT
                p.id,
                p.course_id,
                p.name,
                p.slug,
                p.description,
                p.duration,
                p.eligibility,
                p.fees,
                p.degree,
                p.mode,
                p.is_active,
                p.created_at,
                p.updated_at,

                c.name AS course_name,
                c.slug AS course_slug

            FROM programs p

            INNER JOIN courses c
                ON c.id = p.course_id

            WHERE p.course_id = ?

            ORDER BY p.name ASC
            `,
            [courseId]
        );

        res.json(rows);

    } catch (err) {
        console.error(
            "GET PROGRAMS BY COURSE ERROR:",
            err
        );

        res.status(500).json({
            message: "Failed to fetch programs",
        });
    }
};


/* =========================================================
   GET SINGLE COMMON PROGRAM
   GET /api/admin/programs/:id
========================================================= */
export const getSingleProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        p.*,
        c.name AS course_name,
        c.slug AS course_slug
      FROM programs p
      LEFT JOIN courses c
        ON c.id = p.course_id
      WHERE p.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(
      "GET SINGLE PROGRAM ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch program",
    });
  }
};


/* =========================================================
   UPDATE COMMON PROGRAM
   PUT /api/admin/programs/:id
========================================================= */
export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      course_id,
      name,
      degree,
      duration,
      mode,
      description,
      eligibility,
      fees,
      is_active,
    } = req.body;

    /* ============================================
       VALIDATION
    ============================================ */

    if (!course_id) {
      return res.status(400).json({
        message: "Please select a course",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Program name is required",
      });
    }

    /* ============================================
       CHECK PROGRAM
    ============================================ */

    const [programRows] = await db.query(
      `
      SELECT id
      FROM programs
      WHERE id = ?
      `,
      [id]
    );

    if (programRows.length === 0) {
      return res.status(404).json({
        message: "Program not found",
      });
    }

    /* ============================================
       CHECK COURSE
    ============================================ */

    const [courseRows] = await db.query(
      `
      SELECT id
      FROM courses
      WHERE id = ?
        AND is_active = 1
      `,
      [course_id]
    );

    if (courseRows.length === 0) {
      return res.status(400).json({
        message: "Selected course not found or inactive",
      });
    }

    /* ============================================
       UPDATE PROGRAM
    ============================================ */

    await db.query(
      `
      UPDATE programs
      SET
        course_id = ?,
        name = ?,
        degree = ?,
        duration = ?,
        mode = ?,
        description = ?,
        eligibility = ?,
        fees = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        course_id,
        name.trim(),
        degree || null,
        duration || null,
        mode || null,
        description || null,
        eligibility || null,
        fees || null,
        is_active ? 1 : 0,
        id,
      ]
    );

    res.json({
      message: "Program updated successfully",
    });

  } catch (error) {
    console.error(
      "UPDATE PROGRAM ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to update program",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE COMMON PROGRAM
========================================================= */

export const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            `
            DELETE FROM programs
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Program not found",
            });
        }

        res.json({
            message: "Program deleted successfully",
        });

    } catch (err) {
        console.error(
            "DELETE PROGRAM ERROR:",
            err
        );

        res.status(500).json({
            message: "Failed to delete program",
        });
    }
};


/* =========================================================
   ASSIGN PROGRAMS TO UNIVERSITY
   PUT /api/admin/universities/:universityId/programs
========================================================= */

export const syncUniversityPrograms = async (req, res) => {
    try {
        const { universityId } = req.params;
        const { program_ids } = req.body;

        if (!universityId) {
            return res.status(400).json({
                message: "University ID is required",
            });
        }

        if (!Array.isArray(program_ids)) {
            return res.status(400).json({
                message: "program_ids must be an array",
            });
        }

        /* ================= VERIFY UNIVERSITY ================= */

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

        /* ================= REMOVE OLD ================= */

        await db.query(
            `
            DELETE FROM university_programs
            WHERE university_id = ?
            `,
            [universityId]
        );

        /* ================= ADD NEW ================= */

        if (program_ids.length > 0) {

            const values = program_ids.map((programId) => [
                universityId,
                programId,
                1,
            ]);

            await db.query(
                `
                INSERT INTO university_programs
                (
                    university_id,
                    program_id,
                    is_active
                )
                VALUES ?
                `,
                [values]
            );
        }

        res.json({
            message: "University programs updated successfully",
        });

    } catch (err) {
        console.error(
            "SYNC UNIVERSITY PROGRAMS ERROR:",
            err
        );

        res.status(500).json({
            message: "Failed to update university programs",
        });
    }
};
export const getUniversityPrograms = async (req, res) => {
    try {
        const { universityId } = req.params;

        if (!universityId) {
            return res.status(400).json({
                message: "University ID is required",
            });
        }

        /* ================= VERIFY UNIVERSITY ================= */

        const [universityRows] = await db.query(
            `
            SELECT
                id,
                name
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

        /* ================= GET PROGRAMS ================= */

        const [rows] = await db.query(
            `
            SELECT
                p.id,
                p.course_id,
                p.name,
                p.slug,
                p.description,
                p.duration,
                p.eligibility,
                p.fees,
                p.degree,
                p.mode,
                p.is_active,

                c.name AS course_name,
                c.slug AS course_slug,

                CASE
                    WHEN up.id IS NOT NULL THEN 1
                    ELSE 0
                END AS assigned

            FROM programs p

            INNER JOIN courses c
                ON c.id = p.course_id

            LEFT JOIN university_programs up
                ON up.program_id = p.id
                AND up.university_id = ?
                AND up.is_active = 1

            WHERE
                p.is_active = 1
                AND c.is_active = 1

            ORDER BY
                c.name ASC,
                p.name ASC
            `,
            [universityId]
        );

        res.json({
            university: universityRows[0],
            programs: rows,
        });

    } catch (err) {
        console.error(
            "GET UNIVERSITY PROGRAMS ADMIN ERROR:",
            err
        );

        res.status(500).json({
            message: "Failed to fetch university programs",
        });
    }
};

/* =========================================================
   GET PROGRAMS ASSIGNED TO UNIVERSITY
   PUBLIC
========================================================= */

export const getProgramsByUniversity = async (req, res) => {
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
                p.id,
                p.course_id,
                p.name,
                p.slug,
                p.description,
                p.duration,
                p.eligibility,
                p.fees,
                p.degree,
                p.mode,

                c.name AS course_name,
                c.slug AS course_slug

            FROM university_programs up

            INNER JOIN programs p
                ON p.id = up.program_id

            INNER JOIN courses c
                ON c.id = p.course_id

            WHERE
                up.university_id = ?
                AND up.is_active = 1
                AND p.is_active = 1
                AND c.is_active = 1

            ORDER BY
                c.name ASC,
                p.name ASC
            `,
            [universityId]
        );

        res.json(rows);

    } catch (err) {
        console.error(
            "GET PROGRAMS BY UNIVERSITY ERROR:",
            err
        );

        res.status(500).json({
            message: "Failed to fetch university programs",
        });
    }
};