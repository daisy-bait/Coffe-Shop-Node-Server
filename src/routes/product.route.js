import { Router } from "express";
import { createProduct, modifyProduct, searchProductsByParams, activateProduct, disableProduct } from "../controllers/product.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/create/", auth(["ADMIN"]), createProduct);

router.put("/modify/:id", auth(["ADMIN"]), modifyProduct);

router.get("/search/", searchProductsByParams);

router.patch("/activate/:id", auth(["ADMIN"]), activateProduct);

router.delete("/disable/:id", auth(["ADMIN"]), disableProduct);

export default router;