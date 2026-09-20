import { Request, Response } from "express";
import Concept from "../models/Concept";
import Question from "../models/Question";
import Topic from "../models/Topic";
import { generateQuestionsWithGemini } from "../services/geminiQuestionService";

export async function generateAiQuestions(req: Request, res: Response) {
  try {
    const { topicId, conceptIds, countPerConcept = 2, mode = "diagnostic" } = req.body;

    if (!Array.isArray(conceptIds) || conceptIds.length === 0) {
      return res.status(400).json({ success: false, message: "conceptIds is required." });
    }

    const concepts = await Concept.find({ _id: { $in: conceptIds } }).sort({ order: 1 });
    if (concepts.length === 0) {
      return res.status(404).json({ success: false, message: "No concepts found." });
    }

    const resolvedTopicId = topicId || concepts[0].topicId;
    const topic = await Topic.findById(resolvedTopicId);
    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found." });
    }

    const previous = await Question.find({ conceptId: { $in: conceptIds } })
      .sort({ _id: -1 })
      .limit(40)
      .select("question");

    const conceptPayload = concepts.map((concept: any) => ({
      id: String(concept._id),
      name: concept.name,
      description: concept.description,
      prerequisites: (concept.prerequisites || []).map((p: any) => p.name || String(p)),
    }));

    const generated = await generateQuestionsWithGemini({
      topicName: topic.name,
      topicDescription: topic.description,
      concepts: conceptPayload,
      countPerConcept: Number(countPerConcept),
      mode,
      avoidQuestions: previous.map((q: any) => q.question),
    });

    const saved = await Question.insertMany(
      generated.map((question) => ({
        conceptId: question.conceptId,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        difficulty: question.difficulty,
      }))
    );

    return res.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("AI question generation error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate AI questions.",
    });
  }
}
