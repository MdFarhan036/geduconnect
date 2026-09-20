import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import pool from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

/* =========================================================
   UPLOAD ROOT
========================================================= */

const uploadsRoot = path.join(
    process.cwd(),
    "uploads"
);


/* =========================================================
   ALLOWED IMAGE EXTENSIONS
========================================================= */

const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".svg",
    ".avif",
];


/* =========================================================
   GET TOP-LEVEL FOLDERS
========================================================= */

const getFolders = () => {

    if (!fs.existsSync(uploadsRoot)) {
        return [];
    }

    return fs
        .readdirSync(uploadsRoot, {
            withFileTypes: true,
        })
        .filter(
            (entry) => entry.isDirectory()
        )
        .map(
            (entry) => entry.name
        )
        .sort((a, b) =>
            a.localeCompare(b)
        );
};


/* =========================================================
   RECURSIVE IMAGE SCANNER
========================================================= */

const scanImages = (
    directory,
    relativePath = ""
) => {

    let results = [];

    if (!fs.existsSync(directory)) {
        return results;
    }

    const entries = fs.readdirSync(
        directory,
        {
            withFileTypes: true,
        }
    );


    for (const entry of entries) {

        const fullPath = path.join(
            directory,
            entry.name
        );

        const currentRelativePath =
            path.join(
                relativePath,
                entry.name
            );


        /* ===============================================
           DIRECTORY
        =============================================== */

        if (entry.isDirectory()) {

            results = results.concat(
                scanImages(
                    fullPath,
                    currentRelativePath
                )
            );

            continue;
        }


        /* ===============================================
           FILE
        =============================================== */

        const extension =
            path.extname(
                entry.name
            ).toLowerCase();


        if (
            !imageExtensions.includes(
                extension
            )
        ) {
            continue;
        }


        const stats =
            fs.statSync(fullPath);


        const normalizedPath =
            path
                .join(
                    "uploads",
                    currentRelativePath
                )
                .replace(/\\/g, "/");


        const pathParts =
            currentRelativePath.split(
                path.sep
            );


        const folder =
            pathParts.length > 1
                ? pathParts[0]
                : "root";


        results.push({

            id: null,

            file_name:
                entry.name,

            original_name:
                entry.name,

            file_path:
                `/${normalizedPath}`,

            folder,

            file_size:
                stats.size,

            created_at:
                stats.birthtime,

            modified_at:
                stats.mtime,

            alt_text: "",

            title: "",
        });
    }


    return results;
};


/* =========================================================
   MULTER STORAGE
========================================================= */

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            let folder =
                req.body.folder ||
                "common";


            /*
             * Prevent "all" from becoming
             * a physical folder.
             */

            if (folder === "all") {
                folder = "common";
            }


            /*
             * Remove unsafe characters.
             */

            folder =
                folder
                    .replace(
                        /[^a-zA-Z0-9_-]/g,
                        ""
                    )
                    .toLowerCase();


            if (!folder) {
                folder = "common";
            }


            const uploadDir =
                path.join(
                    uploadsRoot,
                    folder
                );


            fs.mkdirSync(
                uploadDir,
                {
                    recursive: true,
                }
            );


            cb(
                null,
                uploadDir
            );
        },


        filename: (
            req,
            file,
            cb
        ) => {

            const ext =
                path.extname(
                    file.originalname
                );


            const name =
                path
                    .basename(
                        file.originalname,
                        ext
                    )
                    .replace(
                        /[^a-zA-Z0-9-_]/g,
                        "-"
                    )
                    .toLowerCase();


            cb(
                null,
                `${Date.now()}-${name}${ext}`
            );
        },
    });


/* =========================================================
   MULTER
========================================================= */

const upload =
    multer({

        storage,

        limits: {
            fileSize:
                10 * 1024 * 1024,
        },

        fileFilter: (
            req,
            file,
            cb
        ) => {

            if (
                file.mimetype &&
                file.mimetype.startsWith(
                    "image/"
                )
            ) {
                cb(
                    null,
                    true
                );
            } else {

                cb(
                    new Error(
                        "Only image files are allowed"
                    )
                );
            }
        },
    });


/* =========================================================
   GET FOLDERS

   GET /api/admin/media/folders
========================================================= */

router.get(
    "/admin/media/folders",
    async (req, res) => {

        try {

            const folders =
                getFolders();


            res.json({
                folders,
            });

        } catch (error) {

            console.error(
                "GET MEDIA FOLDERS ERROR:",
                error
            );


            res.status(500).json({
                message:
                    "Failed to load media folders",
            });
        }
    }
);


/* =========================================================
   GET ALL MEDIA

   GET /api/admin/media

   Optional:
   ?folder=programs
   ?folder=services
   ?folder=all
========================================================= */

router.get(
    "/admin/media",
    async (req, res) => {

        try {

            const selectedFolder =
                req.query.folder ||
                "all";


            let images =
                scanImages(
                    uploadsRoot
                );


            /* =============================================
               FOLDER FILTER
            ============================================= */

            if (
                selectedFolder !== "all"
            ) {

                images =
                    images.filter(
                        (image) =>
                            image.folder ===
                            selectedFolder
                    );
            }


            /* =============================================
               SORT NEWEST FIRST
            ============================================= */

            images.sort(
                (a, b) =>
                    new Date(
                        b.modified_at
                    ) -
                    new Date(
                        a.modified_at
                    )
            );


            /* =============================================
               LOAD DATABASE METADATA
            ============================================= */

            try {

                const [
                    mediaRows,
                ] =
                    await pool.execute(
                        `SELECT
                            id,
                            file_path,
                            alt_text,
                            title
                         FROM media`
                    );


                const mediaMap =
                    new Map();


                mediaRows.forEach(
                    (item) => {

                        mediaMap.set(
                            item.file_path,
                            item
                        );
                    }
                );


                images =
                    images.map(
                        (image) => {

                            const metadata =
                                mediaMap.get(
                                    image.file_path
                                );


                            return {

                                ...image,

                                id:
                                    metadata?.id ??
                                    null,

                                alt_text:
                                    metadata?.alt_text ||
                                    "",

                                title:
                                    metadata?.title ||
                                    "",
                            };
                        }
                    );

            } catch (dbError) {

                console.error(
                    "MEDIA METADATA ERROR:",
                    dbError
                );
            }


            res.json(images);

        } catch (error) {

            console.error(
                "GET MEDIA ERROR:",
                error
            );


            res.status(500).json({
                message:
                    "Failed to load media",
            });
        }
    }
);


/* =========================================================
   UPLOAD IMAGE

   POST /api/admin/media
========================================================= */

router.post(
    "/admin/media",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    message:
                        "Please select an image",
                });
            }


            let folder =
                req.body.folder ||
                "common";


            if (folder === "all") {
                folder = "common";
            }


            folder =
                folder
                    .replace(
                        /[^a-zA-Z0-9_-]/g,
                        ""
                    )
                    .toLowerCase();


            if (!folder) {
                folder = "common";
            }


            const filePath =
                `/uploads/${folder}/${req.file.filename}`;


            const altText =
                req.body.alt_text ||
                null;


            const title =
                req.body.title ||
                null;


            /*
             * Store metadata.
             */

            const [
                result,
            ] =
                await pool.execute(
                    `INSERT INTO media
                    (
                        file_name,
                        original_name,
                        file_path,
                        folder,
                        alt_text,
                        title,
                        mime_type,
                        file_size
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        req.file.filename,

                        req.file.originalname,

                        filePath,

                        folder,

                        altText,

                        title,

                        req.file.mimetype,

                        req.file.size,
                    ]
                );


            const [
                rows,
            ] =
                await pool.execute(
                    `SELECT *
                     FROM media
                     WHERE id = ?`,
                    [
                        result.insertId,
                    ]
                );


            res.status(201).json({

                message:
                    "Image uploaded successfully",

                media:
                    rows[0],
            });

        } catch (error) {

            console.error(
                "UPLOAD MEDIA ERROR:",
                error
            );


            res.status(500).json({
                message:
                    "Failed to upload image",
            });
        }
    }
);


/* =========================================================
   DELETE IMAGE

   DELETE /api/admin/media

   Body:
   {
       file_path: "/uploads/services/test.jpg"
   }
========================================================= */

router.delete(
    "/admin/media",
    async (req, res) => {

        try {

            const {
                file_path,
            } = req.body;


            if (!file_path) {

                return res.status(400).json({
                    message:
                        "File path is required",
                });
            }


            /*
             * Protect against deleting
             * something outside uploads.
             */

            const cleanPath =
                file_path
                    .replace(
                        /^\/+/,
                        ""
                    );


            if (
                !cleanPath.startsWith(
                    "uploads/"
                )
            ) {

                return res.status(400).json({
                    message:
                        "Invalid media path",
                });
            }


            const physicalPath =
                path.join(
                    process.cwd(),
                    cleanPath
                );


            if (
                !fs.existsSync(
                    physicalPath
                )
            ) {

                return res.status(404).json({
                    message:
                        "Image file not found",
                });
            }


            /*
             * Delete physical file.
             */

            fs.unlinkSync(
                physicalPath
            );


            /*
             * Delete metadata
             * if it exists.
             */

            await pool.execute(
                `DELETE FROM media
                 WHERE file_path = ?`,
                [
                    file_path,
                ]
            );


            res.json({
                message:
                    "Image deleted successfully",
            });

        } catch (error) {

            console.error(
                "DELETE MEDIA ERROR:",
                error
            );


            res.status(500).json({
                message:
                    "Failed to delete image",
            });
        }
    }
);
router.post("/admin/media/folders", async (req, res) => {
    try {
        let { folder } = req.body;

        if (!folder || !folder.trim()) {
            return res.status(400).json({
                message: "Folder name is required",
            });
        }

        folder = folder
            .trim()
            .replace(/[^a-zA-Z0-9_-]/g, "")
            .toLowerCase();

        if (!folder) {
            return res.status(400).json({
                message: "Invalid folder name",
            });
        }

        const folderPath = path.join(uploadsRoot, folder);

        if (fs.existsSync(folderPath)) {
            return res.status(400).json({
                message: "Folder already exists",
            });
        }

        fs.mkdirSync(folderPath, {
            recursive: true,
        });

        res.status(201).json({
            message: "Folder created successfully",
            folder,
        });
    } catch (error) {
        console.error("CREATE MEDIA FOLDER ERROR:", error);

        res.status(500).json({
            message: "Failed to create folder",
        });
    }
});

export default router;