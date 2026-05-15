import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";

config();

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });
}

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://noticeai-frontend-1.onrender.com";
const allowedOrigins = isProduction
  ? [FRONTEND_URL]
  : [FRONTEND_URL, "http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/query", queryRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database connection error.", error.message);
    process.exit(1);
  }
};

startServer();

