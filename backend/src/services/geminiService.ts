import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
  apiKey,
});

export interface LearningContent {
  explanation: string;
  keyPoints: string[];
  example: string;
  commonMistake: string;
  learningTip: string;
}

/*
 * Wait before retrying a temporary Gemini error.
 */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/*
 * Generate content using one Gemini model.
 */
async function generateWithModel(
  model: string,
  prompt: string
): Promise<LearningContent> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          explanation: {
            type: "string",
          },

          keyPoints: {
            type: "array",
            items: {
              type: "string",
            },
          },

          example: {
            type: "string",
          },

          commonMistake: {
            type: "string",
          },

          learningTip: {
            type: "string",
          },
        },

        required: [
          "explanation",
          "keyPoints",
          "example",
          "commonMistake",
          "learningTip",
        ],
      },
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error(
      "Gemini returned an empty response"
    );
  }

  return JSON.parse(text) as LearningContent;
}

/*
 * Main AI learning-content generator.
 */
export async function generateLearningContent(
  conceptName: string,
  conceptDescription: string
): Promise<LearningContent> {
  const prompt = `
You are an AI tutor inside LearnGraph,
a personalized learning platform.

The student has a learning gap in this concept.

Concept:
${conceptName}

Concept description:
${conceptDescription}

Create beginner-friendly learning content.

Requirements:

1. Explain the concept in very simple language.
2. Give exactly 3 important key points.
3. Give one practical programming example.
4. Explain one common mistake students make.
5. Give one short learning tip.

The student may be a beginner.

Avoid unnecessarily complex terminology.

Return only structured JSON matching the
provided response schema.
`;

  /*
   * First model.
   */
  const primaryModel = "gemini-3.8-flash";

  /*
   * Fallback model.
   *
   * Gemini 3.6 Flash is also a stable Flash model.
   */
  const fallbackModel = "gemini-3.6-flash";

  // -----------------------------------------
  // Try primary model up to 3 times
  // -----------------------------------------

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(
        `Gemini ${primaryModel} attempt ${attempt}/3`
      );

      return await generateWithModel(
        primaryModel,
        prompt
      );
    } catch (error: any) {
      console.error(
        `Gemini ${primaryModel} attempt ${attempt} failed:`,
        error?.status || error?.message || error
      );

      /*
       * Retry only for temporary server errors.
       */
      const status = error?.status;

      if (
        status !== 503 &&
        status !== 429 &&
        status !== 500 &&
        status !== 502 &&
        status !== 504
      ) {
        break;
      }

      /*
       * Exponential backoff:
       *
       * attempt 1 → 2 seconds
       * attempt 2 → 4 seconds
       * attempt 3 → then fallback
       */
      if (attempt < 3) {
        const delay = 2000 * Math.pow(2, attempt - 1);

        console.log(
          `Waiting ${delay}ms before retry...`
        );

        await wait(delay);
      }
    }
  }

  // -----------------------------------------
  // Fallback model
  // -----------------------------------------

  try {
    console.log(
      `Trying fallback model: ${fallbackModel}`
    );

    return await generateWithModel(
      fallbackModel,
      prompt
    );
  } catch (error: any) {
    console.error(
      `Fallback Gemini model failed:`,
      error?.status || error?.message || error
    );

    throw new Error(
      "Gemini is temporarily unavailable. Please try again."
    );
  }
}