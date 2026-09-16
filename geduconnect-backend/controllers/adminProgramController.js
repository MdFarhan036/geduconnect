import db from "../config/db.js";

/* =========================================================
   ADD PROGRAM
========================================================= */

export const addProgram = async (req, res) => {
    try {
        const {
            name,
            slug,
            degree,
            duration,
            mode,
            description,
            is_active,
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Program name is required",
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO programs
            (
                name,
                slug,
                degree,
                duration,
                mode,
                description,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                name.trim(),
                slug || null,
                degree || null,
                duration || null,
                mode || null,
                description || null,
                is_active ? 1 : 0,
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
                message: "Slug already exists",
            });
        }

        res.status(500).json({
            message: "Failed to add program",
        });
    }
};


/* =========================================================
   GET ALL PROGRAMS
========================================================= */

export const getAllPrograms = async (req, res) => {
    try {
        const [rows] = await db.query(
            `
            SELECT *
            FROM programs
            ORDER BY created_at DESC
            `
        );

        res.json(rows);

    } catch (err) {
        console.error("GET ALL PROGRAMS ERROR:", err);

        res.status(500).json({
            message: "Failed to fetch programs",
        });
    }
};


/* =========================================================
   GET SINGLE PROGRAM
========================================================= */

export const getSingleProgram = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT *
            FROM programs
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Program not found",
            });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error("GET SINGLE PROGRAM ERROR:", err);

        res.status(500).json({
            message: "Failed to fetch program",
        });
    }
};


/* =========================================================
   UPDATE PROGRAM
========================================================= */

export const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            slug,
            degree,
            duration,
            mode,
            description,
            is_active,
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Program name is required",
            });
        }

        const [result] = await db.query(
            `
            UPDATE programs
            SET
                name = ?,
                slug = ?,
                degree = ?,
                duration = ?,
                mode = ?,
                description = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                name.trim(),
                slug || null,
                degree || null,
                duration || null,
                mode || null,
                description || null,
                is_active ? 1 : 0,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Program not found",
            });
        }

        res.json({
            message: "Program updated successfully",
        });

    } catch (err) {
        console.error("UPDATE PROGRAM ERROR:", err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Slug already exists",
            });
        }

        res.status(500).json({
            message: "Failed to update program",
        });
    }
};


/* =========================================================
   DELETE PROGRAM
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
        console.error("DELETE PROGRAM ERROR:", err);

        res.status(500).json({
            message: "Failed to delete program",
        });
    }
};