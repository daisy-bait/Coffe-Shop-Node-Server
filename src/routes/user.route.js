import { Router } from "express";
import { loginUser, registerUser, modifyUser, searchUserByParams, verifySession, activateUser, disableUser } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/register/", registerUser);

router.put("/modify/:id", auth(["ADMIN", "CUSTOMER"]), modifyUser);

router.post("/login/", loginUser);

router.get("/search/", searchUserByParams);

router.get("/verify-session/", verifySession);

router.delete("/disable/:id", auth(["ADMIN", "CUSTOMER"]), disableUser);

router.patch("/activate/:id", auth(["ADMIN"]), activateUser);

export default router;