import { Router } from "express";
import { getProductCategory, createProductCategory, getAllProductCategories } from "../controllers/productCategory.controller.js"

const router = new Router();

router.post("/create/", createProductCategory);

router.get("/search/:name", getProductCategory);

router.get("/search", getAllProductCategories);

export default router;