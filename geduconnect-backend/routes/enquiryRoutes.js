import express from "express";
import {
    createEnquiry,
    getAllEnquiries,
    updateEnquiryStatus,
    getDashboardStats,
    getEnquiriesByStatus,
    // getAdminEnquiries,
    getEnquiriesAdmin,
    downloadEnquiriesCSV
} from "../controllers/enquiryController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/", createEnquiry);

// Admin
router.get("/", protect, getAllEnquiries);
router.get("/stats/dashboard", protect, getDashboardStats);
router.get("/status/:status", protect, getEnquiriesByStatus);
// router.get("/admin/list", protect, getAdminEnquiries);
router.put("/:id/status", protect, updateEnquiryStatus);
router.get("/download/csv", protect, downloadEnquiriesCSV);
router.get("/list", protect, getEnquiriesAdmin);
router.put("/:id/status", protect, updateEnquiryStatus);
export default router; // 🔥 THIS LINE FIXES IT