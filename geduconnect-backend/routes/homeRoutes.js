import express from "express";
import {
    getHeroAdmin,
    updateHero,
    getAboutAdmin,
    updateAbout,
    getHomePublic
} from "../controllers/homeController.js";

import { protect } from "../middleware/authMiddleware.js";
import createUploader from "../middleware/uploadServiceImage.js";

const router = express.Router();

// Create uploaders
const uploadHero = createUploader("hero");
const uploadAbout = createUploader("about");

/* ================= ADMIN ================= */

router.get("/admin/hero", protect, getHeroAdmin);

router.put(
    "/admin/hero",
    protect,
    uploadHero.array("images", 10),
    updateHero
);

router.get("/admin/about", protect, getAboutAdmin);

/* ✅ UPDATED ABOUT ROUTE */
router.put(
    "/admin/about",
    protect,
    uploadAbout.fields([
        { name: "image", maxCount: 1 },
        { name: "founder_image", maxCount: 1 },
        { name: "home_image", maxCount: 1 } // 👈 NEW
    ]),
    updateAbout
);

/* ================= PUBLIC ================= */

router.get("/public/home", getHomePublic);

export default router;