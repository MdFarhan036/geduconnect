import pool from "../config/db.js";

/* =========================================================
   HERO - ADMIN
========================================================= */
export const getHeroAdmin = async(req, res) => {
    try {
        const [
            [hero]
        ] = await pool.query(
            "SELECT * FROM home_hero ORDER BY id ASC LIMIT 1"
        );

        if (!hero) {
            return res.json({ slides: [] });
        }

        const [images] = await pool.query(
            "SELECT * FROM home_hero_images WHERE hero_id = ? ORDER BY sort_order ASC", [hero.id]
        );

        // Map DB data to frontend format
        const slides = images.map(img => ({
            id: img.id,
            title: img.title,
            subtitle: img.subtitle,
            primary_cta_text: img.primary_cta_text,
            primary_cta_link: img.primary_cta_link,
            secondary_cta_text: img.secondary_cta_text,
            secondary_cta_link: img.secondary_cta_link,
            preview: img.image_url // important for image display
        }));

        res.json({ slides });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching hero" });
    }
};


export const updateHero = async(req, res) => {
    try {
        const body = req.body || {};

        // Get existing hero
        const [
            [existingHero]
        ] = await pool.query(
            "SELECT id FROM home_hero ORDER BY id ASC LIMIT 1"
        );

        let heroId;

        if (!existingHero) {
            const [insertResult] = await pool.query(
                `INSERT INTO home_hero (title) VALUES ('')`
            );
            heroId = insertResult.insertId;
        } else {
            heroId = existingHero.id;
        }

        // Delete old slides
        await pool.query(
            "DELETE FROM home_hero_images WHERE hero_id = ?", [heroId]
        );

        const files = req.files || [];
        const slideIndexes = Object.keys(body)
            .filter(key => key.startsWith("title_"))
            .map(key => key.split("_")[1]);

        if (slideIndexes.length === 0) {
            return res.json({ message: "No slides found" });
        }

        const insertValues = slideIndexes.map((index, i) => {
            const file = files[i];

            return [
                heroId,
                file ? `/uploads/hero/${file.filename}` : null,
                i + 1, // sort_order
                body[`title_${index}`] || "", // title
                "rgba(0,0,0,0.6)", // banner_color
                body[`subtitle_${index}`] || "",
                body[`primary_cta_text_${index}`] || "",
                body[`primary_cta_link_${index}`] || "",
                body[`secondary_cta_text_${index}`] || "",
                body[`secondary_cta_link_${index}`] || ""
            ];
        });

        await pool.query(
            `INSERT INTO home_hero_images
   (hero_id, image_url, sort_order, title,
    banner_color, subtitle,
    primary_cta_text, primary_cta_link,
    secondary_cta_text, secondary_cta_link)
   VALUES ?`, [insertValues]
        );

        res.json({ message: "Hero updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating Hero" });
    }
};
/* =========================================================
   PUBLIC
========================================================= */
export const getHomePublic = async(req, res) => {
    try {
        // 🔹 Get Hero
        const [
            [hero]
        ] = await pool.query(
            "SELECT * FROM home_hero ORDER BY id ASC LIMIT 1"
        );

        let heroData = { images: [] };

        if (hero) {
            const [images] = await pool.query(
                "SELECT * FROM home_hero_images WHERE hero_id = ? ORDER BY sort_order ASC", [hero.id]
            );

            heroData = {
                ...hero,
                images
            };
        }

        // 🔹 Get About
        const [
            [about]
        ] = await pool.query(
            "SELECT * FROM home_about ORDER BY id ASC LIMIT 1"
        );

        res.json({
            hero: heroData,
            about: about || {}
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching public home data" });
    }
};

/* =========================================================
   ABOUT - ADMIN
========================================================= */
/* =========================================================
   ABOUT - ADMIN
========================================================= */

export const getAboutAdmin = async(req, res) => {
    try {
        const [
            [row]
        ] = await pool.query(
            "SELECT * FROM home_about ORDER BY id ASC LIMIT 1"
        );

        res.json(row || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching About" });
    }
};

export const updateAbout = async(req, res) => {
    try {
        const body = req.body || {};

        const heading = body.heading || "";
        const subheading = body.subheading || "";
        const paragraph1 = body.paragraph1 || "";
        const founder_message = body.founder_message || "";
        const founder_name = body.founder_name || "";
        const mission = body.mission || "";
        const vision = body.vision || "";
        const is_active =
            body.is_active !== undefined ? Number(body.is_active) : 1;

        const [
            [existing]
        ] = await pool.query(
            "SELECT id FROM home_about ORDER BY id ASC LIMIT 1"
        );

        let aboutId;

        /* ================= INSERT ================= */
        if (!existing) {
            const [insertResult] = await pool.query(
                `INSERT INTO home_about
        (heading, subheading, paragraph1,
         founder_message, founder_name,
         mission, vision,
         is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                    heading,
                    subheading,
                    paragraph1,
                    founder_message,
                    founder_name,
                    mission,
                    vision,
                    is_active,
                ]
            );

            aboutId = insertResult.insertId;
        } else {
            aboutId = existing.id;

            let updateFields = `
        heading = ?,
        subheading = ?,
        paragraph1 = ?,
        founder_message = ?,
        founder_name = ?,
        mission = ?,
        vision = ?,
        is_active = ?
      `;

            let values = [
                heading,
                subheading,
                paragraph1,
                founder_message,
                founder_name,
                mission,
                vision,
                is_active,
            ];

            if (req.files && req.files.image && req.files.image[0]) {
                updateFields += `, image_url = ?`;
                values.push(`/uploads/about/${req.files.image[0].filename}`);
            }

            if (req.files && req.files.founder_image && req.files.founder_image[0]) {
                updateFields += `, founder_image_url = ?`;
                values.push(`/uploads/about/${req.files.founder_image[0].filename}`);
            }
            if (req.files && req.files.home_image && req.files.home_image[0]) {
                updateFields += `, home_image_url = ?`;
                values.push(`/uploads/about/${req.files.home_image[0].filename}`);
            }

            values.push(aboutId);

            await pool.query(
                `UPDATE home_about SET ${updateFields} WHERE id = ?`,
                values
            );
        }

        res.json({ message: "About updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating About" });
    }
};