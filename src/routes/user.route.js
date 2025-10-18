import { Router } from "express";
import { registerUser, searchUserByParams } from "../controllers/user.controller";

const router = new Router();

router.post("/register/", registerUser);

router.get("/search/", searchUserByParams);

export default router;