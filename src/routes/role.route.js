import { Router } from "express";
import {
    getRoleByName,
    createRole
} from "../controllers/role.controller.js"

const router = new Router();

router.get("/search-by-name/", getRoleByName);

router.post("/create/", createRole);

export default router;