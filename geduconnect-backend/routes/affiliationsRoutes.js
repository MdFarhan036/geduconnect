import express from "express";
import {
    getAffiliationsAdmin,
    createAffiliation,
    updateAffiliation,
    deleteAffiliation,
    getAffiliationsPublic
} from "../controllers/affiliationsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADMIN */
router.get("/admin/affiliations", protect, getAffiliationsAdmin);
router.post("/admin/affiliations", protect, createAffiliation);
router.put("/admin/affiliations/:id", protect, updateAffiliation);
router.delete("/admin/affiliations/:id", protect, deleteAffiliation);

/* PUBLIC */
router.get("/public/affiliations", getAffiliationsPublic);

export default router;