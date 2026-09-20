import { Router } from "express";
import mongoose from "mongoose";
import Concept from "../models/Concept";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const topicId = req.query.topicId;

    if (topicId) {
      const topicIdString = String(topicId);

      if (!mongoose.Types.ObjectId.isValid(topicIdString)) {
        return res.status(400).json({
          success: false,
          message: "Invalid topicId",
        });
      }

      const concepts = await Concept.find({
        topicId: new mongoose.Types.ObjectId(topicIdString),
      })
        .populate("prerequisites", "name")
        .sort({ order: 1 });

      return res.json({
        success: true,
        data: concepts,
      });
    }

    const concepts = await Concept.find()
      .populate("prerequisites", "name")
      .sort({ order: 1 });

    return res.json({
      success: true,
      data: concepts,
    });
  } catch (error) {
    console.error("Failed to fetch concepts:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch concepts",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const concept = await Concept.create(req.body);

    return res.status(201).json({
      success: true,
      data: concept,
    });
  } catch (error) {
    console.error("Failed to create concept:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create concept",
    });
  }
});

export default router;