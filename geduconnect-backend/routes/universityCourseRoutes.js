import express from "express";

import {
    getUniversityCourses,
    syncUniversityCourses,
    getPublicUniversityCourses,
} from "../controllers/universityCourseController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


/* =========================================================
   PUBLIC
========================================================= */

router.get(
    "/public/universities/:universityId/courses",
    getPublicUniversityCourses
);


/* =========================================================
   ADMIN
========================================================= */

router.use(protect);


/*
   Get all common courses and whether
   they are assigned to this university.
*/

router.get(
    "/admin/universities/:universityId/courses",
    getUniversityCourses
);


/*
   Assign / replace courses for university.
*/

router.put(
    "/admin/universities/:universityId/courses",
    syncUniversityCourses
);


export default router;