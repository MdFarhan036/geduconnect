import pool from "../config/db.js";

/* ---------- ADMIN ---------- */

// GET (admin)
export const getHighlightsAdmin = async(req, res) => {
    const [rows] = await pool.query(
        "SELECT * FROM home_highlights ORDER BY sort_order ASC"
    );
    res.json(rows);
};

// CREATE
export const createHighlight = async(req, res) => {
    const { label, value, is_active = 1 } = req.body;

    if (!label || value === undefined) {
        return res.status(400).json({ message: "Label and value are required" });
    }

    // auto sort_order (last)
    const [
        [{ maxOrder }]
    ] = await pool.query(
        "SELECT COALESCE(MAX(sort_order), 0) AS maxOrder FROM home_highlights"
    );

    await pool.query(
        `INSERT INTO home_highlights (label, value, is_active, sort_order)
     VALUES (?, ?, ?, ?)`, [label, value, is_active, maxOrder + 1]
    );

    res.json({ message: "Highlight created" });
};

// UPDATE
export const updateHighlight = async(req, res) => {
    const { label, value, is_active } = req.body;

    if (!label || value === undefined) {
        return res.status(400).json({ message: "Label and value are required" });
    }

    await pool.query(
        `UPDATE home_highlights
     SET label = ?, value = ?, is_active = ?
     WHERE id = ?`, [label, value, is_active, req.params.id]
    );

    res.json({ message: "Highlight updated" });
};

// DELETE
export const deleteHighlight = async(req, res) => {
    await pool.query(
        "DELETE FROM home_highlights WHERE id = ?", [req.params.id]
    );

    res.json({ message: "Highlight deleted" });
};

/* ---------- PUBLIC ---------- */

export const getHighlightsPublic = async(req, res) => {
    const [rows] = await pool.query(
        `SELECT label, value
     FROM home_highlights
     WHERE is_active = 1
     ORDER BY sort_order ASC`
    );
    res.json(rows);
};