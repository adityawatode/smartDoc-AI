import axios from "axios";

const aiUrl = process.env.AI_MICROSERVICE_URL || "http://localhost:8000";

const askAI = async (question) => {
  const response = await axios.post(`${aiUrl}/ask`, {
    question
  });

  return response.data.answer ?? response.data;
};

export default askAI;