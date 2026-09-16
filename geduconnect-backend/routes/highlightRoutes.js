import express from "express";
import {
    getHighlightsAdmin,
    createHighlight,
    updateHighlight,
    deleteHighlight,
    getHighlightsPublic,
} from "../controllers/highlightController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------- ADMIN ---------- */
router.get("/admin/highlights", protect, getHighlightsAdmin);
router.post("/admin/highlights", protect, createHighlight);
router.put("/admin/highlights/:id", protect, updateHighlight);
router.delete("/admin/highlights/:id", protect, deleteHighlight);

/* ---------- PUBLIC ---------- */
router.get("/public/highlights", getHighlightsPublic);

export default router;