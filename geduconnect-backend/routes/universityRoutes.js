import express from "express";
import {
    createUniversity,
    getUniversityBySlug
} from "../controllers/universityController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin/university", protect, createUniversity);
router.get("/public/universities/:slug", getUniversityBySlug);

export default router;