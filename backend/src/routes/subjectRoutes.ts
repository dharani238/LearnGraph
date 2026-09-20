import { Router } from "express";
import Subject from "../models/Subject";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });

    res.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create subject",
    });
  }
});

export default router;