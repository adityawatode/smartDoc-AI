import { Document } from "../models/Document.js";
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

    // Create document
    const newDoc = new Document({
      title,
      uploadedBy,
      fileName: req.file.filename
    });

    // Save in MongoDB
    await newDoc.save();

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${encodeURIComponent(req.file.filename)}`;

    // Process PDF
    await processPDF(req.file.path, fileUrl);

    // Success response
    return res.status(200).json({
      success: true,
      message: "Document uploaded and processed successfully",
      data: newDoc
    });

  } catch (error) {

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
