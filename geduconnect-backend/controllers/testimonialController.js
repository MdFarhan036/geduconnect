import pool from "../config/db.js";

/* =========================================================
   HELPERS
========================================================= */

const toInt = (value, defaultValue = 1) => {
    const num = parseInt(value);
    return isNaN(num) ? defaultValue : num;
};

const toBooleanInt = (value, defaultValue = 1) => {
    if (value === "0" || value === 0) return 0;
    if (value === "1" || value === 1) return 1;
    return defaultValue;
};

/* =========================================================
   ADMIN - GET ALL
========================================================= */

export const getTestimonialsAdmin = async(req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM testimonials ORDER BY sort_order ASC"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching testimonials" });
    }
};

/* =========================================================
   ADMIN - ADD
========================================================= */

export const addTestimonial = async(req, res) => {
    try {
        const {
            name,
            message,
            designation,
            organization,
            sort_order
        } = req.body;

        const image_url = req.file ?
            `/uploads/testimonials/${req.file.filename}` :
            null;

        await pool.query(
            `INSERT INTO testimonials
       (name, message, designation, organization, image_url, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`, [
                name || "",
                message || "",
                designation || "",
                organization || "",
                image_url,
                toInt(sort_order, 1)
            ]
        );

        res.json({ message: "Testimonial added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding testimonial" });
    }
};

/* =========================================================
   ADMIN - UPDATE
========================================================= */

export const saveTestimonial = async(req, res) => {
    try {
        const {
            name,
            message,
            designation,
            organization,
            is_active,
            sort_order
        } = req.body;

        let query = `
      UPDATE testimonials SET
        name=?,
        message=?,
        designation=?,
        organization=?,
        is_active=?,
        sort_order=?
    `;

        const values = [
            name || "",
            message || "",
            designation || "",
            organization || "",
            toBooleanInt(is_active, 1),
            toInt(sort_order, 1)
        ];

        if (req.file) {
            query += ", image_url=?";
            values.push(`/uploads/testimonials/${req.file.filename}`);
        }

        query += " WHERE id=?";
        values.push(req.params.id);

        await pool.query(query, values);

        res.json({ message: "Testimonial updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating testimonial" });
    }
};

/* =========================================================
   ADMIN - DELETE
========================================================= */

export const deleteTestimonial = async(req, res) => {
    try {
        await pool.query("DELETE FROM testimonials WHERE id=?", [
            req.params.id
        ]);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting testimonial" });
    }
};

/* =========================================================
   PUBLIC - TESTIMONIALS
========================================================= */

export const getTestimonialsPublic = async(req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, name, message, designation, organization, image_url
       FROM testimonials
       WHERE is_active = 1
       ORDER BY sort_order ASC`
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching testimonials" });
    }
};

/* =========================================================
   ADMIN - PAGE CONTENT
========================================================= */
/* =========================================================
   ADMIN - PAGE CONTENT
========================================================= */

export const getTestimonialsPageAdmin = async(req, res) => {
    try {
        const [
            [row]
        ] = await pool.query(
            "SELECT * FROM testimonials_page_content ORDER BY id ASC LIMIT 1"
        );

        res.json(row || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching page content" });
    }
};

export const updateTestimonialsPage = async(req, res) => {
    try {
        const {
            hero_title,
            hero_subtitle,
            about_title,
            about_description,
            is_active
        } = req.body;

        const safeIsActive = toBooleanInt(is_active, 1);

        /* ===== HANDLE FILES SAFELY ===== */
        const heroFile =
            req.files &&
            req.files.hero_image &&
            req.files.hero_image[0];

        const aboutFile =
            req.files &&
            req.files.about_image &&
            req.files.about_image[0];

        const hero_image_url = heroFile ?
            `/uploads/testimonials-page/${heroFile.filename}` :
            null;

        const about_image_url = aboutFile ?
            `/uploads/testimonials-page/${aboutFile.filename}` :
            null;

        /* ===== CHECK IF ROW EXISTS ===== */
        const [
            [existing]
        ] = await pool.query(
            "SELECT id FROM testimonials_page_content ORDER BY id ASC LIMIT 1"
        );

        if (!existing) {
            /* ===== INSERT ===== */
            await pool.query(
                `INSERT INTO testimonials_page_content
        (hero_title, hero_subtitle, hero_image_url,
         about_title, about_description, about_image_url, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                    hero_title || "",
                    hero_subtitle || "",
                    hero_image_url,
                    about_title || "",
                    about_description || "",
                    about_image_url,
                    safeIsActive
                ]
            );
        } else {
            /* ===== UPDATE ===== */
            let query = `
        UPDATE testimonials_page_content SET
          hero_title=?,
          hero_subtitle=?,
          about_title=?,
          about_description=?,
          is_active=?
      `;

            const values = [
                hero_title || "",
                hero_subtitle || "",
                about_title || "",
                about_description || "",
                safeIsActive
            ];

            if (hero_image_url) {
                query += ", hero_image_url=?";
                values.push(hero_image_url);
            }

            if (about_image_url) {
                query += ", about_image_url=?";
                values.push(about_image_url);
            }

            query += " WHERE id=?";
            values.push(existing.id);

            await pool.query(query, values);
        }

        res.json({ message: "Testimonials page updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating page" });
    }
};

/* =========================================================
   PUBLIC - PAGE CONTENT
========================================================= */

export const getTestimonialsPagePublic = async(req, res) => {
    try {
        const [
            [row]
        ] = await pool.query(
            "SELECT * FROM testimonials_page_content WHERE is_active = 1 ORDER BY id ASC LIMIT 1"
        );

        res.json(row || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching page content" });
    }
};