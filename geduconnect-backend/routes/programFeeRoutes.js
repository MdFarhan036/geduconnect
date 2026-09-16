import express from "express";
import {
    createProgramFee,
    getProgramFees,
} from "../controllers/programFeeController.js";

import { auth } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.use(auth, isAdmin);

router.post("/", createProgramFee);
router.get("/:programId", getProgramFees);

export default router;