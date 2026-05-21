import { Router } from "express";
import multer, { diskStorage } from "multer";
import { getUsers, suspendUser, activateUser } from "../controllers/adminController.js";
import { updateDocument, deleteDocument } from "../controllers/documentController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

const storage = diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

const optionalDocumentUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file && Array.isArray(req.files) && req.files.length > 0) {
      req.file = req.files[0];
    }

    next();
  });
};

router.use(protect, requireAdmin);

router.get("/users", getUsers);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/activate", activateUser);

router.patch("/documents/:id", optionalDocumentUpload, updateDocument);
router.delete("/documents/:id", deleteDocument);

export default router;
