import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers.js";
import { authMiddleware, authorize } from "../middlewares/auth.js";
import { UserRole } from "../entities/User.js";

const router = Router();

router.post("/", authMiddleware, authorize(UserRole.ADMIN), createProduct);
router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById);
router.put("/:id", authMiddleware, authorize(UserRole.ADMIN), updateProduct);
router.delete("/:id", authMiddleware, authorize(UserRole.ADMIN), deleteProduct);

export default router;
