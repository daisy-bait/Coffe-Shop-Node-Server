import { Router } from "express";
import { createComment, deleteComment, searchCommentsByParams } from "../controllers/comment.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/create/", auth([]), createComment);

router.get("/search/", searchCommentsByParams);

router.delete("/delete/:id", deleteComment);

export default router;