import { Router } from "express";
import mongoose from "mongoose";

import Question from "../models/Question";
import Concept from "../models/Concept";
import Assessment from "../models/Assessment";
import { findRootGap } from "../services/rootGapService";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/authMiddleware";

const router = Router();

const WEAK_THRESHOLD = 60;

interface SubmittedAnswer {
  questionId: string;
  selectedAnswer: number;
}

// =====================================================
// ANALYZE ASSESSMENT
// =====================================================

router.post(
  "/analyze",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      // -----------------------------------------
      // Make sure logged-in user exists
      // -----------------------------------------

      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const {
        answers,
        type = "diagnostic",
        topicId,
      }: {
        answers: SubmittedAnswer[];
        type?: "diagnostic" | "reassessment";
        topicId?: string;
      } = req.body;

      // -----------------------------------------
      // Validate answers
      // -----------------------------------------

      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Answers are required",
        });
      }

      // -----------------------------------------
      // Validate question IDs
      // -----------------------------------------

      const questionIds = answers
        .map((answer) => answer.questionId)
        .filter((id) => mongoose.Types.ObjectId.isValid(id));

      if (questionIds.length !== answers.length) {
        return res.status(400).json({
          success: false,
          message: "One or more question IDs are invalid",
        });
      }

      // -----------------------------------------
      // Load actual questions
      // -----------------------------------------

      const questions = await Question.find({
        _id: {
          $in: questionIds.map(
            (id) => new mongoose.Types.ObjectId(id)
          ),
        },
      });

      if (questions.length !== answers.length) {
        return res.status(400).json({
          success: false,
          message: "One or more questions were not found",
        });
      }

      // -----------------------------------------
      // Evaluate answers
      // -----------------------------------------

      const evaluatedAnswers = answers.map((submitted) => {
        const question = questions.find(
          (item) =>
            item._id.toString() === submitted.questionId
        );

        if (!question) {
          throw new Error(
            `Question ${submitted.questionId} not found`
          );
        }

        const correct =
          Number(submitted.selectedAnswer) ===
          question.correctAnswer;

        return {
          questionId: question._id,
          selectedAnswer: Number(submitted.selectedAnswer),
          correct,
          conceptId: question.conceptId,
        };
      });

      // -----------------------------------------
      // Get concept IDs
      // -----------------------------------------

      const conceptIds = [
        ...new Set(
          evaluatedAnswers.map((answer) =>
            answer.conceptId.toString()
          )
        ),
      ];

      // -----------------------------------------
      // Load concepts
      // -----------------------------------------

      const concepts = await Concept.find({
        _id: {
          $in: conceptIds.map(
            (id) => new mongoose.Types.ObjectId(id)
          ),
        },
      }).populate(
        "prerequisites",
        "name description order prerequisites"
      );

      // -----------------------------------------
      // Calculate concept scores
      // -----------------------------------------

      const conceptScores = concepts.map((concept) => {
        const conceptAnswers =
          evaluatedAnswers.filter(
            (answer) =>
              answer.conceptId.toString() ===
              concept._id.toString()
          );

        const correct = conceptAnswers.filter(
          (answer) => answer.correct
        ).length;

        const total = conceptAnswers.length;

        const score =
          total === 0
            ? 0
            : Math.round((correct / total) * 100);

        return {
          conceptId: concept._id.toString(),
          conceptName: concept.name,
          score,
          correct,
          total,
        };
      });

      // -----------------------------------------
      // Find weak concepts
      // -----------------------------------------

      const weakConcepts = conceptScores.filter(
        (item) => item.score < WEAK_THRESHOLD
      );

      // -----------------------------------------
      // Find ROOT GAP
      // -----------------------------------------

      const rootGap = await findRootGap(
        conceptScores
      );

      // -----------------------------------------
      // Overall score
      // -----------------------------------------

      const totalCorrect =
        evaluatedAnswers.filter(
          (answer) => answer.correct
        ).length;

      const overallScore =
        evaluatedAnswers.length === 0
          ? 0
          : Math.round(
              (totalCorrect /
                evaluatedAnswers.length) *
                100
            );

      // -----------------------------------------
      // SAVE ASSESSMENT FOR LOGGED-IN USER
      // -----------------------------------------

      const assessment = await Assessment.create({
        userId: new mongoose.Types.ObjectId(
          req.userId
        ),

        type,

        topicId:
          topicId &&
          mongoose.Types.ObjectId.isValid(topicId)
            ? new mongoose.Types.ObjectId(topicId)
            : undefined,

        answers: evaluatedAnswers.map((answer) => ({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          correct: answer.correct,
        })),

        conceptScores,

        rootGap: rootGap
          ? new mongoose.Types.ObjectId(rootGap.id)
          : undefined,

        rootGapName: rootGap?.name,

        overallScore,
      });

      // -----------------------------------------
      // Response
      // -----------------------------------------

      return res.json({
        success: true,

        data: {
          assessmentId: assessment._id,

          overallScore,

          rootGap: rootGap
            ? {
                id: rootGap.id,
                name: rootGap.name,
                description: rootGap.description,
              }
            : null,

          conceptScores,

          weakConcepts,

          evaluatedAnswers,
        },
      });
    } catch (error) {
      console.error(
        "Assessment analysis failed:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to analyze assessment",
      });
    }
  }
);

// =====================================================
// GET LATEST ASSESSMENT FOR LOGGED-IN USER
// =====================================================

router.get(
  "/latest",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const assessment =
        await Assessment.findOne({
          userId: new mongoose.Types.ObjectId(
            req.userId
          ),
        })
          .sort({ createdAt: -1 })
          .populate(
            "rootGap",
            "name description"
          );

      return res.json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      console.error(
        "Failed to fetch latest assessment:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch assessment",
      });
    }
  }
);

// =====================================================
// GET ASSESSMENT HISTORY FOR LOGGED-IN USER
// =====================================================

router.get(
  "/history",
  authenticate,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const assessments =
        await Assessment.find({
          userId: new mongoose.Types.ObjectId(
            req.userId
          ),
        })
          .sort({ createdAt: -1 })
          .populate(
            "rootGap",
            "name description"
          );

      return res.json({
        success: true,
        data: assessments,
      });
    } catch (error) {
      console.error(
        "Failed to fetch assessment history:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch assessment history",
      });
    }
  }
);

export default router;