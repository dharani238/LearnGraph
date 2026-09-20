import { Router } from "express";
import { generateAiQuestions } from "../controllers/aiQuestionController";

const router = Router();
router.post("/questions", generateAiQuestions);

export default router;
