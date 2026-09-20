import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import subjectRoutes from "./routes/subjectRoutes";
import topicRoutes from "./routes/topicRoutes";
import conceptRoutes from "./routes/conceptRoutes";
import questionRoutes from "./routes/questionRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";
import aiRoutes from "./routes/aiRoutes";
import aiQuestionRoutes from "./routes/aiQuestionRoutes";
import authRoutes from "./routes/authRoutes";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --------------------------------------------------
// Basic routes
// --------------------------------------------------

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "LearnGraph backend is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "LearnGraph API is healthy",
  });
});

// --------------------------------------------------
// API routes
// --------------------------------------------------

app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/concepts", conceptRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", aiQuestionRoutes);
app.use("/api/auth", authRoutes);

// --------------------------------------------------
// Start server
// --------------------------------------------------

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `LearnGraph backend running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
};

startServer();