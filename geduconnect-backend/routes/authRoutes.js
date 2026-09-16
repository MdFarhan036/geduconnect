import express from "express";
import { me, loginAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/me", protect, me);




export default router;