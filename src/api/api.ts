const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

// =====================================================
// TYPES
// =====================================================

export interface Subject {
  _id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Topic {
  _id: string;
  subjectId: string;
  name: string;
  description: string;
  difficulty: string;
}

export interface Concept {
  _id: string;
  topicId: string;
  name: string;
  description: string;
  order: number;
  prerequisites: Array<{
    _id: string;
    name: string;
    order?: number;
  }>;
}

export interface Question {
  _id: string;
  conceptId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
}

export interface ConceptScore {
  conceptId: string;
  conceptName: string;
  score: number;
  correct: number;
  total: number;
}

export interface AssessmentResult {
  assessmentId: string;
  overallScore: number;

  rootGap: {
    id: string;
    name: string;
    description: string;
  } | null;

  conceptScores: ConceptScore[];

  weakConcepts: ConceptScore[];

  evaluatedAnswers?: Array<{
    questionId: string;
    selectedAnswer: number;
    correct: boolean;
    conceptId: string;
  }>;
}

export interface LearningContent {
  explanation: string;
  keyPoints: string[];
  example: string;
  commonMistake: string;
  learningTip: string;
}

export interface LearningResponse {
  concept: {
    id: string;
    name: string;
    description: string;
  };

  learningContent: LearningContent;
}

// =====================================================
// AUTH TYPES
// =====================================================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "learner" | "admin";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

// =====================================================
// COMMON REQUEST FUNCTION
// =====================================================

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(
    "learngraph_token"
  );

  const response = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(options.headers || {}),

        // Automatically attach JWT when logged in
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const body = await response
    .json()
    .catch(() => ({}));

  // ---------------------------------------------------
  // Token expired / invalid
  // ---------------------------------------------------

  if (
    response.status === 401 &&
    token
  ) {
    localStorage.removeItem(
      "learngraph_token"
    );

    localStorage.removeItem(
      "learngraph_user"
    );
  }

  // ---------------------------------------------------
  // Handle API errors
  // ---------------------------------------------------

  if (!response.ok) {
    throw new Error(
      body?.message ||
        `Request failed: ${response.status}`
    );
  }

  return body;
}

// =====================================================
// AUTH
// =====================================================

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/auth/register",
    {
      method: "POST",

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/auth/login",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );
}

export async function getCurrentUser(): Promise<{
  success: boolean;
  user: AuthUser;
}> {
  return request<{
    success: boolean;
    user: AuthUser;
  }>("/auth/me");
}

// =====================================================
// SUBJECTS
// =====================================================

export async function getSubjects(): Promise<
  Subject[]
> {
  const result = await request<{
    success: boolean;
    data: Subject[];
  }>("/subjects");

  return result.data;
}

// =====================================================
// TOPICS
// =====================================================

export async function getTopics(
  subjectId?: string
): Promise<Topic[]> {
  const query = subjectId
    ? `?subjectId=${encodeURIComponent(
        subjectId
      )}`
    : "";

  const result = await request<{
    success: boolean;
    data: Topic[];
  }>(`/topics${query}`);

  return result.data;
}

// =====================================================
// CONCEPTS
// =====================================================

export async function getConcepts(
  topicId?: string
): Promise<Concept[]> {
  const query = topicId
    ? `?topicId=${encodeURIComponent(
        topicId
      )}`
    : "";

  const result = await request<{
    success: boolean;
    data: Concept[];
  }>(`/concepts${query}`);

  return result.data;
}

// =====================================================
// EXISTING QUESTIONS
// =====================================================

export async function getQuestions(
  conceptId?: string
): Promise<Question[]> {
  const query = conceptId
    ? `?conceptId=${encodeURIComponent(
        conceptId
      )}`
    : "";

  const result = await request<{
    success: boolean;
    data: Question[];
  }>(`/questions${query}`);

  return result.data;
}

// =====================================================
// AI QUESTION GENERATION
// =====================================================

export async function generateQuestions(
  input: {
    topicId?: string;
    conceptIds: string[];
    countPerConcept?: number;
    mode?:
      | "diagnostic"
      | "reassessment"
      | "practice";
  }
): Promise<Question[]> {
  const result = await request<{
    success: boolean;
    data: Question[];
  }>("/ai/questions", {
    method: "POST",

    body: JSON.stringify({
      topicId: input.topicId,

      conceptIds: input.conceptIds,

      countPerConcept:
        input.countPerConcept ?? 2,

      mode:
        input.mode ?? "diagnostic",
    }),
  });

  return result.data;
}

// =====================================================
// AI QUESTION GENERATION - CONVENIENCE FUNCTION
// =====================================================

export async function generateAiQuestions(
  conceptIds: string[],
  countPerConcept = 2,
  mode:
    | "diagnostic"
    | "reassessment"
    | "practice" = "diagnostic"
): Promise<Question[]> {
  const result = await request<{
    success: boolean;
    data: Question[];
  }>("/ai/questions", {
    method: "POST",

    body: JSON.stringify({
      conceptIds,

      countPerConcept,

      mode,
    }),
  });

  return result.data;
}

// =====================================================
// ANALYZE ASSESSMENT
// =====================================================

export async function analyzeAssessment(
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
  }>,
  type:
    | "diagnostic"
    | "reassessment",
  topicId?: string
): Promise<AssessmentResult> {
  const result = await request<{
    success: boolean;
    data: AssessmentResult;
  }>("/assessments/analyze", {
    method: "POST",

    body: JSON.stringify({
      answers,
      type,
      topicId,
    }),
  });

  return result.data;
}

// =====================================================
// GET LATEST ASSESSMENT
// =====================================================

export async function getLatestAssessment(): Promise<
  AssessmentResult | null
> {
  const result = await request<{
    success: boolean;
    data: any;
  }>("/assessments/latest");

  if (!result.data) {
    return null;
  }

  return {
    assessmentId: result.data._id,

    overallScore:
      result.data.overallScore ?? 0,

    rootGap: result.data.rootGap
      ? {
          id:
            typeof result.data.rootGap ===
            "object"
              ? result.data.rootGap._id
              : result.data.rootGap,

          name:
            result.data.rootGapName ||
            result.data.rootGap?.name ||
            "Root gap",

          description:
            result.data.rootGap?.description ||
            "",
        }
      : null,

    conceptScores:
      result.data.conceptScores || [],

    weakConcepts: (
      result.data.conceptScores || []
    ).filter(
      (x: ConceptScore) =>
        x.score < 60
    ),
  };
}

// =====================================================
// GET ASSESSMENT HISTORY
// =====================================================

export async function getAssessmentHistory(): Promise<
  any[]
> {
  const result = await request<{
    success: boolean;
    data: any[];
  }>("/assessments/history");

  return result.data || [];
}

// =====================================================
// AI LEARNING CONTENT
// =====================================================

export async function getLearningContent(
  conceptId: string
): Promise<LearningResponse> {
  const result = await request<{
    success: boolean;
    data: LearningResponse;
  }>("/ai/learning", {
    method: "POST",

    body: JSON.stringify({
      conceptId,
    }),
  });

  return result.data;
}