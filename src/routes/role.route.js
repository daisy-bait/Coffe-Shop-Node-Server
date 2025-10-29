import { Router } from "express";
import {
    getRoleByName,
    createRole
} from "../controllers/role.controller.js"
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.get("/search-by-name/", getRoleByName);

router.post("/create/", auth(["ADMIN"]), createRole);

export default router;