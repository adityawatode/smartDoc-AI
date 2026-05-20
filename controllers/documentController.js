import { Document } from "../models/Document.js";
import fs from "node:fs/promises";
import cloudinary, { assertCloudinaryConfig } from "../config/cloudinary.js";
import processPDF from "../services/pythonService.js";

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
      fileUrl: uploadedFile.secure_url,
      cloudinaryPublicId: uploadedFile.public_id
    });

    // Save in MongoDB
    await newDoc.save();

    // Process PDF
    await processPDF(req.file.path, uploadedFile.secure_url);

    await fs.unlink(req.file.path).catch(() => {});

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
