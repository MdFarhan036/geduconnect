import pool from "../config/db.js";

/* ===================================================== */
/* ===================== ADMIN ========================= */
/* ===================================================== */

/* ===== GET ALL SERVICES ===== */

export const getServicesAdmin =
  async (req, res) => {
    try {
      const [rows] =
        await pool.query(`
        SELECT 
          s.*,
          COUNT(sb.id) AS banner_count
        FROM services s
        LEFT JOIN service_banners sb
          ON sb.service_id = s.id
        GROUP BY s.id
        ORDER BY s.sort_order ASC
      `);

      res.json(rows);
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error fetching services",
        });
    }
  };

/* ===== CREATE SERVICE ===== */

export const createService =
  async (req, res) => {
    try {
      const body =
        req.body || {};

      const title =
        body.title || "";

      const subtitle =
        body.subtitle || "";

      const slug =
        body.slug || "";

      const description =
        body.description || "";

      const html_content =
        body.html_content ||
        "";

      const sort_order =
        body.sort_order || 1;

      const meta_title =
        body.meta_title || "";

      const meta_description =
        body.meta_description ||
        "";

      const is_active =
        body.is_active !==
        undefined
          ? body.is_active
          : 1;

      /* CHECK SLUG */

      const [[existing]] =
        await pool.query(
          "SELECT id FROM services WHERE slug = ?",
          [slug]
        );

      if (existing) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Slug already exists",
          });
      }

      /* ICON */

      let icon_url = null;

      if (
        req.files?.icon?.[0]
      ) {
        icon_url = `/uploads/services/${req.files.icon[0].filename}`;
      }

      /* IMAGE */

      let image_url = null;

      if (
        req.files?.image?.[0]
      ) {
        image_url = `/uploads/services/${req.files.image[0].filename}`;
      }

      /* INSERT */

      const [result] =
        await pool.query(
          `
        INSERT INTO services
        (
          title,
          subtitle,
          slug,
          description,
          html_content,
          icon_url,
          image_url,
          sort_order,
          meta_title,
          meta_description,
          is_active,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
          [
            title,
            subtitle,
            slug,
            description,
            html_content,
            icon_url,
            image_url,
            sort_order,
            meta_title,
            meta_description,
            is_active,
          ]
        );

      res.json({
        success: true,
        message:
          "Service created successfully",
        id: result.insertId,
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error creating service",
        });
    }
  };

/* ===== UPDATE SERVICE ===== */

export const updateService =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const body =
        req.body || {};

      const title =
        body.title || "";

      const subtitle =
        body.subtitle || "";

      const slug =
        body.slug || "";

      const description =
        body.description || "";

      const html_content =
        body.html_content ||
        "";

      const sort_order =
        body.sort_order || 1;

      const meta_title =
        body.meta_title || "";

      const meta_description =
        body.meta_description ||
        "";

      const is_active =
        body.is_active !==
        undefined
          ? body.is_active
          : 1;

      /* CHECK SLUG */

      const [[existing]] =
        await pool.query(
          `
        SELECT id
        FROM services
        WHERE slug = ?
        AND id != ?
      `,
          [slug, id]
        );

      if (existing) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Slug already exists",
          });
      }

      let query = `
        UPDATE services SET
          title = ?,
          subtitle = ?,
          slug = ?,
          description = ?,
          html_content = ?,
          sort_order = ?,
          meta_title = ?,
          meta_description = ?,
          is_active = ?,
          updated_at = NOW()
      `;

      const values = [
        title,
        subtitle,
        slug,
        description,
        html_content,
        sort_order,
        meta_title,
        meta_description,
        is_active,
      ];

      /* ICON */

      if (
        req.files?.icon?.[0]
      ) {
        query +=
          ", icon_url = ?";

        values.push(
          `/uploads/services/${req.files.icon[0].filename}`
        );
      }

      /* IMAGE */

      if (
        req.files?.image?.[0]
      ) {
        query +=
          ", image_url = ?";

        values.push(
          `/uploads/services/${req.files.image[0].filename}`
        );
      }

      query +=
        " WHERE id = ?";

      values.push(id);

      await pool.query(
        query,
        values
      );

      res.json({
        success: true,
        message:
          "Service updated successfully",
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error updating service",
        });
    }
  };

/* ===== DELETE SERVICE ===== */

export const deleteService =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      await pool.query(
        `
        DELETE FROM service_features
        WHERE service_id = ?
      `,
        [id]
      );

      await pool.query(
        `
        DELETE FROM service_banners
        WHERE service_id = ?
      `,
        [id]
      );

      await pool.query(
        `
        DELETE FROM services
        WHERE id = ?
      `,
        [id]
      );

      res.json({
        success: true,
        message:
          "Service deleted successfully",
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error deleting service",
        });
    }
  };

/* ===== GET SINGLE SERVICE ===== */

export const getServiceDetails =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const [[service]] =
        await pool.query(
          `
        SELECT *
        FROM services
        WHERE id = ?
      `,
          [id]
        );

      if (!service) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Service not found",
          });
      }

      res.json(service);
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error fetching service details",
        });
    }
  };

/* ===================================================== */
/* ================= FEATURES ========================== */
/* ===================================================== */

/* ===== GET FEATURES ===== */

export const getFeatures =
  async (req, res) => {
    try {
      const {
        serviceId,
      } = req.params;

      const [rows] =
        await pool.query(
          `
        SELECT *
        FROM service_features
        WHERE service_id = ?
        ORDER BY sort_order ASC
      `,
          [serviceId]
        );

      res.json(rows);
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error fetching features",
        });
    }
  };

/* ===== ADD FEATURE ===== */

export const addFeature =
  async (req, res) => {
    try {
      const body =
        req.body || {};

      let icon_url = null;

      if (req.file) {
        icon_url = `/uploads/service-features/${req.file.filename}`;
      }

      await pool.query(
        `
        INSERT INTO service_features
        (
          service_id,
          title,
          description,
          icon_url,
          sort_order,
          is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          body.service_id,
          body.title || "",
          body.description ||
            "",
          icon_url,
          body.sort_order || 1,
          body.is_active !==
          undefined
            ? body.is_active
            : 1,
        ]
      );

      res.json({
        success: true,
        message:
          "Feature added successfully",
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error adding feature",
        });
    }
  };

/* ===== UPDATE FEATURE ===== */

export const updateFeature =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const body =
        req.body || {};

      let imageQuery = "";

      const values = [
        body.title || "",
        body.description ||
          "",
        body.sort_order || 1,
        body.is_active !==
        undefined
          ? body.is_active
          : 1,
      ];

      if (req.file) {
        imageQuery =
          ", icon_url = ?";

        values.push(
          `/uploads/service-features/${req.file.filename}`
        );
      }

      values.push(id);

      await pool.query(
        `
        UPDATE service_features SET
          title = ?,
          description = ?,
          sort_order = ?,
          is_active = ?
          ${imageQuery}
        WHERE id = ?
      `,
        values
      );

      res.json({
        success: true,
        message:
          "Feature updated successfully",
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error updating feature",
        });
    }
  };

/* ===== DELETE FEATURE ===== */

export const deleteFeature =
  async (req, res) => {
    try {
      await pool.query(
        `
        DELETE FROM service_features
        WHERE id = ?
      `,
        [req.params.id]
      );

      res.json({
        success: true,
        message:
          "Feature deleted successfully",
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error deleting feature",
        });
    }
  };

/* ===================================================== */
/* ===================== PUBLIC ======================== */
/* ===================================================== */

/* ===== GET ALL SERVICES ===== */

export const getServicesPublic =
  async (req, res) => {
    try {
      const [rows] =
        await pool.query(`
        SELECT
          id,
          title,
          subtitle,
          slug,
          description,
          html_content,
          meta_title,
          meta_description,
          icon_url,
          image_url
        FROM services
        WHERE is_active = 1
        ORDER BY sort_order ASC
      `);

      res.json(rows);
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error fetching services",
        });
    }
  };

/* ===================================================== */
/* ===================== BANNERS ======================= */
/* ===================================================== */

export const getServiceBanners =
  async (req, res) => {
    try {
      const {
        serviceId,
      } = req.params;

      const [rows] =
        await pool.query(
          `
        SELECT *
        FROM service_banners
        WHERE service_id = ?
        ORDER BY sort_order ASC
      `,
          [serviceId]
        );

      res.json(rows);
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error fetching banners",
        });
    }
  };

export const addServiceBanner =
  async (req, res) => {
    try {
      const {
        serviceId,
      } = req.params;

      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Image required",
          });
      }

      const image_url = `/uploads/service-banners/${req.file.filename}`;

      await pool.query(
        `
        INSERT INTO service_banners
        (
          service_id,
          image_url,
          sort_order,
          is_active
        )
        VALUES (?, ?, ?, ?)
      `,
        [
          serviceId,
          image_url,
          req.body
            .sort_order || 1,
          req.body
            .is_active !==
          undefined
            ? req.body
                .is_active
            : 1,
        ]
      );

      res.json({
        success: true,
        message:
          "Banner added successfully",
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error adding banner",
        });
    }
  };

export const updateServiceBanner =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      await pool.query(
        `
        UPDATE service_banners
        SET
          sort_order = ?,
          is_active = ?
        WHERE id = ?
      `,
        [
          req.body
            .sort_order || 1,
          req.body
            .is_active !==
          undefined
            ? req.body
                .is_active
            : 1,
          id,
        ]
      );

      res.json({
        success: true,
        message:
          "Banner updated successfully",
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error updating banner",
        });
    }
  };

export const deleteServiceBanner =
  async (req, res) => {
    try {
      await pool.query(
        `
        DELETE FROM service_banners
        WHERE id = ?
      `,
        [req.params.id]
      );

      res.json({
        success: true,
        message:
          "Banner deleted successfully",
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error deleting banner",
        });
    }
  };

/* ===================================================== */
/* ================= SERVICE DETAILS =================== */
/* ===================================================== */

/* ===== GET SERVICE BY SLUG ===== */

export const getServiceBySlug =
  async (req, res) => {
    try {
      const { slug } =
        req.params;

      const [[service]] =
        await pool.query(
          `
        SELECT *
        FROM services
        WHERE slug = ?
        AND is_active = 1
      `,
          [slug]
        );

      if (!service) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Service not found",
          });
      }

      /* FEATURES */

      const [features] =
        await pool.query(
          `
        SELECT
          id,
          title,
          description,
          icon_url,
          sort_order
        FROM service_features
        WHERE service_id = ?
        AND is_active = 1
        ORDER BY sort_order ASC
      `,
          [service.id]
        );

      /* FAQS */

      const [faqs] =
        await pool.query(
          `
        SELECT *
        FROM service_faqs
        WHERE service_id = ?
        AND is_active = 1
        ORDER BY sort_order ASC
      `,
          [service.id]
        );

      /* BANNERS */

      const [banners] =
        await pool.query(
          `
        SELECT *
        FROM service_banners
        WHERE service_id = ?
        AND is_active = 1
        ORDER BY sort_order ASC
      `,
          [service.id]
        );

      res.json({
        success: true,
        ...service,
        features,
        faqs,
        banners,
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Error fetching service",
        });
    }
  };

/* ===================================================== */
/* ================= EDITOR IMAGE ====================== */
/* ===================================================== */

export const uploadEditorImage =
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Image required",
          });
      }

      res.json({
        success: true,
        url: `/uploads/editor/${req.file.filename}`,
      });
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          success: false,
          message:
            "Image upload failed",
        });
    }
  };