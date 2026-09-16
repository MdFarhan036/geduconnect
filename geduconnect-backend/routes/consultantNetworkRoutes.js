// routes/consultantNetworkRoutes.js

import express from "express";
import pool from "../config/db.js";
import multer from "multer";
import path from "path";
const router = express.Router();
const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        "uploads/consultant-network"
      );
    },

    filename: (
      req,
      file,
      cb
    ) => {

      const uniqueName =
        Date.now() +
        path.extname(
          file.originalname
        );

      cb(
        null,
        uniqueName
      );
    },
  });

const upload =
  multer({
    storage,
  });
/* =========================================================
   PUBLIC DATA
========================================================= */

router.get("/consultant-network/public", async (req, res) => {
  try {

    /* SETTINGS */

    const [settingsRows] =
      await pool.query(`
        SELECT *
        FROM consultant_network_settings
        ORDER BY id DESC
        LIMIT 1
      `);

    /* FEATURES */

    const [featuresRows] =
      await pool.query(`
        SELECT *
        FROM consultant_network_features
        WHERE is_active = 1
        ORDER BY sort_order ASC, id ASC
      `);

    /* CITIES */

    const [citiesRows] =
      await pool.query(`
        SELECT *
        FROM consultant_network_cities
        WHERE is_active = 1
        ORDER BY consultant_count DESC
      `);

    res.json({
      settings:
        settingsRows[0] || null,
      features: featuresRows,
      cities: citiesRows,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Failed to fetch consultant network data",
    });
  }
});

/* =========================================================
   ADMIN GET
========================================================= */

router.get("/consultant-network/admin", async (req, res) => {
  try {

    const [settingsRows] =
      await pool.query(`
        SELECT *
        FROM consultant_network_settings
        ORDER BY id DESC
        LIMIT 1
      `);

    const [featuresRows] =
      await pool.query(`
        SELECT *
        FROM consultant_network_features
        ORDER BY sort_order ASC, id ASC
      `);

    const [citiesRows] =
      await pool.query(`
        SELECT *
        FROM consultant_network_cities
        ORDER BY consultant_count DESC
      `);

    res.json({
      settings:
        settingsRows[0] || null,
      features: featuresRows,
      cities: citiesRows,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Failed to fetch admin data",
    });
  }
});

/* =========================================================
   UPDATE SETTINGS
========================================================= */

router.put("/consultant-network/settings",
  upload.single("about_image"),
  async (req, res) => {

    try {

      const {
        hero_badge,
        hero_title,
        hero_subtitle,

        years_experience,
        active_consultants,
        admissions_managed,

        about_title,
        about_description_1,
        about_description_2,

        seo_title,
        seo_description,
        seo_keywords,
        seo_og_image,
      } = req.body || {};

      const about_image =
        req.file
          ? `/uploads/consultant-network/${req.file.filename}`
          : req.body.about_image;

      const [existing] =
        await pool.query(`
          SELECT id
          FROM consultant_network_settings
          LIMIT 1
        `);

      /* UPDATE */

      if (existing.length > 0) {

        await pool.query(
          `
          UPDATE consultant_network_settings
          SET
            hero_badge = ?,
            hero_title = ?,
            hero_subtitle = ?,

            years_experience = ?,
            active_consultants = ?,
            admissions_managed = ?,

            about_title = ?,
            about_description_1 = ?,
            about_description_2 = ?,

            about_image = ?,

            seo_title = ?,
            seo_description = ?,
            seo_keywords = ?,
            seo_og_image = ?

          WHERE id = ?
        `,
          [
            hero_badge,
            hero_title,
            hero_subtitle,

            years_experience,
            active_consultants,
            admissions_managed,

            about_title,
            about_description_1,
            about_description_2,

            about_image,

            seo_title,
            seo_description,
            seo_keywords,
            seo_og_image,

            existing[0].id,
          ]
        );

      } else {

        /* INSERT */

        await pool.query(
          `
          INSERT INTO consultant_network_settings
          (
            hero_badge,
            hero_title,
            hero_subtitle,

            years_experience,
            active_consultants,
            admissions_managed,

            about_title,
            about_description_1,
            about_description_2,

            about_image,

            seo_title,
            seo_description,
            seo_keywords,
            seo_og_image
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            hero_badge,
            hero_title,
            hero_subtitle,

            years_experience,
            active_consultants,
            admissions_managed,

            about_title,
            about_description_1,
            about_description_2,

            about_image,

            seo_title,
            seo_description,
            seo_keywords,
            seo_og_image,
          ]
        );
      }

      res.json({
        success: true,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message:
          "Failed to update settings",
      });
    }
  }
);

/* =========================================================
   CREATE FEATURE
========================================================= */

router.post("/consultant-network/features", async (req, res) => {
  try {

    const {
      icon,
      title,
      description,
      sort_order,
      is_active,
    } = req.body;

    const [result] =
      await pool.query(
        `
        INSERT INTO consultant_network_features
        (
          icon,
          title,
          description,
          sort_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          icon,
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
      message:
        "Failed to create feature",
    });
  }
});

/* =========================================================
   UPDATE FEATURE
========================================================= */

router.put("/consultant-network/features/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      icon,
      title,
      description,
      sort_order,
      is_active,
    } = req.body;

    await pool.query(
      `
      UPDATE consultant_network_features
      SET
        icon = ?,
        title = ?,
        description = ?,
        sort_order = ?,
        is_active = ?
      WHERE id = ?
    `,
      [
        icon,
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
      message:
        "Failed to update feature",
    });
  }
});

/* =========================================================
   DELETE FEATURE
========================================================= */

router.delete("/consultant-network/features/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM consultant_network_features
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
      message:
        "Failed to delete feature",
    });
  }
});

/* =========================================================
   CREATE CITY
========================================================= */

router.post("/consultant-network/cities", async (req, res) => {
  try {

    const {
      name,
      state_name,
      lat,
      lng,
      consultant_count,
      sort_order,
      is_active,
    } = req.body;

    const [result] =
      await pool.query(
        `
        INSERT INTO consultant_network_cities
        (
          name,
          state_name,
          lat,
          lng,
          consultant_count,
          sort_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          name,
          state_name,
          lat,
          lng,
          consultant_count,
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
      message:
        "Failed to create city",
    });
  }
});

/* =========================================================
   UPDATE CITY
========================================================= */

router.put("/consultant-network/cities/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      state_name,
      lat,
      lng,
      consultant_count,
      sort_order,
      is_active,
    } = req.body;

    await pool.query(
      `
      UPDATE consultant_network_cities
      SET
        name = ?,
        state_name = ?,
        lat = ?,
        lng = ?,
        consultant_count = ?,
        sort_order = ?,
        is_active = ?
      WHERE id = ?
    `,
      [
        name,
        state_name,
        lat,
        lng,
        consultant_count,
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
      message:
        "Failed to update city",
    });
  }
});

/* =========================================================
   DELETE CITY
========================================================= */

router.delete("/consultant-network/cities/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM consultant_network_cities
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
      message:
        "Failed to delete city",
    });
  }
});

export default router;