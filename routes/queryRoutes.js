import { Router } from "express";
const router = Router();
import { askQuestion } from "../controllers/queryController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, askQuestion);

export default router;
