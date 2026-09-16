import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* =========================================================
   GET ADMIN
========================================================= */

router.get("/journey/public", async (req, res) => {
  try {

    const [rows] = await pool.query(`
      SELECT *
      FROM journey_items
      WHERE is_active = 1
      ORDER BY sort_order ASC, id ASC
    `);

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Failed to fetch journey items",
    });
  }
});
router.get("/journey/admin", async (req, res) => {
  try {

    const [rows] = await pool.query(`
      SELECT *
      FROM journey_items
      ORDER BY sort_order ASC
    `);

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Fetch failed",
    });
  }
});

/* =========================================================
   CREATE
========================================================= */

router.post("/journey/admin", async (req, res) => {
  try {

    const {
      year,
      title,
      description,
      sort_order,
      is_active,
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO journey_items
      (
        year,
        title,
        description,
        sort_order,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        year,
        title,
        description,
        sort_order || 0,
        is_active ?? 1,
      ]
    );

    res.json({
      success: true,
      id: result.insertId,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Create failed",
    });
  }
});

/* =========================================================
   UPDATE
========================================================= */

router.put("/journey/admin/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      year,
      title,
      description,
      sort_order,
      is_active,
    } = req.body;

    await pool.query(
      `
      UPDATE journey_items
      SET
        year = ?,
        title = ?,
        description = ?,
        sort_order = ?,
        is_active = ?
      WHERE id = ?
    `,
      [
        year,
        title,
        description,
        sort_order || 0,
        is_active,
        id,
      ]
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Update failed",
    });
  }
});

/* =========================================================
   DELETE
========================================================= */

router.delete("/journey/admin/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM journey_items
      WHERE id = ?
    `,
      [id]
    );

    res.json({
      success: true,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Delete failed",
    });
  }
});
export default router;