import multer from "multer";
import path from "path";
import fs from "fs";

const createUploader = (folderName) => {
    const uploadDir = `uploads/${folderName}`;

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },

        filename: function (req, file, cb) {
            const uniqueName =
                Date.now() + "-" + Math.round(Math.random() * 1e9);

            cb(
                null,
                uniqueName + path.extname(file.originalname)
            );
        },
    });

    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/webp"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only images allowed"), false);
        }
    };

    return multer({
        storage,
        fileFilter
    });
};

export default createUploader;