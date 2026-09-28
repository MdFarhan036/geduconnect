import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

/* =====================================================
   ROUTES
===================================================== */

import enquiryRoutes from "./routes/enquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import highlightRoutes from "./routes/highlightRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import modeRoutes from "./routes/modeRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import siteSettingsRoutes from "./routes/siteSettingsRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import whyRoutes from "./routes/whyRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import approvalsRoutes from "./routes/approvalsRoutes.js";
import affiliationsRoutes from "./routes/affiliationsRoutes.js";
import rankingsRoutes from "./routes/rankingsRoutes.js";

import adminProgramRoutes from "./routes/programRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import universityCourseRoutes from "./routes/universityCourseRoutes.js";

import universityImageRoutes
  from "./routes/universityImageRoutes.js";

import journeyRoutes from "./routes/journeyRoutes.js";
import consultantNetworkRoutes
  from "./routes/consultantNetworkRoutes.js";

import locationRoutes
  from "./routes/locationRoutes.js";

import counsellingRoutes
  from "./routes/counsellingRoutes.js";

import counsellingAdminRoutes
  from "./routes/counsellingAdminRoutes.js";

import mediaRoutes
  from "./routes/mediaRoutes.js";


const app = express();

/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(
  cors({
    origin: [
      "https://geduconnect.com",
      "https://admin.geduconnect.com",

      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ],

    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

/* =====================================================
   STATIC UPLOADS
===================================================== */

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      status: "OK",
      message:
        "G Educonnect backend running 🚀",
    });
  }
);

/* =====================================================
   API ROUTES
===================================================== */

app.use(
  "/api/enquiries",
  enquiryRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api",
  homeRoutes
);

app.use(
  "/api",
  highlightRoutes
);

app.use(
  "/api",
  serviceRoutes
);

app.use(
  "/api",
  testimonialRoutes
);

app.use(
  "/api",
  faqRoutes
);

app.use(
  "/api",
  modeRoutes
);

app.use(
  "/api",
  clientRoutes
);

app.use(
  "/api",
  siteSettingsRoutes
);

app.use(
  "/api",
  blogRoutes
);

app.use(
  "/api",
  galleryRoutes
);

app.use(
  "/api",
  whyRoutes
);

app.use(
  "/api",
  careerRoutes
);

app.use(
  "/api",
  approvalsRoutes
);

app.use(
  "/api",
  affiliationsRoutes
);

app.use(
  "/api",
  rankingsRoutes
);

app.use(
  "/api",
  journeyRoutes
);

app.use(
  "/api",
  consultantNetworkRoutes
);

/* =====================================================
   PROGRAMS
===================================================== */

app.use(
  "/api",
  adminProgramRoutes
);

app.use(
  "/api",
  publicRoutes
);

app.use(
  "/api",
  programRoutes
);

app.use(
  "/api",
  courseRoutes
);

app.use(
  "/api",
  universityCourseRoutes
);

/* =====================================================
   LOCATION
===================================================== */

app.use(
  "/api",
  locationRoutes
);

/* =====================================================
   COUNSELLING
===================================================== */

app.use(
  "/api",
  counsellingRoutes
);

app.use(
  "/api",
  counsellingAdminRoutes
);

/* =====================================================
   MEDIA
===================================================== */

app.use(
  "/api",
  mediaRoutes
);

/* =====================================================
   UNIVERSITY CAROUSEL IMAGES
===================================================== */

app.use(
  "/api/university-images",
  universityImageRoutes
);

/* =====================================================
   404 HANDLER
===================================================== */

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
      path: req.originalUrl,
    });
  }
);

/* =====================================================
   EXPORT
===================================================== */

export default app;