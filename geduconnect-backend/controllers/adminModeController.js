import db from "../config/db.js";

/* =========================================================
   CREATE MODE
========================================================= */
export const addMode = async (req, res) => {
    try {
        const {
            name,
            slug,
            description = "",
            is_active = 1,
            sort_order = 0
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Mode name is required"
            });
        }

        const finalSlug =
            slug?.trim() ||
            name
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

        // Check duplicate name
        const [existingName] = await db.query(
            `SELECT id FROM modes WHERE LOWER(name) = LOWER(?) LIMIT 1`,
            [name.trim()]
        );

        if (existingName.length > 0) {
            return res.status(409).json({
                message: "Mode with this name already exists"
            });
        }

        // Check duplicate slug
        const [existingSlug] = await db.query(
            `SELECT id FROM modes WHERE slug = ? LIMIT 1`,
            [finalSlug]
        );

        if (existingSlug.length > 0) {
            return res.status(409).json({
                message: "Mode with this slug already exists"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO modes
            (
                name,
                slug,
                description,
                is_active,
                sort_order
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                name.trim(),
                finalSlug,
                description,
                is_active ? 1 : 0,
                Number(sort_order) || 0
            ]
        );

        const [rows] = await db.query(
            `SELECT * FROM modes WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            message: "Mode created successfully",
            mode: rows[0]
        });

    } catch (error) {
        console.error("ADD MODE ERROR:", error);

        res.status(500).json({
            message: "Failed to create mode",
            error: error.message
        });
    }
};


/* =========================================================
   GET ALL MODES
========================================================= */
export const getAllModes = async (req, res) => {
    try {
        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                slug,
                description,
                is_active,
                sort_order,
                created_at,
                updated_at
            FROM modes
            ORDER BY sort_order ASC, name ASC
            `
        );

        res.json(rows);

    } catch (error) {
        console.error("GET MODES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch modes",
            error: error.message
        });
    }
};


/* =========================================================
   GET SINGLE MODE
========================================================= */
export const getSingleMode = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT * FROM modes WHERE id = ? LIMIT 1`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Mode not found"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error("GET SINGLE MODE ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch mode",
            error: error.message
        });
    }
};


/* =========================================================
   UPDATE MODE
========================================================= */
export const updateMode = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            slug,
            description = "",
            is_active = 1,
            sort_order = 0
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Mode name is required"
            });
        }

        const finalSlug =
            slug?.trim() ||
            name
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

        // Check mode exists
        const [existing] = await db.query(
            `SELECT id FROM modes WHERE id = ? LIMIT 1`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                message: "Mode not found"
            });
        }

        // Duplicate name
        const [duplicateName] = await db.query(
            `
            SELECT id
            FROM modes
            WHERE LOWER(name) = LOWER(?)
            AND id != ?
            LIMIT 1
            `,
            [name.trim(), id]
        );

        if (duplicateName.length > 0) {
            return res.status(409).json({
                message: "Another mode with this name already exists"
            });
        }

        // Duplicate slug
        const [duplicateSlug] = await db.query(
            `
            SELECT id
            FROM modes
            WHERE slug = ?
            AND id != ?
            LIMIT 1
            `,
            [finalSlug, id]
        );

        if (duplicateSlug.length > 0) {
            return res.status(409).json({
                message: "Another mode with this slug already exists"
            });
        }

        await db.query(
            `
            UPDATE modes
            SET
                name = ?,
                slug = ?,
                description = ?,
                is_active = ?,
                sort_order = ?
            WHERE id = ?
            `,
            [
                name.trim(),
                finalSlug,
                description,
                is_active ? 1 : 0,
                Number(sort_order) || 0,
                id
            ]
        );

        const [rows] = await db.query(
            `SELECT * FROM modes WHERE id = ?`,
            [id]
        );

        res.json({
            message: "Mode updated successfully",
            mode: rows[0]
        });

    } catch (error) {
        console.error("UPDATE MODE ERROR:", error);

        res.status(500).json({
            message: "Failed to update mode",
            error: error.message
        });
    }
};


/* =========================================================
   DELETE MODE
========================================================= */
export const deleteMode = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            `SELECT id, name FROM modes WHERE id = ? LIMIT 1`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                message: "Mode not found"
            });
        }

        await db.query(
            `DELETE FROM modes WHERE id = ?`,
            [id]
        );

        res.json({
            message: "Mode deleted successfully"
        });

    } catch (error) {
        console.error("DELETE MODE ERROR:", error);

        res.status(500).json({
            message: "Failed to delete mode",
            error: error.message
        });
    }
};