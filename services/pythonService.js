import axios from "axios";

const processPDF = async (filePath) => {
  await axios.post("http://localhost:8000/process", {
    filePath
  });
};

export default processPDF;