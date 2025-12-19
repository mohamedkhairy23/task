import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.js";
import {
  addCreditCard,
  deleteCreditCard,
  getLoggedInUserCreditCards,
} from "../controllers/creditCardControllers.js";

const router = Router();

router.post("/", authMiddleware, addCreditCard);
router.delete("/", authMiddleware, deleteCreditCard);
router.get("/me", authMiddleware, getLoggedInUserCreditCards);

export default router;
