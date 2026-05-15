import axios from "axios";

const aiUrl = process.env.AI_MICROSERVICE_URL || "http://localhost:8000";

const askAI = async (question) => {
  const response = await axios.post(`${aiUrl}/ask`, {
    question
  });

<<<<<<< HEAD
  return response.data.answer ?? response.data;
=======
  return response.data;
>>>>>>> 19a7afb44ac6c861223453c03033db06a142d84e
};

export default askAI;