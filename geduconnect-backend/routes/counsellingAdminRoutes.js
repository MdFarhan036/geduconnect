import express from "express";

import {
  getCounsellingRequests,
  getCounsellingRequestById,
  updateCounsellingStatus,
} from "../controllers/counsellingAdminController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN COUNSELLING ================= */

router.get(
  "/admin/counselling",
  protect,
  getCounsellingRequests
);

router.get(
  "/admin/counselling/:id",
  protect,
  getCounsellingRequestById
);

router.put(
  "/admin/counselling/:id/status",
  protect,
  updateCounsellingStatus
);

export default router;