const API_BASE_URL = "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `API request failed: ${response.status}`
    );
  }

  return response.json();
}

// ======================================================
// Types
// ======================================================

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
  difficulty:
    | "Beginner"
    | "Intermediate"
    | "Advanced";
}

export interface Prerequisite {
  _id: string;
  name: string;
}

export interface Concept {
  _id: string;
  topicId: string;
  name: string;
  description: string;
  prerequisites: Prerequisite[];
  order: number;
}

export interface Question {
  _id: string;
  conceptId: string;
  question: string;
  options: string[];
  difficulty:
    | "Beginner"
    | "Intermediate"
    | "Advanced";
}

export interface SubmittedAnswer {
  questionId: string;
  selectedAnswer: number;
}

export interface ConceptScore {
  conceptId: string;
  conceptName: string;
  score: number;
  correct: number;
  total: number;
}

export interface RootGap {
  id: string;
  name: string;
  description: string;
}

export interface AssessmentResult {
  assessmentId: string;
  overallScore: number;
  rootGap: RootGap | null;
  conceptScores: ConceptScore[];
  weakConcepts: ConceptScore[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ======================================================
// Subjects
// ======================================================

export async function getSubjects(): Promise<Subject[]> {
  const result = await request<ApiResponse<Subject[]>>(
    "/subjects"
  );

  return result.data;
}

// ======================================================
// Topics
// ======================================================

export async function getTopics(
  subjectId?: string
): Promise<Topic[]> {
  const endpoint = subjectId
    ? `/topics?subjectId=${encodeURIComponent(subjectId)}`
    : "/topics";

  const result = await request<ApiResponse<Topic[]>>(
    endpoint
  );

  return result.data;
}

// ======================================================
// Concepts
// ======================================================

export async function getConcepts(
  topicId?: string
): Promise<Concept[]> {
  const endpoint = topicId
    ? `/concepts?topicId=${encodeURIComponent(topicId)}`
    : "/concepts";

  const result = await request<ApiResponse<Concept[]>>(
    endpoint
  );

  return result.data;
}

// ======================================================
// Questions
// ======================================================

export async function getQuestions(
  conceptId?: string
): Promise<Question[]> {
  const endpoint = conceptId
    ? `/questions?conceptId=${encodeURIComponent(conceptId)}`
    : "/questions";

  const result = await request<ApiResponse<Question[]>>(
    endpoint
  );

  return result.data;
}

// ======================================================
// Assessment
// ======================================================

export async function analyzeAssessment(
  answers: SubmittedAnswer[],
  type: "diagnostic" | "reassessment" = "diagnostic",
  topicId?: string
): Promise<AssessmentResult> {
  const result = await request<
    ApiResponse<AssessmentResult>
  >("/assessments/analyze", {
    method: "POST",

    body: JSON.stringify({
      answers,
      type,
      topicId,
    }),
  });

  return result.data;
}

// ======================================================
// Latest assessment
// ======================================================

export async function getLatestAssessment(): Promise<AssessmentResult | null> {
  const result = await request<
    ApiResponse<AssessmentResult | null>
  >("/assessments/latest");

  return result.data;
}