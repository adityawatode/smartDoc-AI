import { Document } from "../models/Document.js";
import processPDF from "../services/pythonService.js";

export async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const newDoc = new Document({
      title: req.body.title,
      uploadedBy: req.user?.id || req.body.uploadedBy,
      fileName: req.file.filename
    });

    await newDoc.save();

    await processPDF(req.file.path);

    res.json({
      success: true,
      message: "Document uploaded and processed",
      data: newDoc
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function getDocuments(req, res) {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}