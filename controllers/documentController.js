import { Document } from "../models/Document.js";
import fs from "node:fs/promises";
import path from "node:path";
import cloudinary, { assertCloudinaryConfig } from "../config/cloudinary.js";
import processPDF from "../services/pythonService.js";

const getLocalFileUrl = (fileName) => `/uploads/${encodeURIComponent(fileName)}`;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const uploadsDir = path.resolve("uploads");

const getUploadPath = (fileName) => {
  if (!fileName) return null;

  const resolvedPath = path.resolve(uploadsDir, fileName);
  return resolvedPath.startsWith(uploadsDir) ? resolvedPath : null;
};

const removeLocalFile = async (fileName) => {
  const filePath = getUploadPath(fileName);
  if (filePath) {
    await fs.unlink(filePath).catch(() => {});
  }
};

const removeCloudinaryFile = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" }).catch(() => {});
  }
};

export async function uploadDocument(req, res) {
  try {

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Get title and uploadedBy
    const title =
      req.body.title?.trim() ||
      req.file.originalname ||
      "Untitled Document";

    const uploadedBy =
      req.user?.username ||
      req.body.uploadedBy?.trim() ||
      "anonymous";

    assertCloudinaryConfig();

    const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
      folder: process.env.CLOUDINARY_DOCUMENT_FOLDER || "smartdoc-ai/documents",
      resource_type: "raw",
      use_filename: true,
      unique_filename: true
    });

    // Create document
    const newDoc = new Document({
      title,
      uploadedBy,
      fileName: req.file.originalname,
      fileUrl: getLocalFileUrl(req.file.filename),
      localFileName: req.file.filename,
      cloudinaryUrl: uploadedFile.secure_url,
      cloudinaryPublicId: uploadedFile.public_id
    });

    // Save in MongoDB
    await newDoc.save();

    // Process PDF
    await processPDF(req.file.path, uploadedFile.secure_url);

    // Success response
    return res.status(200).json({
      success: true,
      message: "Document uploaded and processed successfully",
      data: newDoc
    });

  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    console.error("Upload Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

// Get all documents
export async function getDocuments(req, res) {
  try {

    const documents = await Document.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (error) {

    console.error("Fetch Documents Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

export async function getUploadedDocument(req, res, next) {
  try {
    const fileName = req.params.fileName;
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

    const document = await Document.findOne({
      $or: [
        { localFileName: fileName },
        { fileName },
        {
          cloudinaryPublicId: {
            $regex: escapeRegex(fileNameWithoutExt),
            $options: "i"
          }
        }
      ]
    });

    const remoteUrl = document?.cloudinaryUrl ||
      (/^https?:\/\//.test(document?.fileUrl || "") ? document.fileUrl : null);

    if (remoteUrl) {
      return res.redirect(remoteUrl);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export async function updateDocument(req, res) {
  let uploadedFile = null;

  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }

      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    const updates = {};
    const title = req.body.title?.trim();
    const uploadedBy = req.body.uploadedBy?.trim();

    if (title) {
      updates.title = title;
    }

    if (uploadedBy) {
      updates.uploadedBy = uploadedBy;
    }

    if (req.file) {
      assertCloudinaryConfig();

      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_DOCUMENT_FOLDER || "smartdoc-ai/documents",
        resource_type: "raw",
        use_filename: true,
        unique_filename: true
      });

      await processPDF(req.file.path, uploadedFile.secure_url);

      const oldLocalFileName = document.localFileName;
      const oldCloudinaryPublicId = document.cloudinaryPublicId;

      updates.fileName = req.file.originalname;
      updates.fileUrl = getLocalFileUrl(req.file.filename);
      updates.localFileName = req.file.filename;
      updates.cloudinaryUrl = uploadedFile.secure_url;
      updates.cloudinaryPublicId = uploadedFile.public_id;

      Object.assign(document, updates);
      await document.save();

      await removeLocalFile(oldLocalFileName);
      await removeCloudinaryFile(oldCloudinaryPublicId);
    } else {
      Object.assign(document, updates);
      await document.save();
    }

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: document
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    if (uploadedFile?.public_id) {
      await removeCloudinaryFile(uploadedFile.public_id);
    }

    console.error("Update Document Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

export async function deleteDocument(req, res) {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    await removeLocalFile(document.localFileName);
    await removeCloudinaryFile(document.cloudinaryPublicId);
    await document.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (error) {
    console.error("Delete Document Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}
