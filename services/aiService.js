import axios from "axios";

const getAIUrl = () => process.env.AI_MICROSERVICE_URL || "http://127.0.0.1:8000";

const askAI = async (question) => {
  const aiUrl = getAIUrl();

  const response = await axios.post(`${aiUrl}/query`, {
    query: question
  });

  return response.data.ans ?? response.data.answer ?? response.data;
};

export default askAI;
