import askAI from "../services/aiService.js";

export async function askQuestion(req, res) {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    const answer = await askAI(question.trim());

    res.json({
      success: true,
      answer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}