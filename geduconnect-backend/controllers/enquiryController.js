import pool from "../config/db.js";



export const getAllEnquiries = async(req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM enquiries ORDER BY created_at DESC"
        );

        res.json(rows);
    } catch (error) {
        console.error("Fetch enquiries error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/* =====================================================
   PUBLIC - CREATE ENQUIRY
===================================================== */
export const createEnquiry = async(req, res) => {
    try {
        const { name, email, phone, service_id, message } = req.body;

        await pool.query(
            `INSERT INTO enquiries
      (name, email, phone, service_id, message)
      VALUES (?, ?, ?, ?, ?)`, [name, email, phone, service_id || null, message]
        );

        res.json({ message: "Enquiry submitted successfully" });

    } catch (err) {
        console.error("Create enquiry error:", err);
        res.status(500).json({ message: "Error submitting enquiry" });
    }
};

/* =====================================================
   ADMIN - LIST WITH PAGINATION + FILTERS
===================================================== */
export const getEnquiriesAdmin = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const status = req.query.status || "";

        const offset = (page - 1) * limit;

        let where = "WHERE 1=1";
        let params = [];

        if (status) {
            where += " AND e.status = ?";
            params.push(status);
        }

        if (search) {
            where += `
        AND (
          e.name LIKE ?
          OR e.email LIKE ?
          OR e.phone LIKE ?
        )
      `;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const [data] = await pool.query(
            `
      SELECT 
        e.*,
        s.title AS service_name
      FROM enquiries e
      LEFT JOIN services s ON e.service_id = s.id
      ${where}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
      `, [...params, limit, offset]
        );

        const [
            [count]
        ] = await pool.query(
            `
      SELECT COUNT(*) as total
      FROM enquiries e
      ${where}
      `,
            params
        );

        res.json({
            data,
            pagination: {
                total: count.total,
                page,
                limit,
                totalPages: Math.ceil(count.total / limit)
            }
        });

    } catch (err) {
        console.error("Admin fetch error:", err);
        res.status(500).json({ message: "Failed to fetch enquiries" });
    }
};

/* =====================================================
   ADMIN - UPDATE STATUS
===================================================== */
export const updateEnquiryStatus = async(req, res) => {
    try {
        await pool.query(
            "UPDATE enquiries SET status=? WHERE id=?", [req.body.status, req.params.id]
        );

        res.json({ message: "Status updated" });

    } catch (err) {
        console.error("Update status error:", err);
        res.status(500).json({ message: "Error updating status" });
    }
};

/* =====================================================
   DASHBOARD STATS
===================================================== */
export const getDashboardStats = async(req, res) => {
    try {
        const [stats] = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(status = 'new') AS newLeads,
        SUM(status = 'contacted') AS contacted,
        SUM(status = 'closed') AS closed
      FROM enquiries
    `);

        res.json(stats[0]);

    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/* =====================================================
   ADMIN - FILTER BY STATUS
===================================================== */
export const getEnquiriesByStatus = async(req, res) => {
    try {
        const { status } = req.params;

        const [rows] = await pool.query(
            `
      SELECT e.*, s.title AS service_name
      FROM enquiries e
      LEFT JOIN services s ON e.service_id = s.id
      WHERE e.status = ?
      ORDER BY e.created_at DESC
      `, [status]
        );

        res.json(rows);

    } catch (error) {
        console.error("Filter enquiries error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/* =====================================================
   EXPORT CSV
===================================================== */
export const downloadEnquiriesCSV = async(req, res) => {
    try {
        const { status } = req.query;

        let where = "WHERE 1=1";
        let values = [];

        if (status) {
            where += " AND e.status = ?";
            values.push(status);
        }

        const [rows] = await pool.query(
            `
      SELECT 
        e.*, 
        s.title AS service_name
      FROM enquiries e
      LEFT JOIN services s ON e.service_id = s.id
      ${where}
      ORDER BY e.created_at DESC
      `,
            values
        );

        let csv = "ID,Name,Email,Phone,Service,Status,Created At\n";

        rows.forEach(r => {
            csv += `${r.id},"${r.name}","${r.email}","${r.phone || ''}","${r.service_name || ''}",${r.status},${r.created_at}\n`;
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=enquiries.csv"
        );

        res.send(csv);

    } catch (err) {
        console.error("CSV export error:", err);
        res.status(500).json({ message: "CSV export failed" });
    }
};