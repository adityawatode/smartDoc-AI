import axios from "axios";

const getAIUrl = () => process.env.AI_MICROSERVICE_URL || "http://127.0.0.1:8000";

const askAI = async (question) => {
  const aiUrl = getAIUrl();

  try {
    const response = await axios.post(`${aiUrl}/query`, {
      query: question
    });

    return response.data.ans ?? response.data.answer ?? response.data;
  } catch (error) {
    const status = error.response?.status;
    const responseDetails = error.response?.data?.message || error.response?.data;
    const details = typeof responseDetails === "object"
      ? JSON.stringify(responseDetails)
      : responseDetails || error.message;
    const message = status
      ? `AI microservice returned ${status} from /query: ${details}`
      : `AI microservice is not reachable at ${aiUrl}. Start it or set AI_MICROSERVICE_URL. Details: ${details}`;

    const serviceError = new Error(message);
    serviceError.statusCode = 502;
    throw serviceError;
  }
};

export default askAI;
