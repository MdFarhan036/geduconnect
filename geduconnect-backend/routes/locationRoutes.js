import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

/* =========================================================
   GET INDIA CITIES JSON
========================================================= */

router.get(
  "/location/india-cities",
  async (req, res) => {

    try {

      const filePath =
        path.join(
          process.cwd(),
          "data",
          "indiaCities.json"
        );

      const data =
        fs.readFileSync(
          filePath,
          "utf-8"
        );

      res.json(
        JSON.parse(data)
      );

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message:
          "Failed to load India cities",
      });
    }
  }
);

export default router;