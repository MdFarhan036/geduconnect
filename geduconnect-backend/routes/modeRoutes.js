import express from "express";

import {
    addMode,
    getAllModes,
    getSingleMode,
    updateMode,
    deleteMode
} from "../controllers/adminModeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC
========================================================= */

// Public active modes
router.get("/public/modes", async (req, res) => {
    try {
        const db = (await import("../config/db.js")).default;

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                slug,
                description,
                sort_order
            FROM modes
            WHERE is_active = 1
            ORDER BY sort_order ASC, name ASC
            `
        );

        res.json(rows);

    } catch (error) {
        console.error("PUBLIC MODES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch modes"
        });
    }
});


/* =========================================================
   ADMIN
========================================================= */

router.use(protect);

router.get("/admin/modes", getAllModes);

router.get("/admin/modes/:id", getSingleMode);

router.post("/admin/modes", addMode);

router.put("/admin/modes/:id", updateMode);

router.delete("/admin/modes/:id", deleteMode);

export default router;