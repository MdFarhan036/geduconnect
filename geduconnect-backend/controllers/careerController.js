import pool from "../config/db.js";

/* =====================================================
   PUBLIC - GET FULL CAREER PAGE
===================================================== */

export const getCareerPage = async(req, res) => {
    try {
        const [
            [page]
        ] = await pool.query(
            `SELECT * FROM careers_page_content 
       WHERE is_active = 1 
       ORDER BY id DESC LIMIT 1`
        );

        const [jobs] = await pool.query(
            `SELECT * FROM job_positions 
       WHERE is_active = 1 
       ORDER BY id DESC`
        );

        const [faqs] = await pool.query(
            `SELECT * FROM career_faqs 
       WHERE is_active = 1 
       ORDER BY id DESC`
        );

        res.status(200).json({
            success: true,
            page,
            jobs,
            faqs,
        });
    } catch (error) {
        console.error("Career Page Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load career page",
        });
    }
};

/* =====================================================
   ADMIN - UPDATE CAREER PAGE CONTENT
===================================================== */
export const updateCareerPage = async(req, res) => {
    try {
        const {
            hero_title,
            join_title,
            join_description,
            resume_email,
            cta_title,
            cta_button_text,
            cta_button_link,
            meta_title,
            meta_description,
            is_active,
        } = req.body;

        // ✅ Handle multiple uploaded images
        let heroImagePath = null;
        let joinImagePath = null;

        if (req.files && req.files.hero_image && req.files.hero_image.length > 0) {
            heroImagePath = `/uploads/careers/${req.files.hero_image[0].filename}`;
        }

        if (req.files && req.files.join_image && req.files.join_image.length > 0) {
            joinImagePath = `/uploads/careers/${req.files.join_image[0].filename}`;
        }

        await pool.query(
            `INSERT INTO careers_page_content 
      (
        hero_title,
        join_title,
        join_description,
        resume_email,
        cta_title,
        cta_button_text,
        cta_button_link,
        meta_title,
        meta_description,
        hero_image,
        join_image,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                hero_title,
                join_title,
                join_description,
                resume_email,
                cta_title,
                cta_button_text,
                cta_button_link,
                meta_title,
                meta_description,
                heroImagePath,
                joinImagePath,
                is_active !== undefined ? is_active : 1,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Career page updated successfully",
        });
    } catch (error) {
        console.error("Update Career Page Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update career page",
        });
    }
};

/* =====================================================
   ADMIN - JOB MANAGEMENT
===================================================== */

// Get All Jobs (Admin)
export const getAllJobsAdmin = async(req, res) => {
    try {
        const [jobs] = await pool.query(
            `SELECT * FROM job_positions ORDER BY id DESC`
        );

        res.json({
            success: true,
            jobs,
        });
    } catch (error) {
        console.error("Get Jobs Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
        });
    }
};

// Create Job
export const createJob = async(req, res) => {
    try {
        const {
            position,
            location,
            experience,
            salary_range,
            apply_link,
            is_active,
        } = req.body;

        await pool.query(
            `INSERT INTO job_positions 
      (position, location, experience, salary_range, apply_link, is_active)
      VALUES (?, ?, ?, ?, ?, ?)`, [
                position,
                location,
                experience,
                salary_range,
                apply_link,
                is_active !== undefined ? is_active : 1
            ]
        );

        res.status(201).json({
            success: true,
            message: "Job created successfully",
        });
    } catch (error) {
        console.error("Create Job Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create job",
        });
    }
};

// Update Job
export const updateJob = async(req, res) => {
    try {
        const { id } = req.params;
        const {
            position,
            location,
            experience,
            salary_range,
            apply_link,
            is_active,
        } = req.body;

        await pool.query(
            `UPDATE job_positions SET
        position = ?,
        location = ?,
        experience = ?,
        salary_range = ?,
        apply_link = ?,
        is_active = ?
       WHERE id = ?`, [
                position,
                location,
                experience,
                salary_range,
                apply_link,
                is_active,
                id,
            ]
        );

        res.json({
            success: true,
            message: "Job updated successfully",
        });
    } catch (error) {
        console.error("Update Job Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update job",
        });
    }
};

// Delete Job
export const deleteJob = async(req, res) => {
    try {
        const { id } = req.params;

        await pool.query(`DELETE FROM job_positions WHERE id = ?`, [id]);

        res.json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        console.error("Delete Job Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete job",
        });
    }
};

/* =====================================================
   ADMIN - FAQ MANAGEMENT
===================================================== */

// Get All FAQs (Admin)
export const getAllFaqsAdmin = async(req, res) => {
    try {
        const [faqs] = await pool.query(
            `SELECT * FROM career_faqs ORDER BY id DESC`
        );

        res.json({
            success: true,
            faqs,
        });
    } catch (error) {
        console.error("Get FAQ Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch FAQs",
        });
    }
};

// Create FAQ
export const createCareerFaq = async(req, res) => {
    try {
        const { question, answer, is_active } = req.body;

        await pool.query(
            `INSERT INTO career_faqs (question, answer, is_active)
       VALUES (?, ?, ?)`, [question, answer, is_active !== undefined ? is_active : 1]
        );

        res.status(201).json({
            success: true,
            message: "FAQ created successfully",
        });
    } catch (error) {
        console.error("Create FAQ Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create FAQ",
        });
    }
};

// Update FAQ
export const updateCareerFaq = async(req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, is_active } = req.body;

        await pool.query(
            `UPDATE career_faqs SET
        question = ?,
        answer = ?,
        is_active = ?
       WHERE id = ?`, [question, answer, is_active, id]
        );

        res.json({
            success: true,
            message: "FAQ updated successfully",
        });
    } catch (error) {
        console.error("Update FAQ Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update FAQ",
        });
    }
};

// Delete FAQ
export const deleteCareerFaq = async(req, res) => {
    try {
        const { id } = req.params;

        await pool.query(`DELETE FROM career_faqs WHERE id = ?`, [id]);

        res.json({
            success: true,
            message: "FAQ deleted successfully",
        });
    } catch (error) {
        console.error("Delete FAQ Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete FAQ",
        });
    }
};