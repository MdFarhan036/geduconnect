import express from "express";
import {
    getClientsAdmin,
    addClient,
    deleteClient,
    getClientsPublic,
    getClientsPagePublic,
    getClientsPageAdmin,
    updateClient,
    getClientBySlugPublic,
    getSingleClientAdmin,
    compareUniversities,
} from "../controllers/clientController.js";

import { protect } from "../middleware/authMiddleware.js";
import { uploadClientLogo } from "../middleware/uploadClientLogo.js";
// 🔥 Make sure this upload middleware supports .single() and .fields()

const router = express.Router();

/* =========================================================
   ADMIN - CLIENTS CRUD
========================================================= */

router.get("/admin/clients", protect, getClientsAdmin);

router.post(
    "/admin/clients",
    protect,
    uploadClientLogo.single("logo"),
    addClient
);

router.put(
    "/admin/clients/:id",
    protect,
    uploadClientLogo.single("logo"),
    updateClient
);

router.delete(
    "/admin/clients/:id",
    protect,
    deleteClient
);

/* =========================================================
   ADMIN - CLIENTS PAGE CONTENT
========================================================= */

router.get(
    "/admin/clients-page",
    protect,
    getClientsPageAdmin
);

router.put(
    "/admin/clients-page",
    protect,
    uploadClientLogo.fields([
        { name: "hero_image", maxCount: 1 },
        { name: "section_image", maxCount: 1 }
    ]),
    updateClient
);

/* =========================================================
   PUBLIC ROUTES
========================================================= */

router.get("/public/clients", getClientsPublic);
router.get("/public/clients-page", getClientsPagePublic);
router.get("/admin/clients/:id", protect, getSingleClientAdmin);
router.get("/public/clients/:slug", getClientBySlugPublic);
router.get("/public/compare", compareUniversities);
export default router;