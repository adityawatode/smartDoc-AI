import { Router } from "express";
const router = Router();
import { register, login, me } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

export default router;
