import express from "express";
import {
    getApprovalsAdmin,
    createApproval,
    updateApproval,
    deleteApproval,
    getApprovalsPublic
} from "../controllers/approvalsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ADMIN */
router.get("/admin/approvals", protect, getApprovalsAdmin);
router.post("/admin/approvals", protect, createApproval);
router.put("/admin/approvals/:id", protect, updateApproval);
router.delete("/admin/approvals/:id", protect, deleteApproval);

/* PUBLIC */
router.get("/public/approvals", getApprovalsPublic);

export default router;