import { GoogleGenAI } from "@google/genai";

export type GeneratedQuestion = {
  conceptId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({ apiKey });

const primaryModel =
  process.env.GEMINI_MODEL || "gemini-3.8-flash";

const fallbackModel =
  process.env.GEMINI_FALLBACK_MODEL || "gemini-3.6-flash";

function extractJson(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const first = cleaned.indexOf("[");
  const last = cleaned.lastIndexOf("]");

  if (first >= 0 && last > first) {
    return JSON.parse(cleaned.slice(first, last + 1));
  }

  return JSON.parse(cleaned);
}

function validate(
  items: unknown,
  allowedConceptIds: Set<string>
): GeneratedQuestion[] {
  if (!Array.isArray(items)) {
    throw new Error("Gemini did not return a question array.");
  }

  return items.map((item: any, index) => {
    if (
      !item ||
      !allowedConceptIds.has(String(item.conceptId))
    ) {
      throw new Error(
        `Invalid conceptId in Gemini question ${index + 1}.`
      );
    }

    if (
      typeof item.question !== "string" ||
      item.question.trim().length < 10
    ) {
      throw new Error(
        `Invalid question text in Gemini question ${index + 1}.`
      );
    }

    if (
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      item.options.some(
        (x: any) => typeof x !== "string"
      )
    ) {
      throw new Error(
        `Question ${index + 1} must contain exactly four options.`
      );
    }

    const correctAnswer = Number(item.correctAnswer);

    if (
      !Number.isInteger(correctAnswer) ||
      correctAnswer < 0 ||
      correctAnswer > 3
    ) {
      throw new Error(
        `Question ${index + 1} has an invalid correctAnswer.`
      );
    }

    const difficulty = [
      "Beginner",
      "Intermediate",
      "Advanced",
    ].includes(item.difficulty)
      ? item.difficulty
      : "Intermediate";

    return {
      conceptId: String(item.conceptId),
      question: item.question.trim(),
      options: item.options.map((x: string) => x.trim()),
      correctAnswer,
      difficulty,
    };
  });
}

export async function generateQuestionsWithGemini(params: {
  topicName: string;
  topicDescription: string;
  concepts: Array<{
    id: string;
    name: string;
    description: string;
    prerequisites: string[];
  }>;
  countPerConcept: number;
  mode: "diagnostic" | "reassessment" | "practice";
  avoidQuestions: string[];
}): Promise<GeneratedQuestion[]> {
  const allowedConceptIds = new Set(
    params.concepts.map((x) => x.id)
  );

  const count = Math.max(
    1,
    Math.min(4, params.countPerConcept)
  );

  const total = params.concepts.length * count;

  const variationSeed = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;

  const prompt = `
You are the assessment-generation engine for LearnGraph, a prerequisite-aware learning platform.

Generate a fresh multiple-choice assessment for the topic below.

TOPIC: ${params.topicName}

TOPIC DESCRIPTION: ${params.topicDescription}

MODE: ${params.mode}

VARIATION SEED: ${variationSeed}

CONCEPTS:
${params.concepts
  .map(
    (c) =>
      `- id=${c.id}; name=${c.name}; description=${c.description}; prerequisites=${c.prerequisites.join(", ") || "none"}`
  )
  .join("\n")}

Generate exactly ${total} questions:
${count} questions for each concept.

Rules:

1. Every question must test understanding, not trivia or memorization.
2. Make questions appropriate for a beginner/intermediate learner.
3. For diagnostic mode, include prerequisite-focused questions that help reveal the earliest missing concept.
4. For reassessment mode, use different wording, examples, and reasoning paths from previous questions.
5. For practice mode, focus tightly on the selected concept and vary difficulty.
6. Each question must have exactly 4 plausible options and exactly one correct answer.
7. Avoid ambiguous wording, duplicate options, and trick questions.
8. Return ONLY valid JSON. No markdown and no explanation.
9. Use the exact concept id supplied above.

Previously used questions to avoid repeating:
${
  params.avoidQuestions
    .slice(0, 40)
    .map((q) => `- ${q}`)
    .join("\n") || "- none"
}

JSON shape:

[
  {
    "conceptId": "exact-id",
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": 0,
    "difficulty": "Beginner|Intermediate|Advanced"
  }
]
`;

  async function call(model: string) {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    return validate(
      extractJson(response.text || ""),
      allowedConceptIds
    );
  }

  async function sleep(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }

  async function callWithRetry(
    model: string,
    attempts = 3
  ): Promise<GeneratedQuestion[]> {
    let lastError: any;

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(
          `Gemini question generation: ${model} attempt ${attempt}/${attempts}`
        );

        return await call(model);
      } catch (error: any) {
        lastError = error;

        const status =
          error?.status ??
          error?.error?.code ??
          error?.code;

        console.warn(
          `Gemini ${model} attempt ${attempt} failed:`,
          error
        );

        /*
         * IMPORTANT:
         * 429 = quota/rate limit exceeded.
         * Retrying immediately will not solve the problem.
         */
        if (status === 429) {
          console.warn(
            `Gemini ${model} quota exceeded. Skipping retries.`
          );

          throw error;
        }

        /*
         * Authentication / permission errors should
         * also not be retried.
         */
        if (status === 401 || status === 403) {
          console.warn(
            `Gemini ${model} authentication/permission error.`
          );

          throw error;
        }

        /*
         * Retry temporary server errors such as 503.
         */
        if (attempt < attempts) {
          const delay = attempt * 3000;

          console.log(
            `Temporary Gemini error. Waiting ${delay}ms before retry...`
          );

          await sleep(delay);
        }
      }
    }

    throw lastError;
  }

  try {
    return await callWithRetry(primaryModel, 3);
  } catch (primaryError: any) {
    console.warn(
      `Primary Gemini model failed: ${primaryModel}`,
      primaryError
    );

    const primaryStatus =
      primaryError?.status ??
      primaryError?.error?.code ??
      primaryError?.code;

    /*
     * If primary model hit quota, try fallback once.
     * The fallback has its own quota.
     */
    try {
      console.log(
        `Trying fallback Gemini model: ${fallbackModel}`
      );

      return await callWithRetry(fallbackModel, 3);
    } catch (fallbackError: any) {
      console.error(
        `Fallback Gemini model also failed: ${fallbackModel}`,
        fallbackError
      );

      const fallbackStatus =
        fallbackError?.status ??
        fallbackError?.error?.code ??
        fallbackError?.code;

      /*
       * Give the frontend a useful message when
       * Gemini quota is exhausted.
       */
      if (
        primaryStatus === 429 ||
        fallbackStatus === 429
      ) {
        throw new Error(
          "Gemini API quota has been exceeded. Please wait for the quota to reset or use another Gemini API project."
        );
      }

      /*
       * Authentication / API key issue.
       */
      if (
        primaryStatus === 401 ||
        primaryStatus === 403 ||
        fallbackStatus === 401 ||
        fallbackStatus === 403
      ) {
        throw new Error(
          "Gemini API authentication failed. Please check the GEMINI_API_KEY in the backend .env file."
        );
      }

      /*
       * Other temporary Gemini failures.
       */
      throw new Error(
        "Gemini is temporarily unavailable. Please try again later."
      );
    }
  }
}