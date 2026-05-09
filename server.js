import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";

config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "https://noticeai-frontend-1.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(json());

app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/documents", (await import("./routes/documentRoutes.js")).default);
app.use("/api/query", (await import("./routes/queryRoutes.js")).default);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

