import axios from "axios";
import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";

const getAIUrl = () => process.env.AI_MICROSERVICE_URL || "http://127.0.0.1:8000";

const extractTextFromPDF = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  try {
    const { text } = await parser.getText();
    return text.trim();
  } finally {
    await parser.destroy();
  }
};

const processPDF = async (filePath, link = filePath) => {
  const aiUrl = getAIUrl();

  try {
    const cleanedText = await extractTextFromPDF(filePath);

    if (!cleanedText) {
      const emptyPdfError = new Error("Could not extract text from this PDF.");
      emptyPdfError.statusCode = 400;
      throw emptyPdfError;
    }

    await axios.post(`${aiUrl}/admin/upload`, {
      text: cleanedText,
      link
    });
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const status = error.response?.status;
    const responseDetails = error.response?.data?.message || error.response?.data;
    const details = typeof responseDetails === "object"
      ? JSON.stringify(responseDetails)
      : responseDetails || error.message;
    const message = status
      ? `AI microservice returned ${status} from /admin/upload: ${details}`
      : `AI microservice is not reachable at ${aiUrl}. Start it or set AI_MICROSERVICE_URL. Details: ${details}`;

    const serviceError = new Error(message);
    serviceError.statusCode = 502;
    throw serviceError;
  }
};

export default processPDF;
