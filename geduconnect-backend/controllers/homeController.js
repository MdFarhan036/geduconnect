import pool from "../config/db.js";

/* =========================================================
   HERO - ADMIN
========================================================= */

export const getHeroAdmin = async (req, res) => {
    try {
        const [
            [hero]
        ] = await pool.query(
            "SELECT * FROM home_hero ORDER BY id ASC LIMIT 1"
        );

        if (!hero) {
            return res.json({
                slides: []
            });
        }

        const [images] = await pool.query(
            `
            SELECT
                id,
                hero_id,
                image_url,
                sort_order,
                title,
                banner_color,
                subtitle,
                description,
                primary_cta_text,
                primary_cta_link,
                secondary_cta_text,
                secondary_cta_link
            FROM home_hero_images
            WHERE hero_id = ?
            ORDER BY sort_order ASC
            `,
            [hero.id]
        );

        /*
         * Map database data to Admin frontend format
         */

        const slides = images.map((img) => ({
            id: img.id,

            title: img.title || "",

            subtitle: img.subtitle || "",

            description: img.description || "",

            primary_cta_text:
                img.primary_cta_text || "",

            primary_cta_link:
                img.primary_cta_link || "",

            secondary_cta_text:
                img.secondary_cta_text || "",

            secondary_cta_link:
                img.secondary_cta_link || "",

            /*
             * Existing image
             */
            preview: img.image_url || "",

            image_url: img.image_url || "",

            sort_order:
                img.sort_order || 0,

            banner_color:
                img.banner_color ||
                "rgba(0,0,0,0.6)"
        }));

        res.json({
            slides
        });

    } catch (err) {
        console.error(
            "getHeroAdmin error:",
            err
        );

        res.status(500).json({
            message: "Error fetching hero"
        });
    }
};


/* =========================================================
   HERO - UPDATE
========================================================= */
export const updateHero = async (req, res) => {
    try {
        const body = req.body || {};

        /* =====================================================
           GET / CREATE HERO
        ===================================================== */

        const [[existingHero]] = await pool.query(
            "SELECT id FROM home_hero ORDER BY id ASC LIMIT 1"
        );

        let heroId;

        if (!existingHero) {
            const [insertResult] = await pool.query(
                `
                INSERT INTO home_hero
                (title, subtitle, description)
                VALUES (?, ?, ?)
                `,
                ["", "", ""]
            );

            heroId = insertResult.insertId;
        } else {
            heroId = existingHero.id;
        }

        /* =====================================================
           GET CURRENT SLIDES BEFORE DELETE
        ===================================================== */

        const [existingSlides] = await pool.query(
            `
            SELECT
                id,
                image_url,
                sort_order
            FROM home_hero_images
            WHERE hero_id = ?
            ORDER BY sort_order ASC
            `,
            [heroId]
        );

        /*
         * Preserve existing images by BOTH:
         * 1. database slide id
         * 2. previous sort/index position
         */

        const existingSlideMap = new Map();

        existingSlides.forEach((slide) => {
            existingSlideMap.set(Number(slide.id), slide);
        });

        const existingSlideByIndex = new Map();

        existingSlides.forEach((slide) => {
            const index = Number(slide.sort_order) - 1;

            existingSlideByIndex.set(index, slide);
        });

        /* =====================================================
           GET SLIDE INDEXES
        ===================================================== */

        const slideIndexes = Object.keys(body)
            .filter((key) => /^title_\d+$/.test(key))
            .map((key) => Number(key.split("_")[1]))
            .sort((a, b) => a - b);

        /* =====================================================
           NO SLIDES
        ===================================================== */

        if (slideIndexes.length === 0) {
            await pool.query(
                `
                DELETE FROM home_hero_images
                WHERE hero_id = ?
                `,
                [heroId]
            );

            return res.json({
                message: "Hero slides cleared",
                slides: [],
            });
        }

        /* =====================================================
           UPLOADED FILES
        ===================================================== */

        const files = Array.isArray(req.files)
            ? req.files
            : [];

        /*
         * Admin sends:
         *
         * images
         * images
         * images
         *
         * and:
         *
         * image_index = ["0", "2", "3"]
         *
         * The order of image_index corresponds to
         * the order of uploaded files.
         */

        let imageIndexes = body.image_index || [];

        if (!Array.isArray(imageIndexes)) {
            imageIndexes = [imageIndexes];
        }

        const uploadedImageMap = new Map();

        files.forEach((file, filePosition) => {
            if (file.fieldname !== "images") {
                return;
            }

            const slideIndex = Number(
                imageIndexes[filePosition]
            );

            if (
                Number.isInteger(slideIndex) &&
                slideIndex >= 0
            ) {
                uploadedImageMap.set(
                    slideIndex,
                    file
                );
            }
        });

        /* =====================================================
           BUILD UPDATED SLIDES
        ===================================================== */

        const insertValues = [];

        for (
            let position = 0;
            position < slideIndexes.length;
            position++
        ) {
            const index = slideIndexes[position];

            /* =================================================
               NEW UPLOADED IMAGE
            ================================================= */

            const uploadedFile =
                uploadedImageMap.get(index);

            let imageUrl = null;

            if (uploadedFile) {
                imageUrl =
                    `/uploads/hero/${uploadedFile.filename}`;
            }

            /* =================================================
               EXISTING IMAGE
            ================================================= */

            if (!imageUrl) {
                const existingImageId =
                    body[`existing_image_id_${index}`];

                /*
                 * First try by database ID.
                 */

                if (existingImageId) {
                    const existingSlide =
                        existingSlideMap.get(
                            Number(existingImageId)
                        );

                    if (existingSlide?.image_url) {
                        imageUrl =
                            existingSlide.image_url;
                    }
                }

                /*
                 * Then try existing image URL
                 * sent by the Admin.
                 */

                if (
                    !imageUrl &&
                    body[`existing_image_url_${index}`]
                ) {
                    imageUrl =
                        body[
                            `existing_image_url_${index}`
                        ];
                }

                /*
                 * Final fallback:
                 * preserve previous image at the same position.
                 *
                 * This is useful when an admin edits text
                 * without changing the image.
                 */

                if (!imageUrl) {
                    const oldSlide =
                        existingSlideByIndex.get(index);

                    if (oldSlide?.image_url) {
                        imageUrl =
                            oldSlide.image_url;
                    }
                }
            }

            /* =================================================
               DATABASE ROW
            ================================================= */

            insertValues.push([
                heroId,

                imageUrl,

                position + 1,

                /* TITLE */
                body[
                    `title_${index}`
                ] || "",

                /* BANNER COLOR */
                body[
                    `banner_color_${index}`
                ] ||
                    "rgba(0,0,0,0.6)",

                /* SUBTITLE */
                body[
                    `subtitle_${index}`
                ] || "",

                /* DESCRIPTION */
                body[
                    `description_${index}`
                ] || "",

                /* PRIMARY CTA TEXT */
                body[
                    `primary_cta_text_${index}`
                ] || "",

                /* PRIMARY CTA LINK */
                body[
                    `primary_cta_link_${index}`
                ] || "",

                /* SECONDARY CTA TEXT */
                body[
                    `secondary_cta_text_${index}`
                ] || "",

                /* SECONDARY CTA LINK */
                body[
                    `secondary_cta_link_${index}`
                ] || "",
            ]);
        }

        /* =====================================================
           DELETE OLD SLIDES
        ===================================================== */

        await pool.query(
            `
            DELETE FROM home_hero_images
            WHERE hero_id = ?
            `,
            [heroId]
        );

        /* =====================================================
           INSERT NEW SLIDES
        ===================================================== */

        await pool.query(
            `
            INSERT INTO home_hero_images
            (
                hero_id,
                image_url,
                sort_order,
                title,
                banner_color,
                subtitle,
                description,
                primary_cta_text,
                primary_cta_link,
                secondary_cta_text,
                secondary_cta_link
            )
            VALUES ?
            `,
            [insertValues]
        );

        /* =====================================================
           SUCCESS
        ===================================================== */

        res.json({
            message:
                "Hero slides updated successfully",
        });

    } catch (err) {
        console.error(
            "updateHero error:",
            err
        );

        res.status(500).json({
            message:
                "Error updating Hero",
            error:
                process.env.NODE_ENV === "development"
                    ? err.message
                    : undefined,
        });
    }
};


/* =========================================================
   PUBLIC HOME
========================================================= */

export const getHomePublic = async (
    req,
    res
) => {
    try {
        /* =====================================================
           GET HERO
        ===================================================== */

        const [
            [hero]
        ] = await pool.query(
            "SELECT * FROM home_hero ORDER BY id ASC LIMIT 1"
        );

        let heroData = {
            images: []
        };

        if (hero) {
            const [images] =
                await pool.query(
                    `
                    SELECT
                        id,
                        hero_id,
                        image_url,
                        sort_order,
                        title,
                        banner_color,
                        subtitle,
                        description,
                        primary_cta_text,
                        primary_cta_link,
                        secondary_cta_text,
                        secondary_cta_link
                    FROM home_hero_images
                    WHERE hero_id = ?
                    ORDER BY sort_order ASC
                    `,
                    [hero.id]
                );

            heroData = {
                ...hero,
                images
            };
        }

        /* =====================================================
           GET ABOUT
        ===================================================== */

        const [
            [about]
        ] = await pool.query(
            "SELECT * FROM about_us WHERE is_active = 1 ORDER BY id ASC LIMIT 1"
        );

        /* =====================================================
           RESPONSE
        ===================================================== */

        res.json({
            hero: heroData,
            about: about || {}
        });

    } catch (err) {
        console.error(
            "getHomePublic error:",
            err
        );

        res.status(500).json({
            message:
                "Error fetching public home data"
        });
    }
};


/* =========================================================
   ABOUT - ADMIN
========================================================= */

export const getAboutAdmin = async (
    req,
    res
) => {
    try {
        const [
            [row]
        ] = await pool.query(
            "SELECT * FROM about_us WHERE is_active = 1 ORDER BY id ASC LIMIT 1"
        );

        res.json(
            row || {}
        );

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message:
                "Error fetching About"
        });
    }
};


/* =========================================================
   ABOUT - UPDATE
========================================================= */

export const updateAbout = async (
    req,
    res
) => {
    try {
        const body =
            req.body || {};

        const heading =
            body.heading || "";

        const subheading =
            body.subheading || "";

        const paragraph1 =
            body.paragraph1 || "";

        const founder_message =
            body.founder_message || "";

        const founder_name =
            body.founder_name || "";

        const mission =
            body.mission || "";

        const vision =
            body.vision || "";

        const is_active =
            body.is_active !==
            undefined
                ? Number(
                      body.is_active
                  )
                : 1;

        const [
            [existing]
        ] = await pool.query(
            "SELECT id FROM home_about ORDER BY id ASC LIMIT 1"
        );

        let aboutId;

        /* ================= INSERT ================= */

        if (!existing) {
            const [
                insertResult
            ] = await pool.query(
                `
                INSERT INTO home_about
                (
                    heading,
                    subheading,
                    paragraph1,
                    founder_message,
                    founder_name,
                    mission,
                    vision,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    heading,
                    subheading,
                    paragraph1,
                    founder_message,
                    founder_name,
                    mission,
                    vision,
                    is_active
                ]
            );

            aboutId =
                insertResult.insertId;

        } else {

            aboutId =
                existing.id;

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
                is_active
            ];

            if (
                req.files &&
                req.files.image &&
                req.files.image[0]
            ) {
                updateFields +=
                    `, image_url = ?`;

                values.push(
                    `/uploads/about/${req.files.image[0].filename}`
                );
            }

            if (
                req.files &&
                req.files.founder_image &&
                req.files
                    .founder_image[0]
            ) {
                updateFields +=
                    `, founder_image_url = ?`;

                values.push(
                    `/uploads/about/${req.files.founder_image[0].filename}`
                );
            }

            if (
                req.files &&
                req.files.home_image &&
                req.files
                    .home_image[0]
            ) {
                updateFields +=
                    `, home_image_url = ?`;

                values.push(
                    `/uploads/about/${req.files.home_image[0].filename}`
                );
            }

            values.push(
                aboutId
            );

            await pool.query(
                `
                UPDATE home_about
                SET ${updateFields}
                WHERE id = ?
                `,
                values
            );
        }

        res.json({
            message:
                "About updated successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message:
                "Error updating About"
        });
    }
};
