import express from "express";
import { createOrder } from "../controllers/orderControllers.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);

export default router;
