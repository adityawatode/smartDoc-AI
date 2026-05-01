import { Document } from "../models/Document.js";
import processPDF from "../services/pythonService.js";

export async function uploadDocument(req, res) {
  try {
    const newDoc = new Document({
      title: req.body.title,
      uploadedBy: req.body.uploadedBy,
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