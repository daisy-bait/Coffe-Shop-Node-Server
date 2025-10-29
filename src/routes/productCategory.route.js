import { Router } from "express";
import { getProductCategory, createProductCategory, getAllProductCategories, deleteProductCategory } from "../controllers/productCategory.controller.js"
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/create/", auth(["ADMIN"]), createProductCategory);

router.get("/search/:name", getProductCategory);

router.get("/search", getAllProductCategories);

router.delete("/delete/:id", auth(["ADMIN"]), deleteProductCategory);

export default router;