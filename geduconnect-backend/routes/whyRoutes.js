import express from "express";
import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ================= UPLOAD CONFIG ================= */

const uploadDir = "uploads/why";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/* ============================================================
   ======================= PUBLIC ==============================
   ============================================================ */

router.get("/public/why-choose-us", async(req, res) => {
    try {
        const [section] = await db.query(
            "SELECT * FROM why_choose_us WHERE is_active = 1 LIMIT 1"
        );

        if (!section.length) return res.json(null);

        const [points] = await db.query(
            "SELECT * FROM why_choose_us_points WHERE section_id = ? ORDER BY sort_order ASC", [section[0].id]
        );

        res.json({
            ...section[0],
            points
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ============================================================
   ======================== ADMIN ==============================
   ============================================================ */

/* ===== GET SINGLE SECTION ===== */
router.get("/admin/why-choose-us", async(req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM why_choose_us LIMIT 1"
    );

    if (!rows.length) {
        return res.json(null);
    }

    const [points] = await db.query(
        "SELECT * FROM why_choose_us_points WHERE section_id = ? ORDER BY sort_order ASC", [rows[0].id]
    );

    res.json({
        ...rows[0],
        points
    });
});

/* ===== CREATE IF NOT EXISTS ===== */
router.post("/admin/why-choose-us", async(req, res) => {
    const {
        heading,
        description,
        offerings_title,
        cta_text,
        cta_link
    } = req.body;

    await db.query(
        `INSERT INTO why_choose_us 
    (heading, description, offerings_title, cta_text, cta_link, is_active)
    VALUES (?, ?, ?, ?, ?, 1)`, [heading, description, offerings_title, cta_text, cta_link]
    );

    res.json({ success: true });
});

/* ===== UPDATE SECTION ===== */
router.put(
    "/admin/why-choose-us",
    upload.single("image"),
    async(req, res) => {
        try {
            const {
                heading,
                description,
                offerings_title,
                cta_text,
                cta_link,
                is_active
            } = req.body;

            const [rows] = await db.query(
                "SELECT * FROM why_choose_us LIMIT 1"
            );

            if (!rows.length) {
                return res.status(404).json({ error: "Section not found" });
            }

            let imagePath = rows[0].image_url;

            if (req.file) {
                imagePath = `/uploads/why/${req.file.filename}`;
            }

            await db.query(
                `UPDATE why_choose_us 
         SET heading = ?, 
             description = ?, 
             offerings_title = ?, 
             cta_text = ?, 
             cta_link = ?, 
             image_url = ?, 
             is_active = ?
         WHERE id = ?`, [
                    heading,
                    description,
                    offerings_title,
                    cta_text,
                    cta_link,
                    imagePath,
                    is_active,
                    rows[0].id
                ]
            );

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

/* ===== DELETE SECTION ===== */
router.delete("/admin/why-choose-us/:id", async(req, res) => {
    await db.query(
        "DELETE FROM why_choose_us WHERE id = ?", [req.params.id]
    );

    res.json({ success: true });
});
router.post(
    "/admin/why-choose-us/points",
    upload.single("image"),
    async(req, res) => {
        const { section_id, point, sort_order, icon_class } = req.body;

        let imagePath = null;

        if (req.file) {
            imagePath = `/uploads/why/${req.file.filename}`;
        }

        await db.query(
            `INSERT INTO why_choose_us_points 
       (section_id, point, sort_order, icon_class, image_url)
       VALUES (?, ?, ?, ?, ?)`, [section_id, point, sort_order || 1, icon_class || null, imagePath]
        );

        res.json({ success: true });
    }
);

router.put("/admin/why-choose-us/points/:id", async(req, res) => {
    const { point, sort_order } = req.body;

    await db.query(
        `UPDATE why_choose_us_points 
     SET point = ?, sort_order = ?
     WHERE id = ?`, [point, sort_order || 1, req.params.id]
    );

    res.json({ success: true });
});
router.delete("/admin/why-choose-us/points/:id", async(req, res) => {
    await db.query(
        "DELETE FROM why_choose_us_points WHERE id = ?", [req.params.id]
    );

    res.json({ success: true });
});

export default router;