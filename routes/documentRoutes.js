import { Router } from "express";
const router = Router();
import multer, { diskStorage } from "multer";
import { uploadDocument, getDocuments } from "../controllers/documentController.js";
import { protect } from "../middleware/authMiddleware.js";

const storage = diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const uploadMiddleware = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file && Array.isArray(req.files) && req.files.length > 0) {
      req.file = req.files[0];
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Use multipart/form-data with a file field."
      });
    }

    next();
  });
};

router.get("/", getDocuments);
router.get("/list", getDocuments);
router.post("/upload", protect, uploadMiddleware, uploadDocument);
router.post("/", protect, uploadMiddleware, uploadDocument);

export default router;
