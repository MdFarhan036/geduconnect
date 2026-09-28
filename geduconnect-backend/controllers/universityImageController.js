import fs from "fs";
import path from "path";

import db from "../config/db.js";

/* =====================================================
   GET UNIVERSITY IMAGES
===================================================== */

export const getUniversityImages = async (
  req,
  res
) => {
  try {
    const { universityId } =
      req.params;

    if (!universityId) {
      return res.status(400).json({
        success: false,
        message:
          "University ID is required",
      });
    }

    const [rows] = await db.query(
      `
      SELECT
        id,
        university_id,
        image_url,
        image_alt,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM university_images
      WHERE university_id = ?
      ORDER BY sort_order ASC, id ASC
      `,
      [universityId]
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(
      "GET UNIVERSITY IMAGES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch university images",
      error: error.message,
    });
  }
};

/* =====================================================
   ADD UNIVERSITY IMAGE
===================================================== */

export const addUniversityImage = async (
  req,
  res
) => {
  let uploadedFilePath = null;

  try {
    const { universityId } =
      req.params;

    const {
      image_alt,
      sort_order,
      is_active,
    } = req.body || {};

    /* ================= VALIDATION ================= */

    if (!universityId) {
      return res.status(400).json({
        success: false,
        message:
          "University ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "University image is required",
      });
    }

    uploadedFilePath =
      req.file.path;

    /* ================= CHECK UNIVERSITY ================= */

    const [universityRows] =
      await db.query(
        `
        SELECT id
        FROM clients
        WHERE id = ?
        LIMIT 1
        `,
        [universityId]
      );

    if (!universityRows.length) {
      if (
        uploadedFilePath &&
        fs.existsSync(uploadedFilePath)
      ) {
        fs.unlinkSync(
          uploadedFilePath
        );
      }

      return res.status(404).json({
        success: false,
        message:
          "University not found",
      });
    }

    /* ================= IMAGE URL ================= */

    const imageUrl =
      `/uploads/university/${req.file.filename}`;

    const order =
      Number.isFinite(
        Number(sort_order)
      )
        ? Number(sort_order)
        : 0;

    const active =
      Number(is_active) === 0
        ? 0
        : 1;

    /* ================= INSERT ================= */

    const [result] =
      await db.query(
        `
        INSERT INTO university_images
        (
          university_id,
          image_url,
          image_alt,
          sort_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          universityId,
          imageUrl,
          image_alt ||
            "University image",
          order,
          active,
        ]
      );

    /* ================= FETCH CREATED ================= */

    const [rows] =
      await db.query(
        `
        SELECT
          id,
          university_id,
          image_url,
          image_alt,
          sort_order,
          is_active,
          created_at,
          updated_at
        FROM university_images
        WHERE id = ?
        LIMIT 1
        `,
        [result.insertId]
      );

    return res.status(201).json({
      success: true,
      message:
        "University image uploaded successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "ADD UNIVERSITY IMAGE ERROR:",
      error
    );

    /* ================= CLEANUP FILE ================= */

    if (
      uploadedFilePath &&
      fs.existsSync(uploadedFilePath)
    ) {
      try {
        fs.unlinkSync(
          uploadedFilePath
        );
      } catch (deleteError) {
        console.error(
          "Uploaded file cleanup failed:",
          deleteError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to add university image",
      error: error.message,
    });
  }
};

/* =====================================================
   UPDATE UNIVERSITY IMAGE
===================================================== */

export const updateUniversityImage = async (
  req,
  res
) => {
  try {
    const { imageId } =
      req.params;

    const {
      image_alt,
      is_active,
      sort_order,
    } = req.body || {};

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message:
          "Image ID is required",
      });
    }

    const fields = [];
    const values = [];

    if (
      image_alt !== undefined
    ) {
      fields.push(
        "image_alt = ?"
      );

      values.push(image_alt);
    }

    if (
      is_active !== undefined
    ) {
      fields.push(
        "is_active = ?"
      );

      values.push(
        Number(is_active) === 1
          ? 1
          : 0
      );
    }

    if (
      sort_order !== undefined
    ) {
      fields.push(
        "sort_order = ?"
      );

      values.push(
        Number(sort_order)
      );
    }

    if (!fields.length) {
      return res.status(400).json({
        success: false,
        message:
          "No fields to update",
      });
    }

    values.push(imageId);

    const [result] =
      await db.query(
        `
        UPDATE university_images
        SET ${fields.join(", ")}
        WHERE id = ?
        `,
        values
      );

    if (
      result.affectedRows === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "University image not found",
      });
    }

    const [rows] =
      await db.query(
        `
        SELECT
          id,
          university_id,
          image_url,
          image_alt,
          sort_order,
          is_active,
          created_at,
          updated_at
        FROM university_images
        WHERE id = ?
        LIMIT 1
        `,
        [imageId]
      );

    return res.status(200).json({
      success: true,
      message:
        "University image updated successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error(
      "UPDATE UNIVERSITY IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update university image",
      error: error.message,
    });
  }
};

/* =====================================================
   DELETE UNIVERSITY IMAGE
===================================================== */

export const deleteUniversityImage = async (
  req,
  res
) => {
  try {
    const { imageId } =
      req.params;

    if (!imageId) {
      return res.status(400).json({
        success: false,
        message:
          "Image ID is required",
      });
    }

    const [rows] =
      await db.query(
        `
        SELECT image_url
        FROM university_images
        WHERE id = ?
        LIMIT 1
        `,
        [imageId]
      );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message:
          "University image not found",
      });
    }

    const imageUrl =
      rows[0].image_url;

    await db.query(
      `
      DELETE FROM university_images
      WHERE id = ?
      `,
      [imageId]
    );

    /* ================= DELETE FILE ================= */

    if (
      imageUrl &&
      imageUrl.startsWith(
        "/uploads/"
      )
    ) {
      const filePath =
        path.join(
          process.cwd(),
          imageUrl.replace(
            /^\/+/,
            ""
          )
        );

      if (
        fs.existsSync(filePath)
      ) {
        fs.unlinkSync(filePath);
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "University image deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE UNIVERSITY IMAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete university image",
      error: error.message,
    });
  }
};

/* =====================================================
   REORDER UNIVERSITY IMAGES
===================================================== */

export const reorderUniversityImages =
  async (req, res) => {
    const connection =
      await db.getConnection();

    try {
      const { universityId } =
        req.params;

      const { image_ids } =
        req.body || {};

      if (!universityId) {
        return res.status(400).json({
          success: false,
          message:
            "University ID is required",
        });
      }

      if (
        !Array.isArray(image_ids)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "image_ids must be an array",
        });
      }

      await connection.beginTransaction();

      for (
        let index = 0;
        index < image_ids.length;
        index++
      ) {
        await connection.query(
          `
          UPDATE university_images
          SET sort_order = ?
          WHERE id = ?
          AND university_id = ?
          `,
          [
            index,
            image_ids[index],
            universityId,
          ]
        );
      }

      await connection.commit();

      return res.status(200).json({
        success: true,
        message:
          "University images reordered successfully",
      });
    } catch (error) {
      await connection.rollback();

      console.error(
        "REORDER UNIVERSITY IMAGES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to reorder university images",
        error: error.message,
      });
    } finally {
      connection.release();
    }
  };