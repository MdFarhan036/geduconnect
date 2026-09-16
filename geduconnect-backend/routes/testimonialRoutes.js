import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
    getTestimonialsAdmin,
    saveTestimonial,
    addTestimonial,
    deleteTestimonial,
    getTestimonialsPublic,
    getTestimonialsPageAdmin,
    updateTestimonialsPage,
    getTestimonialsPagePublic
} from "../controllers/testimonialController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   HELPER — ENSURE DIRECTORY EXISTS
========================================================= */

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

/* =========================================================
   MULTER CONFIG
========================================================= */

const testimonialStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = "uploads/testimonials";
        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        const cleanName = file.originalname.replace(/\s+/g, "");
        cb(null, Date.now() + "-" + cleanName);
    }
});

const pageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = "uploads/testimonials-page";
        ensureDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        const cleanName = file.originalname.replace(/\s+/g, "");
        cb(null, Date.now() + "-" + cleanName);
    }
});

const uploadTestimonial = multer({
    storage: testimonialStorage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

const uploadPage = multer({
    storage: pageStorage,
    limits: { fileSize: 3 * 1024 * 1024 }
});

/* =========================================================
   ADMIN - TESTIMONIAL CRUD
========================================================= */

router.get("/admin/testimonials", protect, getTestimonialsAdmin);

router.post(
    "/admin/testimonials",
    protect,
    uploadTestimonial.single("image"),
    addTestimonial
);

router.put(
    "/admin/testimonials/:id",
    protect,
    uploadTestimonial.single("image"),
    saveTestimonial
);

router.delete(
    "/admin/testimonials/:id",
    protect,
    deleteTestimonial
);

/* =========================================================
   ADMIN - PAGE SETTINGS
========================================================= */

router.get(
    "/admin/testimonials-page",
    protect,
    getTestimonialsPageAdmin
);

router.put(
    "/admin/testimonials-page",
    protect,
    uploadPage.fields([
        { name: "hero_image", maxCount: 1 },
        { name: "about_image", maxCount: 1 }
    ]),
    updateTestimonialsPage
);

/* =========================================================
   PUBLIC
========================================================= */

router.get("/public/testimonials", getTestimonialsPublic);

router.get(
    "/public/testimonials-page",
    getTestimonialsPagePublic
);

export default router;