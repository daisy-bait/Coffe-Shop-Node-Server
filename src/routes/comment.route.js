import { Router } from "express";
import { createComment, searchCommentsByParams } from "../controllers/comment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/create/", auth([]), createComment);

router.get("/search/", searchCommentsByParams);

export default router;