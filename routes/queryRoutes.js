import { Router } from "express";
const router = Router();
import { askQuestion } from "../controllers/queryController.js";

router.post("/", askQuestion);

export default router;