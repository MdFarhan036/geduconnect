import pool from "../config/db.js";

/* =========================================================
   HELPERS
========================================================= */

const toInt = (value, defaultValue = 0) => {
    const num = parseInt(value);
    return isNaN(num) ? defaultValue : num;
};

const toBooleanInt = (value, defaultValue = 1) => {
    if (value === "0" || value === 0) return 0;
    if (value === "1" || value === 1) return 1;
    return defaultValue;
};

const safeText = (value) => {
    if (!value || value === "undefined") return "";
    return value;
};

const safeJSON = (value) => {
    try {
        if (!value) return {};
        return typeof value === "string" ? JSON.parse(value) : value;
    } catch {
        return {};
    }
};

/* =========================================================
   ADMIN - CLIENTS CRUD
========================================================= */

export const getClientsAdmin = async(req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM clients ORDER BY sort_order ASC"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching clients" });
    }
};

/* ================= ADD ================= */

export const addClient = async(req, res) => {
    try {
        const {
            name,
            slug,
            description,
            type,
            mode,
            sort_order,
            is_active,
            apply_link,
            extra_data
        } = req.body;

        const logo_url = req.file ?
            `/uploads/clients/${req.file.filename}` :
            null;

        const [result] = await pool.query(
            `INSERT INTO clients
      (name, slug, description, type, mode, logo_url, apply_link, sort_order, is_active, extra_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                safeText(name),
                safeText(slug),
                safeText(description),
                safeText(type) || "partner",
                safeText(mode) || "online",
                logo_url,
                safeText(apply_link),
                toInt(sort_order, 1),
                toBooleanInt(is_active, 1),
                extra_data || null
            ]
        );

        res.json({
            message: "Client added successfully",
            id: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding client" });
    }
};

/* ================= UPDATE ================= */

export const updateClient = async(req, res) => {
    try {
        const {
            name,
            slug,
            description,
            type,
            mode,
            sort_order,
            is_active,
            apply_link,
            extra_data
        } = req.body;

        let updateFields = `
      name = ?,
      slug = ?,
      description = ?,
      type = ?,
      mode = ?,
      apply_link = ?,
      sort_order = ?,
      is_active = ?,
      extra_data = ?
    `;

        const values = [
            safeText(name),
            safeText(slug),
            safeText(description),
            safeText(type),
            safeText(mode),
            safeText(apply_link),
            toInt(sort_order, 1),
            toBooleanInt(is_active, 1),
            extra_data || null
        ];

        if (req.file) {
            updateFields += `, logo_url = ?`;
            values.push(`/uploads/clients/${req.file.filename}`);
        }

        values.push(req.params.id);

        await pool.query(
            `UPDATE clients SET ${updateFields} WHERE id = ?`,
            values
        );

        res.json({ message: "Client updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating client" });
    }
};

/* ================= DELETE ================= */

export const deleteClient = async(req, res) => {
    try {
        await pool.query("DELETE FROM clients WHERE id = ?", [
            req.params.id
        ]);

        res.json({ message: "Client deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting client" });
    }
};

/* ================= GET SINGLE (IMPORTANT) ================= */

export const getSingleClientAdmin = async(req, res) => {
    try {
        const [
            [row]
        ] = await pool.query(
            "SELECT * FROM clients WHERE id = ?", [req.params.id]
        );

        if (!row) {
            return res.status(404).json({ message: "Client not found" });
        }

        row.extra_data = safeJSON(row.extra_data);

        res.json(row);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching client" });
    }
};

/* =========================================================
   PUBLIC - CLIENTS
========================================================= */

export const getClientsPublic = async(req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, name, slug, description, type, mode, logo_url, apply_link, sort_order, extra_data
       FROM clients
       WHERE is_active = 1
       ORDER BY sort_order ASC`
        );

        const formatted = rows.map((row) => {
            const extra = safeJSON(row.extra_data);

            return {
                ...row,
                extra_data: extra,
                total_courses: row.type === "university" &&
                    extra &&
                    Array.isArray(extra.programs) ?
                    extra.programs.length : 0,
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error("Error fetching public clients:", err);
        res.status(500).json({ message: "Error fetching clients" });
    }
};
/* =========================================================
   PUBLIC - SINGLE UNIVERSITY (BY SLUG)
========================================================= */

export const getClientBySlugPublic = async(req, res) => {
    try {
        const [
            [row]
        ] = await pool.query(
            `SELECT * FROM clients
       WHERE slug = ? AND is_active = 1`, [req.params.slug]
        );

        if (!row) {
            return res.status(404).json({ message: "Not found" });
        }

        row.extra_data = safeJSON(row.extra_data);

        res.json(row);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching university" });
    }
};

/* =========================================================
   CLIENTS PAGE CONTENT (UNCHANGED)
========================================================= */

export const getClientsPageAdmin = async(req, res) => {
    try {
        const [
            [row]
        ] = await pool.query(
            "SELECT * FROM clients_page_content ORDER BY id ASC LIMIT 1"
        );
        res.json(row || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching page content" });
    }
};

export const getClientsPagePublic = async(req, res) => {
    try {
        const [
            [row]
        ] = await pool.query(
            "SELECT * FROM clients_page_content WHERE is_active = 1 ORDER BY id ASC LIMIT 1"
        );
        res.json(row || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching page content" });
    }
};
export const compareUniversities = async(req, res) => {
    try {
        const { slugs } = req.query;

        if (!slugs) {
            return res.status(400).json({ message: "No universities provided" });
        }

        const slugArray = slugs.split(",");

        const [rows] = await pool.query(
            `SELECT * FROM clients
       WHERE slug IN (?) AND is_active = 1`, [slugArray]
        );

        const formatted = rows.map((row) => ({
            ...row,
            extra_data: safeJSON(row.extra_data)
        }));

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error comparing universities" });
    }
};