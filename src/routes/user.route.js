import { Router } from "express";
import { loginUser, registerUser, searchUserByParams, verifySession } from "../controllers/user.controller.js";

const router = new Router();

router.post("/register/", registerUser);

router.post("/login/", loginUser);

router.get("/search/", searchUserByParams);

router.post("/verify-session/", verifySession);

export default router;