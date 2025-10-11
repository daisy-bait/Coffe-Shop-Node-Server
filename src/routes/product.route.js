import { Router } from "express";
import { createProduct, getProduct } from "../controllers/product.controller.js";

const router = new Router();

router.get("/search/:id", getProduct);

router.post("/create/", createProduct);

export default router;