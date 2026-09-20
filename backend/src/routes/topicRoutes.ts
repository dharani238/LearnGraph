import { Router } from "express";
import Topic from "../models/Topic";

const router = Router();

// GET all topics
// Optional: /api/topics?subjectId=SUBJECT_ID
router.get("/", async (req, res) => {
  try {
    const subjectId = req.query.subjectId;

    if (subjectId) {
      const topics = await Topic.find({
        subjectId: String(subjectId),
      }).sort({ name: 1 });

      return res.json({
        success: true,
        data: topics,
      });
    }

    const topics = await Topic.find().sort({ name: 1 });

    return res.json({
      success: true,
      data: topics,
    });
  } catch (error) {
    console.error("Failed to fetch topics:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch topics",
    });
  }
});

// POST create topic
router.post("/", async (req, res) => {
  try {
    const topic = await Topic.create(req.body);

    return res.status(201).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    console.error("Failed to create topic:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create topic",
    });
  }
});

export default router;