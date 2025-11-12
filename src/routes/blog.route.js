import { Router } from "express";
import { createBlog } from "../controllers/blog.controller";

const router = new Router();

router.post("/create/", createBlog);

export default router;