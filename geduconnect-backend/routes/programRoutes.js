import express from "express";

import {
    addProgram,
    getAllPrograms,
    getSingleProgram,
    updateProgram,
    deleteProgram,
} from "../controllers/adminProgramController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

/* ===================== ADMIN PROGRAMS ===================== */

// Add
router.post("/admin/programs", addProgram);

// List all
router.get("/admin/programs", getAllPrograms);

// Get single program - EDIT PAGE
router.get("/admin/programs/:id", getSingleProgram);

// Update
router.put("/admin/programs/:id", updateProgram);

// Delete
router.delete("/admin/programs/:id", deleteProgram);


/* ===================== UNIVERSITY PROGRAMS ===================== */

// // Programs by university
// router.get(
//     "/programs/:universityId",
//     getProgramsByUniversity
// );

export default router;