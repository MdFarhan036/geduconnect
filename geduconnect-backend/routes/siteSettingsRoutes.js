import express from "express";
import {
    getSettingsAdmin,
    updateSetting,
    getSettingsPublic
} from "../controllers/siteSettingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/settings", protect, getSettingsAdmin);
router.put("/admin/settings/:key", protect, updateSetting);

router.get("/public/settings", getSettingsPublic);

export default router;