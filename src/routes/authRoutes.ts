import { Router } from "express";
import {
  signup,
  signin,
  getLoggedInUser,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authMiddleware, getLoggedInUser);

export default router;
