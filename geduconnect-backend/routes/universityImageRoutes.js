import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getUniversityImages,
  addUniversityImage,
  updateUniversityImage,
  deleteUniversityImage,
  reorderUniversityImages,
} from "../controllers/universityImageController.js";

const router = express.Router();

/* =====================================================
   UPLOAD DIRECTORY
===================================================== */

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "university"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

/* =====================================================
   MULTER STORAGE
===================================================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(
      file.originalname
    );

    const originalName = path.basename(
      file.originalname,
      ext
    );

    const safeName = originalName
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const filename = `${safeName}-${Date.now()}${ext.toLowerCase()}`;

    cb(null, filename);
  },
});

/* =====================================================
   MULTER CONFIG
===================================================== */

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
      );
    }

    cb(null, true);
  },
});

/* =====================================================
   PUBLIC
===================================================== */

router.get(
  "/public/:universityId",
  getUniversityImages
);

/* =====================================================
   ADMIN
===================================================== */

router.get(
  "/admin/:universityId",
  getUniversityImages
);

router.post(
  "/admin/:universityId",
  upload.single("image"),
  addUniversityImage
);

router.put(
  "/admin/:imageId",
  updateUniversityImage
);

router.delete(
  "/admin/:imageId",
  deleteUniversityImage
);

router.put(
  "/admin/:universityId/reorder",
  reorderUniversityImages
);

/* =====================================================
   MULTER ERROR HANDLER
===================================================== */

router.use(
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (
        err.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image size must not exceed 5 MB",
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next();
  }
);

export default router;