import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* ================= GET ALL PROGRAMS ================= */
router.get("/public/programs", async(req, res) => {
    try {
        const { client_id } = req.query;

        let query = `
      SELECT 
        id,
        client_id,
        name,
        slug,
        degree,
        duration,
        mode,
        description
      FROM programs
      WHERE is_active = 1
    `;

        const params = [];

        if (client_id) {
            query += " AND client_id = ?";
            params.push(client_id);
        }

        query += " ORDER BY created_at DESC";

        const [rows] = await pool.execute(query, params);

        res.json(rows);
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/public/program/:slug", async(req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT p.*, c.name AS university_name, c.slug AS university_slug
       FROM programs p
       LEFT JOIN clients c ON p.client_id = c.id
       WHERE p.slug = ? AND p.is_active = 1`, [req.params.slug]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "Program not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
export default router;