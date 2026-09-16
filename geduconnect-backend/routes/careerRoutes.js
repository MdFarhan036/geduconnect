import express from "express";
import {
    getCareerPage,
    updateCareerPage,
    createJob,
    updateJob,
    deleteJob,
    getAllJobsAdmin,
} from "../controllers/careerController.js";

import { protect } from "../middleware/authMiddleware.js";
import createUploader from "../middleware/uploadServiceImage.js";

const router = express.Router();

/* =====================================================
   PUBLIC ROUTES
===================================================== */

// Get full career page data
// Final URL → /api/careers/public
router.get("/careers/public", getCareerPage);

router.get("/careers/admin/page", protect, getCareerPage); // 👈 ADD THIS

router.put(
    "/careers/admin/page",
    protect,
    createUploader("careers").fields([
        { name: "hero_image", maxCount: 1 },
        { name: "join_image", maxCount: 1 }
    ]),
    updateCareerPage
);

router.get("/careers/admin/jobs", protect, getAllJobsAdmin);
router.post("/careers/admin/jobs", protect, createJob);
router.put("/careers/admin/jobs/:id", protect, updateJob);
router.delete("/careers/admin/jobs/:id", protect, deleteJob);

export default router;