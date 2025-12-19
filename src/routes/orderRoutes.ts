import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderControllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/my", authMiddleware, getUserOrders);

router.post("/", authMiddleware, createOrder);

export default router;
