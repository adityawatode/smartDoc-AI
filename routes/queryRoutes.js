import { Router } from "express";
const router = Router();
import { askQuestion } from "../controllers/queryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

router.post("/", authMiddleware, askQuestion);

export default router;