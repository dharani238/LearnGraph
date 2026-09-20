import { Router } from "express";

import Concept from "../models/Concept";
import { generateLearningContent } from "../services/geminiService";

const router = Router();

/*
 * Generate AI learning content for a concept
 *
 * POST /api/ai/learning
 *
 * Body:
 * {
 *   "conceptId": "..."
 * }
 */
router.post("/learning", async (req, res) => {
  try {
    const { conceptId } = req.body;

    if (!conceptId) {
      return res.status(400).json({
        success: false,
        message: "conceptId is required",
      });
    }

    // -----------------------------------------
    // Find concept
    // -----------------------------------------

    const concept = await Concept.findById(
      conceptId
    );

    if (!concept) {
      return res.status(404).json({
        success: false,
        message: "Concept not found",
      });
    }

    // -----------------------------------------
    // Generate AI content
    // -----------------------------------------

    const learningContent =
      await generateLearningContent(
        concept.name,
        concept.description
      );

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return res.json({
      success: true,

      data: {
        concept: {
          id: concept._id,
          name: concept.name,
          description: concept.description,
        },

        learningContent,
      },
    });
  } catch (error) {
    console.error(
      "AI learning generation failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate AI learning content",
    });
  }
});

export default router;