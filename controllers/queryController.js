import askAI from "../services/aiservice.js";

export async function askQuestion(req, res) {
  try {
    const { question } = req.body;

    const answer = await askAI(question);

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