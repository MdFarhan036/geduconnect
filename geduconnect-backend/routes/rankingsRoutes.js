import express from "express";
import {
    getRankingsAdmin,
    createRanking,
    updateRanking,
    deleteRanking,
    getRankingsPublic
} from "../controllers/rankingsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADMIN */
router.get("/admin/rankings", protect, getRankingsAdmin);
router.post("/admin/rankings", protect, createRanking);
router.put("/admin/rankings/:id", protect, updateRanking);
router.delete("/admin/rankings/:id", protect, deleteRanking);

/* PUBLIC */
router.get("/public/rankings", getRankingsPublic);

export default router;