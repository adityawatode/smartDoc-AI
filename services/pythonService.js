import axios from "axios";

const aiUrl = process.env.AI_MICROSERVICE_URL || "http://localhost:8000";

const processPDF = async (filePath) => {
  await axios.post(`${aiUrl}/process`, {
    filePath
  });
};

export default processPDF;