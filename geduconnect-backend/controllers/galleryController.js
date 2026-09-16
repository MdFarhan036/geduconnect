import pool from "../config/db.js";

/* ===================== ADMIN ===================== */

/* GET ALL */
export const getGalleryAdmin = async(req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM gallery ORDER BY sort_order ASC"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching gallery" });
    }
};

/* CREATE */
export const createGallery = async(req, res) => {
    try {
        const body = req.body || {};

        const image_url = req.file ?
            `/uploads/gallery/${req.file.filename}` :
            null;

        await pool.query(
            `INSERT INTO gallery
      (title, caption, location, date, image_url, category, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                body.title || "",
                body.caption || "",
                body.location || "",
                body.date || null,
                image_url,
                body.category || "General",
                body.sort_order || 1,
                body.is_active !== undefined ? body.is_active : 1,
            ]
        );

        res.json({ message: "Gallery image added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating gallery item" });
    }
};

/* UPDATE */
export const updateGallery = async(req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};

        let imageQuery = "";
        let values = [
            body.title || "",
            body.caption || "",
            body.location || "",
            body.date || null,
            body.category || "General",
            body.sort_order || 1,
            body.is_active !== undefined ? body.is_active : 1,
        ];

        if (req.file) {
            imageQuery = ", image_url = ?";
            values.push(`/uploads/gallery/${req.file.filename}`);
        }

        values.push(id);

        await pool.query(
            `UPDATE gallery SET
        title = ?,
        caption = ?,
        location = ?,
        date = ?,
        category = ?,
        sort_order = ?,
        is_active = ?
        ${imageQuery}
      WHERE id = ?`,
            values
        );

        res.json({ message: "Gallery updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating gallery" });
    }
};

/* DELETE */
export const deleteGallery = async(req, res) => {
    try {
        await pool.query("DELETE FROM gallery WHERE id = ?", [req.params.id]);
        res.json({ message: "Gallery deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting gallery" });
    }
};

/* ===================== PUBLIC ===================== */

export const getGalleryPublic = async(req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, title, caption, location, date, image_url, category
       FROM gallery
       WHERE is_active = 1
       ORDER BY sort_order ASC`
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching gallery" });
    }
};