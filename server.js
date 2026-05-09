import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";

config();

// Connect to DB but don't wait for it - let server start anyway
connectDB().catch(err => console.error("DB Connection Error:", err));

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

const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running", port: PORT });
});

app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/documents", (await import("./routes/documentRoutes.js")).default);
app.use("/api/query", (await import("./routes/queryRoutes.js")).default);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

