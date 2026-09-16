import db from "../db.js";
import slugify from "slugify";

/* =============================
   CREATE UNIVERSITY
============================= */
export const createUniversity = async(req, res) => {
    try {
        const {
            name,
            location,
            description,
            short_description,
            established,
            naac_grade,
            type
        } = req.body;

        const slug = slugify(name, { lower: true });

        const [result] = await db.query(
            `INSERT INTO universities 
       (name, slug, location, description, short_description, established, naac_grade, type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [name, slug, location, description, short_description, established, naac_grade, type]
        );

        res.json({ message: "University created", id: result.insertId });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* =============================
   GET UNIVERSITY BY SLUG
============================= */
export const getUniversityBySlug = async(req, res) => {
    try {
        const { slug } = req.params;

        const [universityRows] = await db.query(
            "SELECT * FROM universities WHERE slug = ?", [slug]
        );

        if (!universityRows.length)
            return res.status(404).json({ message: "Not found" });

        const university = universityRows[0];

        const [programs] = await db.query(
            "SELECT * FROM programs WHERE university_id = ?", [university.id]
        );

        const [placements] = await db.query(
            "SELECT * FROM placements WHERE university_id = ?", [university.id]
        );

        res.json({
            ...university,
            programs,
            placements: placements[0] || null
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};