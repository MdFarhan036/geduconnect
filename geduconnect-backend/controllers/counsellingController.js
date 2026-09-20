import db from "../config/db.js";

/* =====================================================
   CREATE COUNSELLING REQUEST
===================================================== */

export const createCounsellingRequest = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      university_id,
      university_name,
      course_id,
      course_name,
      message,
    } = req.body;

    /* ================= VALIDATION ================= */

    if (!name || !mobile) {
      return res.status(400).json({
        message: "Name and mobile number are required.",
      });
    }

    if (!university_id || !university_name) {
      return res.status(400).json({
        message: "University is required.",
      });
    }

    if (!course_id || !course_name) {
      return res.status(400).json({
        message: "Course is required.",
      });
    }

    /* ================= INSERT ================= */

    const [result] = await db.query(
      `
      INSERT INTO counselling_requests
      (
        name,
        mobile,
        email,
        university_id,
        university_name,
        course_id,
        course_name,
        message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name.trim(),
        mobile.trim(),
        email?.trim() || null,
        university_id,
        university_name.trim(),
        course_id,
        course_name.trim(),
        message?.trim() || null,
      ]
    );

    /* ================= RESPONSE ================= */

    res.status(201).json({
      message:
        "Counselling request submitted successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error(
      "Create counselling request error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to submit counselling request.",
    });
  }
};