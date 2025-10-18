import { Router } from "express";
import { loginUser, registerUser, searchUserByParams } from "../controllers/user.controller.js";

const router = new Router();

router.post("/register/", registerUser);

router.post("/login/", loginUser);

router.get("/search/", searchUserByParams);

export default router;