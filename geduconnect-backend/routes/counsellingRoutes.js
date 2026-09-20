import express from "express";

import {
  createCounsellingRequest,
} from "../controllers/counsellingController.js";

const router = express.Router();

/* =====================================================
   PUBLIC COUNSELLING REQUEST
===================================================== */

router.post(
  "/public/counselling",
  createCounsellingRequest
);

export default router;