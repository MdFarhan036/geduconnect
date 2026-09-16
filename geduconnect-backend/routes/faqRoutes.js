import express from "express";
import {
    getFaqsAdmin,
    saveFaq,
    addFaq,
    deleteFaq,
    getFaqsPublic
} from "../controllers/faqController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/faqs", protect, getFaqsAdmin);
router.post("/admin/faqs", protect, addFaq);
router.put("/admin/faqs/:id", protect, saveFaq);
router.delete("/admin/faqs/:id", protect, deleteFaq);

router.get("/public/faqs", getFaqsPublic);

export default router;