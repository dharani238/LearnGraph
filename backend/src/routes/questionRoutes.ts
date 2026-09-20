import { Router } from "express";
import mongoose from "mongoose";
import Question from "../models/Question";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const conceptId = req.query.conceptId;

    if (conceptId) {
      const conceptIdString = String(conceptId);

      if (!mongoose.Types.ObjectId.isValid(conceptIdString)) {
        return res.status(400).json({
          success: false,
          message: "Invalid conceptId",
        });
      }

      const questions = await Question.find({
        conceptId: new mongoose.Types.ObjectId(conceptIdString),
      }).select("-correctAnswer");

      return res.json({
        success: true,
        data: questions,
      });
    }

    const questions = await Question.find().select("-correctAnswer");

    return res.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Failed to fetch questions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const question = await Question.create(req.body);

    return res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Failed to create question:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create question",
    });
  }
});

export default router;