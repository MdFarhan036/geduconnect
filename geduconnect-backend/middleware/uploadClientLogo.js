import multer from "multer";
import path from "path";
import fs from "fs";

/* ===== Ensure Folder Exists ===== */
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        let uploadPath = "uploads/clients";

        // If uploading page images
        if (
            file.fieldname === "hero_image" ||
            file.fieldname === "section_image"
        ) {
            uploadPath = "uploads/clients-page";
        }

        ensureDir(uploadPath); // 🔥 Auto-create folder

        cb(null, uploadPath);
    },

    filename: function(req, file, cb) {
        cb(
            null,
            Date.now() + "-" + file.originalname.replace(/\s+/g, "")
        );
    }
});

export const uploadClientLogo = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});