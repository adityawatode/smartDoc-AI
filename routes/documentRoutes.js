import { Router } from "express";
const router = Router();
import multer, { diskStorage } from "multer";
import { uploadDocument, getDocuments } from "../controllers/documentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const storage = diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.get("/", authMiddleware, getDocuments);
router.post("/upload", authMiddleware, upload.single("file"), uploadDocument);

export default router;