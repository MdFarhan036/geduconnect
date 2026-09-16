import express from "express";
import {
    getServicesAdmin,
    createService,
    updateService,
    deleteService,
    getServicesPublic,
    getServiceDetails,
    // updateServiceDetails,
    getFeatures,
    addFeature,
    updateFeature,
    deleteFeature,
    getServiceBySlug,

    // 🔥 NEW: Banner Controllers
    getServiceBanners,
    addServiceBanner,
    updateServiceBanner,
    deleteServiceBanner,

} from "../controllers/serviceController.js";

import { protect } from "../middleware/authMiddleware.js";
import createUploader from "../middleware/uploadServiceImage.js";

const router = express.Router();

/* ============================= */
/* CREATE UPLOADERS */
/* ============================= */

const uploadService = createUploader("services");
const uploadBanner = createUploader("service-banners"); // 🔥 separate folder
const uploadFeature = createUploader("service-features"); // 🔥 ADD THIS
const uploadPart = createUploader("service-parts");
/* ============================= */
/* ADMIN - SERVICES */
/* ============================= */

router.get("/admin/services", protect, getServicesAdmin);

router.post(
    "/admin/services",
    uploadService.fields([
        { name: "icon", maxCount: 1 },
        { name: "image", maxCount: 1 }
    ]),
    createService
);

router.put(
    "/admin/services/:id",
    uploadService.fields([
        { name: "icon", maxCount: 1 },
        { name: "image", maxCount: 1 }
    ]),
    updateService
);

// router.put(
//     "/admin/services/details/:id",
//     protect,
//     updateServiceDetails
// );

router.get("/admin/services/:id", protect, getServiceDetails);


router.delete("/admin/services/:id", protect, deleteService);

/* ============================= */
/* ADMIN - SERVICE FEATURES */
/* ============================= */

router.get(
    "/admin/service-features/:serviceId",
    protect,
    getFeatures
);

router.post(
    "/admin/service-features",
    protect,
    uploadFeature.single("image"), // 🔥 ADD THIS
    addFeature
);

router.put(
    "/admin/service-features/:id",
    protect,
    uploadFeature.single("image"), // 🔥 ADD THIS
    updateFeature
);

router.delete(
    "/admin/service-features/:id",
    protect,
    deleteFeature
);

/* ============================= */
/* ADMIN - SERVICE SECTIONS */
/* ============================= */

// router.get(
//     "/admin/service-sections/:serviceId",
//     protect,
//     getSections
// );

// router.post(
//     "/admin/service-sections",
//     protect,
//     addSection
// );

// router.put(
//     "/admin/service-sections/:id",
//     protect,
//     updateSection
// );

// router.delete(
//     "/admin/service-sections/:id",
//     protect,
//     deleteSection
// );

/* ============================= */
/* 🔥 ADMIN - SERVICE BANNERS */
/* ============================= */

router.get(
    "/admin/services/:serviceId/banners",
    protect,
    getServiceBanners
);

router.post(
    "/admin/services/:serviceId/banners",
    protect,
    uploadBanner.single("image"),
    addServiceBanner
);

router.put(
    "/admin/service-banners/:id",
    protect,
    updateServiceBanner
);

router.delete(
    "/admin/service-banners/:id",
    protect,
    deleteServiceBanner
);

/* ============================= */
/* PUBLIC */
/* ============================= */

router.get("/public/services", getServicesPublic);
router.get("/public/services/:slug", getServiceBySlug);
// router.get("/admin/service-parts/:serviceId", getParts);
// router.post("/admin/service-parts", uploadPart.single("image"), addPart);
// router.put("/admin/service-parts/:id", uploadPart.single("image"), updatePart);
// router.delete(
//     "/admin/service-parts/:id",
//     protect,
//     deletePart
// );

export default router;