import { Router } from "express";
import { createOrder, modifyOrderStatus } from "../controllers/order.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/create/", auth(["CUSTOMER"]), createOrder);

router.patch("/modify/status/", auth(["ADMIN"]), modifyOrderStatus);

router.get("/search/", auth(["CUSTOMER", "ADMIN"]), createOrder);

export default router;