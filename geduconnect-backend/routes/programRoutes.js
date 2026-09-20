import express from "express";

import {
      addProgram,
    getAllPrograms,
    getSingleProgram,
    updateProgram,
    deleteProgram,
    getProgramsByUniversity,
    getProgramsByCourse,
    syncUniversityPrograms,
    getUniversityPrograms,
} from "../controllers/adminProgramController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


/* =========================================================
   PUBLIC
========================================================= */

/*
   LEGACY

   Old frontend:
   GET /api/public/programs/:universityId

   Keep temporarily so existing client pages
   do not immediately break.
*/
router.get(
    "/public/programs/:universityId",
    getProgramsByUniversity
);


/*
   NEW

   Course → Programs

   GET /api/public/courses/:courseId/programs
*/
router.get(
    "/public/courses/:courseId/programs",
    getProgramsByCourse
);


/* =========================================================
   ADMIN
========================================================= */

router.use(protect);


/* =========================================================
   COMMON PROGRAM MASTER
========================================================= */

/*
   NEW:
   POST /api/admin/courses/:courseId/programs

   Example:

   B.Tech
      ↓
   B.Tech CSE
*/
router.post(
    "/admin/courses/:courseId/programs",
    addProgram
);


/*
   GET ALL COMMON PROGRAMS

   GET /api/admin/programs
*/
router.get(
    "/admin/programs",
    getAllPrograms
);


/*
   GET SINGLE COMMON PROGRAM

   GET /api/admin/programs/:id
*/
router.get(
    "/admin/programs/:id",
    getSingleProgram
);


/*
   UPDATE COMMON PROGRAM

   PUT /api/admin/programs/:id
*/
router.put(
    "/admin/programs/:id",
    updateProgram
);


/*
   DELETE COMMON PROGRAM

   DELETE /api/admin/programs/:id
*/
router.delete(
    "/admin/programs/:id",
    deleteProgram
);


/*
   GET PROGRAMS UNDER A COMMON COURSE

   GET /api/admin/courses/:courseId/programs
*/
router.get(
    "/admin/courses/:courseId/programs",
    getProgramsByCourse
);


/* =========================================================
   UNIVERSITY PROGRAM ASSIGNMENT
========================================================= */

/*
   Assign COMMON programs to a university.

   Example:

   VGU
      ↓
   B.Tech CSE
   B.Tech ECE

   Request:

   PUT /api/admin/universities/1/programs

   Body:

   {
       "program_ids": [1, 2, 5]
   }
*/
router.get(
    "/admin/universities/:universityId/programs",
    getUniversityPrograms
);
router.put(
    "/admin/universities/:universityId/programs",
    syncUniversityPrograms
);


export default router;