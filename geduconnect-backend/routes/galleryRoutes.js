import express from "express";
import {
    getGalleryAdmin,
    createGallery,
    updateGallery,
    deleteGallery,
    getGalleryPublic
} from "../controllers/galleryController.js";

import { protect } from "../middleware/authMiddleware.js";
import createUploader from "../middleware/uploadServiceImage.js";

const router = express.Router();

/* ============================= */
/* CREATE UPLOADER */
/* ============================= */

const uploadGallery = createUploader("gallery");

/* ============================= */
/* ADMIN */
/* ============================= */

router.get("/admin/gallery", protect, getGalleryAdmin);

router.post(
    "/admin/gallery",
    protect,
    uploadGallery.single("image"),
    createGallery
);

router.put(
    "/admin/gallery/:id",
    protect,
    uploadGallery.single("image"),
    updateGallery
);

router.delete("/admin/gallery/:id", protect, deleteGallery);

/* ============================= */
/* PUBLIC */
/* ============================= */

router.get("/public/gallery", getGalleryPublic);

export default router;