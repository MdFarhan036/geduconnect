import db from "../config/db.js";

/* ================= GET ALL COUNSELLING REQUESTS ================= */

export const getCounsellingRequests = async (req, res) => {
  try {
    const {
      status,
      university_id,
      course_id,
      search,
    } = req.query;

    let sql = `
      SELECT
        id,
        name,
        mobile,
        email,
        university_id,
        university_name,
        course_id,
        course_name,
        message,
        status,
        created_at,
        updated_at
      FROM counselling_requests
      WHERE 1 = 1
    `;

    const params = [];

    /* ================= STATUS FILTER ================= */

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    /* ================= UNIVERSITY FILTER ================= */

    if (university_id) {
      sql += ` AND university_id = ?`;
      params.push(university_id);
    }

    /* ================= COURSE FILTER ================= */

    if (course_id) {
      sql += ` AND course_id = ?`;
      params.push(course_id);
    }

    /* ================= SEARCH ================= */

    if (search) {
      sql += `
        AND (
          name LIKE ?
          OR mobile LIKE ?
          OR email LIKE ?
          OR university_name LIKE ?
          OR course_name LIKE ?
        )
      `;

      const searchValue = `%${search}%`;

      params.push(
        searchValue,
        searchValue,
        searchValue,
        searchValue,
        searchValue
      );
    }

    sql += ` ORDER BY created_at DESC`;

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (error) {
    console.error(
      "Get counselling requests error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch counselling requests.",
    });
  }
};


/* ================= GET SINGLE REQUEST ================= */

export const getCounsellingRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM counselling_requests
      WHERE id = ?
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Counselling request not found.",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(
      "Get counselling request error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch counselling request.",
    });
  }
};


/* ================= UPDATE STATUS ================= */

export const updateCounsellingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "NEW",
      "CONTACTED",
      "FOLLOW_UP",
      "CONVERTED",
      "CLOSED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid counselling status.",
      });
    }

    const [result] = await db.query(
      `
      UPDATE counselling_requests
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Counselling request not found.",
      });
    }

    res.json({
      message: "Counselling status updated successfully.",
    });
  } catch (error) {
    console.error(
      "Update counselling status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update counselling status.",
    });
  }
};