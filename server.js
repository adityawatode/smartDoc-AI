import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";

config();
connectDB();

const app = express();

app.use(cors());
app.use(json());

app.use("/api/auth", (await import("./routes/authRoutes.js")).default);
app.use("/api/documents", (await import("./routes/documentRoutes.js")).default);
app.use("/api/query", (await import("./routes/queryRoutes.js")).default);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

