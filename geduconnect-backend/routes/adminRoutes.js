import express from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";

/* ---------- Universities ---------- */
import {
    createUniversity,
    updateUniversity,
    deleteUniversity,
    getUniversitiesAdmin,
} from "../controllers/adminUniversityController.js";

/* ---------- Programs ---------- */
import {
    addProgram,
    updateProgram,
    deleteProgram,
    getProgramsByUniversity,
    getAllPrograms,
    getSingleProgram,
} from "../controllers/adminProgramController.js";

/* ---------- Specializations ---------- */
import {
    createSpecialization,
    getSpecializationsByProgram,
    getSingleSpecialization,
    updateSpecialization,
    deleteSpecialization,
    getAllSpecializations,
} from "../controllers/adminSpecializationController.js";

/* ---------- Program Fees ---------- */
import {
    addProgramFee,
    getProgramFeesByProgram,
    updateProgramFee,
    deleteProgramFee,
    getSingleProgramFee,
    getFeesBySpecialization,
    getAllProgramFees,
} from "../controllers/adminProgramFeeController.js";

/* ---------- Dashboard ---------- */
import { getDashboardStats } from "../controllers/adminDashboardController.js";
import uploadUniversityImage from "../middleware/uploadUniversityImage.js";
import uploadExcel from "../middleware/uploadExcel.js";
import { bulkUploadUniversities, downloadUniversityBulkTemplate } from "../controllers/adminBulkUploadController.js";

const router = express.Router();

/* 🔒 All admin routes protected */
router.use(auth, requireRole("admin", "editor"));

/* ===================== UNIVERSITIES ===================== */
router.get("/universities", getUniversitiesAdmin);
router.post(
    "/universities",
    uploadUniversityImage.single("univimg"),
    createUniversity
);
router.put(
    "/universities/:id",
    uploadUniversityImage.single("univimg"),
    updateUniversity
);
router.delete("/universities/:id", deleteUniversity);
router.post(
    "/universities/bulk-upload",
    uploadExcel.single("file"),
    bulkUploadUniversities
);
router.get(
    "/universities/bulk-upload/template",
    downloadUniversityBulkTemplate
);
/* ===================== PROGRAMS ===================== */
/*
Hierarchy:
University → Programs
*/
router.get("/programs/all", getAllPrograms);
router.get("/programs/university/:universityId", getProgramsByUniversity);
router.get("/programs/:id", getSingleProgram);
router.post("/programs", addProgram);
router.put("/programs/:id", updateProgram);
router.delete("/programs/:id", deleteProgram);

/* ===================== SPECIALIZATIONS ===================== */
/*
Hierarchy:
Program → Specializations
*/
/* ===================== SPECIALIZATIONS ===================== */
router.get("/specializations/all", getAllSpecializations);
router.get("/specializations/program/:programId", getSpecializationsByProgram);
router.get("/specializations/:id", getSingleSpecialization);
router.post("/specializations", createSpecialization);
router.put("/specializations/:id", updateSpecialization);
router.delete("/specializations/:id", deleteSpecialization);

/* ===================== PROGRAM FEES ===================== */
/*
Hierarchy:
Program → Fees
*/
/* ===================== PROGRAM FEES ===================== */
router.get("/program-fees/all", getAllProgramFees);
router.get("/program-fees/program/:programId", getProgramFeesByProgram);
router.get(
    "/program-fees/specialization/:specializationId",
    getFeesBySpecialization
);
router.get("/program-fees/:id", getSingleProgramFee);
router.post("/program-fees", addProgramFee);
router.put("/program-fees/:id", updateProgramFee);
router.delete("/program-fees/:id", deleteProgramFee);
/* ===================== DASHBOARD ===================== */
router.get("/dashboard", getDashboardStats);

export default router;