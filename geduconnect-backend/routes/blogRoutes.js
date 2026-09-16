import express from "express";

import {
    getBlogsAdmin,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogsPublic,
    getBlogBySlug
} from "../controllers/blogController.js";

import { protect } from "../middleware/authMiddleware.js";
import createUploader from "../middleware/uploadServiceImage.js";

const router = express.Router();

const uploadBlog = createUploader("blogs");

router.get(
    "/admin/blogs",
    protect,
    getBlogsAdmin
);

router.post(
    "/admin/blogs",
    protect,
    uploadBlog.fields([
        {
            name: "thumbnail_image",
            maxCount: 1
        },
        {
            name: "hero_image",
            maxCount: 1
        }
    ]),
    createBlog
);

router.put(
    "/admin/blogs/:id",
    protect,
    uploadBlog.fields([
        {
            name: "thumbnail_image",
            maxCount: 1
        },
        {
            name: "hero_image",
            maxCount: 1
        }
    ]),
    updateBlog
);

router.delete(
    "/admin/blogs/:id",
    protect,
    deleteBlog
);

router.get(
    "/public/blogs",
    getBlogsPublic
);

router.get(
    "/public/blogs/:slug",
    getBlogBySlug
);

export default router;