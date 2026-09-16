import pool from "../config/db.js";

/* ================================================= */
/* ===================== ADMIN ===================== */
/* ================================================= */

/* ===== GET ALL BLOGS ===== */
export const getBlogsAdmin = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM blogs ORDER BY created_at DESC"
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching blogs" });
    }
};


/* ===== CREATE BLOG ===== */
export const createBlog = async (req, res) => {
    try {
        const body = req.body || {};

        /*
         * image_url       = Thumbnail
         * hero_image_url  = Hero Image
         */

        const thumbnailFile = req.files?.thumbnail_image?.[0];
        const heroFile = req.files?.hero_image?.[0];

        const image_url = thumbnailFile
            ? `/uploads/blogs/${thumbnailFile.filename}`
            : null;

        const hero_image_url = heroFile
            ? `/uploads/blogs/${heroFile.filename}`
            : null;

        await pool.query(
            `INSERT INTO blogs
            (
                title,
                slug,
                excerpt,
                content,
                category,
                tags,
                author_name,
                reading_time,
                image_url,
                hero_image_url,
                meta_title,
                meta_description,
                sort_order,
                is_active,
                featured,
                status,
                published_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                body.title || "",
                body.slug || "",
                body.excerpt || "",
                body.content || "",
                body.category || "",
                body.tags || "",
                body.author_name || "",
                body.reading_time || "",

                // Thumbnail
                image_url,

                // Hero
                hero_image_url,

                body.meta_title || "",
                body.meta_description || "",
                body.sort_order || 1,
                body.is_active !== undefined ? body.is_active : 1,
                body.featured || 0,
                body.status || "draft",
                body.published_at || null
            ]
        );

        res.json({
            message: "Blog created successfully"
        });

    } catch (err) {
        console.error("CREATE BLOG ERROR:", err);

        res.status(500).json({
            message: "Error creating blog",
            error: err.message
        });
    }
};


/* ===== UPDATE BLOG ===== */
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};

        /*
         * image_url       = Thumbnail
         * hero_image_url  = Hero Image
         */

        const thumbnailFile = req.files?.thumbnail_image?.[0];
        const heroFile = req.files?.hero_image?.[0];

        let imageQuery = "";
        let heroImageQuery = "";

        const values = [
            body.title || "",
            body.slug || "",
            body.excerpt || "",
            body.content || "",
            body.category || "",
            body.tags || "",
            body.author_name || "",
            body.reading_time || "",
            body.meta_title || "",
            body.meta_description || "",
            body.sort_order || 1,
            body.is_active !== undefined ? body.is_active : 1,
            body.featured || 0,
            body.status || "draft",
            body.published_at || null
        ];

        /* ===== NEW THUMBNAIL ===== */
        if (thumbnailFile) {
            imageQuery = ", image_url = ?";
            values.push(
                `/uploads/blogs/${thumbnailFile.filename}`
            );
        }

        /* ===== NEW HERO IMAGE ===== */
        if (heroFile) {
            heroImageQuery = ", hero_image_url = ?";
            values.push(
                `/uploads/blogs/${heroFile.filename}`
            );
        }

        values.push(id);

        await pool.query(
            `UPDATE blogs SET
                title = ?,
                slug = ?,
                excerpt = ?,
                content = ?,
                category = ?,
                tags = ?,
                author_name = ?,
                reading_time = ?,
                meta_title = ?,
                meta_description = ?,
                sort_order = ?,
                is_active = ?,
                featured = ?,
                status = ?,
                published_at = ?
                ${imageQuery}
                ${heroImageQuery}
            WHERE id = ?`,
            values
        );

        res.json({
            message: "Blog updated successfully"
        });

    } catch (err) {
        console.error("UPDATE BLOG ERROR:", err);

        res.status(500).json({
            message: "Error updating blog",
            error: err.message
        });
    }
};


/* ===== DELETE BLOG ===== */
export const deleteBlog = async (req, res) => {
    try {
        await pool.query(
            "DELETE FROM blogs WHERE id = ?",
            [req.params.id]
        );

        res.json({
            message: "Blog deleted"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Error deleting blog"
        });
    }
};


/* ================================================= */
/* ===================== PUBLIC ==================== */
/* ================================================= */

/* ===== GET ALL PUBLIC BLOGS ===== */
export const getBlogsPublic = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT *
             FROM blogs
             WHERE is_active = 1
             ORDER BY sort_order ASC`
        );

        res.json(rows);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Error fetching public blogs"
        });
    }
};


/* ===== GET BLOG BY SLUG ===== */
export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const [blog] = await pool.query(
            `SELECT *
             FROM blogs
             WHERE slug = ?
             AND is_active = 1
             LIMIT 1`,
            [slug]
        );

        if (blog.length === 0) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        /*
         * Related blogs use image_url as thumbnail.
         * Hero image is available separately as hero_image_url.
         */
        const [related] = await pool.query(
            `SELECT
                id,
                title,
                slug,
                image_url,
                hero_image_url
             FROM blogs
             WHERE id != ?
             AND is_active = 1
             ORDER BY created_at DESC
             LIMIT 5`,
            [blog[0].id]
        );

        res.json({
            blog: blog[0],
            related
        });

    } catch (err) {
        console.error("GET BLOG BY SLUG ERROR:", err);

        res.status(500).json({
            message: "Server error"
        });
    }
};