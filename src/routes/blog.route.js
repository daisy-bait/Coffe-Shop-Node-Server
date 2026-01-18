import { Router } from "express";
import { createBlog, deleteBlogById, searchBlogByParams } from "../controllers/blog.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/create/", auth([]), createBlog);

router.get("/search/", searchBlogByParams);

router.delete("/delete/:id", deleteBlogById);

export default router;