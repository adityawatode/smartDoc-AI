import axios from "axios";

const askAI = async (question) => {
  const response = await axios.post("http://localhost:8000/ask", {
    question
  });

  return response.data;
};

export default askAI;