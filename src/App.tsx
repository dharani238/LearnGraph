import { useEffect, useMemo, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  ChevronRight,
  CircleHelp,
  Code2,
  Lightbulb,
  Network,
  PlayCircle,
  RotateCcw,
  Target,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Trophy,
  Zap,
} from "lucide-react";

import {
  analyzeAssessment,
  getAssessmentHistory,
  getConcepts,
  getLatestAssessment,
  getSubjects,
  getTopics,
  getLearningContent,
  generateAiQuestions,
  type LearningContent,
  type AssessmentResult,
  type Concept,
  type Question,
  type Subject,
  type Topic,
} from "./api/api";

type Page =
  | "dashboard"
  | "subjects"
  | "graph"
  | "diagnostic"
  | "rootgap"
  | "learning"
  | "practice"
  | "reassessment"
  | "progress";

const navItems: Array<{
  id: Page;
  label: string;
  icon: any;
}> = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Activity,
    },
    {
      id: "subjects",
      label: "Subjects",
      icon: BookOpen,
    },
    {
      id: "graph",
      label: "Concept Graph",
      icon: Network,
    },
    {
      id: "diagnostic",
      label: "Diagnostic",
      icon: CircleHelp,
    },

    {
      id: "rootgap",
      label: "Root Gap",
      icon: Target,
    },
    {
      id: "learning",
      label: "Learning",
      icon: Lightbulb,
    },
    {
      id: "practice",
      label: "Practice",
      icon: PlayCircle,
    },
    {
      id: "progress",
      label: "Progress",
      icon: TrendingUp,
    },
  ];

function App() {
  const [authPage, setAuthPage] = useState<
  "login" | "register"
>("login");

const [authToken, setAuthToken] = useState<string | null>(
  () => localStorage.getItem("learngraph_token")
);

  const [page, setPage] =
    useState<Page>("dashboard");

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [topics, setTopics] =
    useState<Topic[]>([]);
  const [aiLearning, setAiLearning] =
    useState<LearningContent | null>(null);

  const [aiLearningLoading, setAiLearningLoading] =
    useState(false);

  const [aiLearningError, setAiLearningError] =
    useState("");

  const [concepts, setConcepts] =
    useState<Concept[]>([]);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [selectedSubject, setSelectedSubject] =
    useState<Subject | null>(null);

  const [selectedTopic, setSelectedTopic] =
    useState<Topic | null>(null);

  const [answers, setAnswers] =
    useState<Record<string, number>>({});

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [assessment, setAssessment] =
    useState<AssessmentResult | null>(null);

  const [history, setHistory] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [pageLoading, setPageLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================
  // INITIAL DATA
  // =========================================

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [subjectData, latest] =
        await Promise.all([
          getSubjects(),
          getLatestAssessment().catch(
            () => null
          ),
        ]);

      setSubjects(subjectData);
      setAssessment(latest);

      if (subjectData.length > 0) {
        const firstSubject =
          subjectData[0];

        setSelectedSubject(
          firstSubject
        );

        const topicData =
          await getTopics(
            firstSubject._id
          );

        setTopics(topicData);

        if (topicData.length > 0) {
          const firstTopic =
            topicData[0];

          setSelectedTopic(
            firstTopic
          );

          const conceptData =
            await getConcepts(
              firstTopic._id
            );

          setConcepts(
            conceptData
          );
        }
      }
    } catch (err: any) {
      setError(
        err.message ||
        "Could not connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!authToken) {
    // Clear previous user's data when logged out
    setAssessment(null);
    setHistory([]);
    setAnswers({});
    setQuestions([]);
    setQuestionIndex(0);

    setSelectedSubject(null);
    setSelectedTopic(null);
    setConcepts([]);

    setLoading(false);

    return;
  }

  // Load data for the currently logged-in user
  loadInitialData();
}, [authToken]);
  // =========================================
  // SELECT SUBJECT
  // =========================================

  const selectSubject = async (
    subject: Subject
  ) => {
    try {
      setPageLoading(true);
      setError("");

      setSelectedSubject(subject);

      const topicData =
        await getTopics(
          subject._id
        );

      setTopics(topicData);

      if (topicData.length > 0) {
        const firstTopic =
          topicData[0];

        setSelectedTopic(
          firstTopic
        );

        const conceptData =
          await getConcepts(
            firstTopic._id
          );

        setConcepts(
          conceptData
        );
      } else {
        setSelectedTopic(null);
        setConcepts([]);
      }

      setPage("graph");
    } catch (err: any) {
      setError(
        err.message ||
        "Failed to load topics."
      );
    } finally {
      setPageLoading(false);
    }
  };
  const loadAiLearning = async (
    conceptId: string
  ) => {
    try {
      setAiLearningLoading(true);
      setAiLearningError("");

      const result =
        await getLearningContent(conceptId);

      setAiLearning(
        result.learningContent
      );
    } catch (error) {
      console.error(
        "Failed to load AI learning:",
        error
      );

      setAiLearningError(
        "Unable to generate AI learning content. Please try again."
      );
    } finally {
      setAiLearningLoading(false);
    }
  };

  // =========================================
  // LOAD AI LEARNING WHEN OPENING LEARNING PAGE
  // =========================================

  useEffect(() => {
    if (
      page === "learning" &&
      assessment?.rootGap?.id
    ) {
      loadAiLearning(assessment.rootGap.id);
    }
  }, [page, assessment?.rootGap?.id]);

  // =========================================
  // SELECT TOPIC
  // =========================================

  const selectTopic = async (
    topic: Topic
  ) => {
    try {
      setPageLoading(true);
      setError("");

      setSelectedTopic(topic);

      const conceptData =
        await getConcepts(
          topic._id
        );

      setConcepts(
        conceptData
      );

      setPage("graph");
    } catch (err: any) {
      setError(
        err.message ||
        "Failed to load concepts."
      );
    } finally {
      setPageLoading(false);
    }
  };

  // =========================================
  // LOAD FRESH AI QUESTIONS
  // =========================================

  const loadQuestions = async () => {
    if (!selectedTopic || !concepts.length) return;

    try {
      setPageLoading(true);
      setError("");

      const generated = await generateAiQuestions(
        concepts.map((concept) => concept._id),
        2,
        "diagnostic"
      );

      setQuestions(generated);
      setAnswers({});
      setQuestionIndex(0);
      setPage("diagnostic");
    } catch (err: any) {
      console.error("AI question generation failed:", err);
      setError(err.message || "Gemini could not generate questions.");
    } finally {
      setPageLoading(false);
    }
  };

  // =========================================
  // SUBMIT ASSESSMENT
  // =========================================

  const submitAssessment = async (
    type:
      | "diagnostic"
      | "reassessment"
  ) => {
    if (
      !selectedTopic ||
      !questions.length
    ) {
      return;
    }

    const submitted =
      questions
        .filter(
          (question) =>
            answers[
            question._id
            ] !== undefined
        )
        .map((question) => ({
          questionId:
            question._id,

          selectedAnswer:
            answers[
            question._id
            ],
        }));

    if (
      submitted.length !==
      questions.length
    ) {
      setError(
        "Please answer every question before submitting."
      );

      return;
    }

    try {
      setPageLoading(true);
      setError("");

      const result =
        await analyzeAssessment(
          submitted,
          type,
          selectedTopic._id
        );

      setAssessment(
        result
      );

      if (
        type === "diagnostic"
      ) {
        setPage("rootgap");
      } else {
        setPage("progress");
      }

      const historyData =
        await getAssessmentHistory();

      setHistory(
        historyData
      );
    } catch (err: any) {
      setError(
        err.message ||
        "Assessment submission failed."
      );
    } finally {
      setPageLoading(false);
    }
  };

  // =========================================
  // ROOT CONCEPT
  // =========================================

  const rootConcept =
    useMemo(() => {
      if (
        !assessment?.rootGap
      ) {
        return null;
      }

      return (
        concepts.find(
          (concept) =>
            concept._id ===
            assessment.rootGap?.id
        ) || null
      );
    }, [
      assessment,
      concepts,
    ]);

  const weakConcepts =
    assessment?.weakConcepts ||
    [];

  // =========================================
  // REASSESSMENT — FRESH AI QUESTIONS
  // =========================================

  const openReassessment = async () => {
    if (!selectedTopic || !concepts.length) return;

    try {
      setPageLoading(true);
      setError("");
      const generated = await generateAiQuestions(
        concepts.map((concept) => concept._id),
        2,
        "reassessment"
      );

      setQuestions(generated);
      setAnswers({});
      setQuestionIndex(0);
      setPage("reassessment");
    } catch (err: any) {
      setError(err.message || "Could not generate a fresh reassessment.");
    } finally {
      setPageLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

          <h2 className="text-xl font-bold">
            Loading LearnGraph
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Connecting to your learning data...
          </p>
        </div>
      </div>
    );
  }
const handleAuthenticated = (token: string) => {
  setAuthToken(token);
};

const handleLogout = () => {
  // Remove authentication
  localStorage.removeItem("learngraph_token");
  localStorage.removeItem("learngraph_user");

  // Clear previous user's assessment/progress
  setAssessment(null);
  setHistory([]);

  // Clear quiz state
  setQuestions([]);
  setAnswers({});
  setQuestionIndex(0);

  // Clear learning state
  setAiLearning(null);
  setAiLearningError("");
  setAiLearningLoading(false);

  // Clear selected learning data
  setSelectedSubject(null);
  setSelectedTopic(null);
  setConcepts([]);
  setTopics([]);

  // Reset page
  setPage("dashboard");

  // Show login
  setAuthToken(null);
  setAuthPage("login");
};

if (!authToken) {
  if (authPage === "login") {
    return (
      <Login
        onLogin={handleAuthenticated}
        onRegister={() => setAuthPage("register")}
      />
    );
  }

  return (
    <Register
      onRegister={handleAuthenticated}
      onLogin={() => setAuthPage("login")}
    />
  );
}
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f5f3ff_0,#f8fafc_35%,#f1f5f9_100%)] text-slate-900">
      {/* SIDEBAR */}

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/30 backdrop-blur lg:block">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-600 p-2 text-white">
              <Brain size={22} />
            </div>

            <div>
              <div className="text-lg font-black">
                LearnGraph
              </div>

              <div className="text-xs text-slate-500">
                Personalized Learning
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {navItems.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                page === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setPage(
                      item.id
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${active
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Icon size={19} />

                  {item.label}
                </button>
              );
            }
          )}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-2xl bg-violet-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-violet-700">
            <Brain size={18} />

            <span className="font-bold">
              AI Learning
            </span>
          </div>

          <p className="text-xs leading-5 text-slate-600">
            LearnGraph finds the prerequisite
            concept that is blocking your progress.
          </p>
        </div>
      </aside>

      {/* MAIN */}

      {/* MOBILE NAVIGATION */}

<nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
  <div className="flex items-center justify-around gap-1 overflow-x-auto">
    {navItems
      .filter((item) =>
        [
          "dashboard",
          "subjects",
          "graph",
          "learning",
          "progress",
        ].includes(item.id)
      )
      .map((item) => {
        const Icon = item.icon;
        const active = page === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex min-w-[62px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold transition ${
              active
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
  </div>
</nav>

{/* MAIN */}

<main className="pb-20 lg:ml-64 lg:pb-0">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/60 bg-white/80 px-5 shadow-sm backdrop-blur-xl md:px-8">
  <div>
    <div className="text-xs font-semibold uppercase tracking-wider text-violet-600">
      {selectedSubject?.name || "Learning"}
    </div>

    <div className="font-bold">
      {selectedTopic?.name || "Your learning workspace"}
    </div>
  </div>

  <div className="flex items-center gap-3">

    {/* Backend status */}
    <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>

      Live backend
    </div>

    {/* User */}
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-black text-white">
        {(
          JSON.parse(
            localStorage.getItem("learngraph_user") || "{}"
          ).name || "U"
        )
          .charAt(0)
          .toUpperCase()}
      </div>

      <div className="hidden text-left sm:block">
        <div className="max-w-[100px] truncate text-xs font-black text-slate-800">
          {JSON.parse(
            localStorage.getItem("learngraph_user") || "{}"
          ).name || "Learner"}
        </div>

        <div className="text-[10px] text-slate-400">
          Learner
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="ml-1 rounded-lg px-2.5 py-2 text-xs font-black text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        title="Logout"
      >
        Logout
      </button>

    </div>
  </div>
</header>

        {/* ERROR */}

        {error && (
          <div className="mx-5 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mx-8">
            {error}

            <button
              className="ml-3 font-bold underline"
              onClick={() =>
                setError("")
              }
            >
              dismiss
            </button>
          </div>
        )}

        {/* LOADING */}

        {pageLoading && (
          <div className="mx-5 mt-5 rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 md:mx-8">
            Loading...
          </div>
        )}

        <div className="p-5 pb-24 md:p-8">
          {/* DASHBOARD */}

          {page ===
            "dashboard" && (
              <Dashboard
                subjects={
                  subjects
                }
                selectedTopic={
                  selectedTopic
                }
                assessment={
                  assessment
                }
                onSubjects={() =>
                  setPage(
                    "subjects"
                  )
                }
                onGraph={() =>
                  setPage(
                    "graph"
                  )
                }
                onDiagnostic={
                  loadQuestions
                }
              />
            )}

          {/* SUBJECTS */}

          {page ===
            "subjects" && (
              <Subjects
                subjects={
                  subjects
                }
                selectedSubject={
                  selectedSubject
                }
                onSelect={
                  selectSubject
                }
              />
            )}

          {/* GRAPH */}

          {page === "graph" && (
            <ConceptGraphPage
              topics={topics}
              selectedTopic={
                selectedTopic
              }
              concepts={
                concepts
              }
              onTopic={
                selectTopic
              }
              onDiagnostic={
                loadQuestions
              }
            />
          )}

          {/* DIAGNOSTIC */}

          {(page ===
            "diagnostic" ||
            page ===
            "reassessment") && (
              <AssessmentPage
                title={
                  page ===
                    "diagnostic"
                    ? "Diagnostic Assessment"
                    : "Reassessment"
                }
                description={
                  page ===
                    "diagnostic"
                    ? "Answer these questions to identify your prerequisite gap."
                    : "Check how much you improved after targeted learning."
                }
                questions={
                  questions
                }
                currentIndex={
                  questionIndex
                }
                answers={
                  answers
                }
                setAnswers={
                  setAnswers
                }
                setCurrentIndex={
                  setQuestionIndex
                }
                onSubmit={() =>
                  submitAssessment(
                    page ===
                      "diagnostic"
                      ? "diagnostic"
                      : "reassessment"
                  )
                }
              />
            )}

          {/* ROOT GAP */}

          {page ===
            "rootgap" && (
              <RootGapPage
                assessment={
                  assessment
                }
                concept={
                  rootConcept
                }
                onLearning={() =>
                  setPage(
                    "learning"
                  )
                }
                onPractice={() =>
                  setPage(
                    "practice"
                  )
                }
              />
            )}

          {/* LEARNING */}

          {page ===
            "learning" && (
              <LearningPage
                assessment={
                  assessment
                }
                concept={
                  rootConcept
                }
                aiLearning={
                  aiLearning
                }
                aiLearningLoading={
                  aiLearningLoading
                }
                aiLearningError={
                  aiLearningError
                }
                onRetryLearning={() => {
                  const rootGapId =
                    assessment?.rootGap?.id;

                  if (rootGapId) {
                    loadAiLearning(rootGapId);
                  }
                }}
                onPractice={() =>
                  setPage(
                    "practice"
                  )
                }
                onReassessment={
                  openReassessment
                }
              />
            )}

          {/* PRACTICE */}

          {page ===
            "practice" && (
              <PracticePage
                weakConcepts={
                  weakConcepts
                }
                concepts={
                  concepts
                }
                onStart={async (
                  conceptId
                ) => {
                  try {
                    setPageLoading(
                      true
                    );

                    const generated = await generateAiQuestions(
                      [conceptId],
                      3,
                      "practice"
                    );

                    setQuestions(generated);

                    setAnswers(
                      {}
                    );

                    setQuestionIndex(
                      0
                    );

                    setPage(
                      "reassessment"
                    );
                  } catch (err: any) {
                    setError(
                      err.message ||
                      "Could not load practice questions."
                    );
                  } finally {
                    setPageLoading(
                      false
                    );
                  }
                }}
              />
            )}

          {/* PROGRESS */}

          {page ===
            "progress" && (
              <ProgressPage
                assessment={
                  assessment
                }
                history={
                  history
                }
                onReassessment={
                  openReassessment
                }
              />
            )}
        </div>
      </main>
    </div>
  );
}

// ======================================================
// DASHBOARD
// ======================================================
function Dashboard({
  subjects,
  selectedTopic,
  assessment,
  onSubjects,
  onGraph,
  onDiagnostic,
}: {
  subjects: Subject[];
  selectedTopic: Topic | null;
  assessment: AssessmentResult | null;
  onSubjects: () => void;
  onGraph: () => void;
  onDiagnostic: () => void;
}) {
  const score = assessment?.overallScore ?? 0;

  return (
    <div className="space-y-7">

      {/* =====================================================
          WELCOME / HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl md:p-10">

        {/* Background glow */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-violet-200">
              <Sparkles size={14} />
              AI-powered learning
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Find the concept
              <span className="block text-violet-300">
                behind the confusion.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              LearnGraph goes beyond telling you what you got wrong.
              It traces prerequisite relationships, identifies the
              root learning gap, and creates a focused path to improve.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <button
                onClick={onDiagnostic}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-violet-700 shadow-xl hover:-translate-y-0.5"
              >
                <CircleHelp size={17} />
                Start Diagnostic
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onGraph}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur hover:bg-white/15"
              >
                <Network size={17} />
                Explore Knowledge Graph
              </button>

            </div>

          </div>

          {/* RIGHT - INTELLIGENCE CARD */}
          <div className="hidden lg:block">

            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-violet-500/20 p-2 text-violet-300">
                    <Brain size={20} />
                  </div>

                  <div>
                    <div className="text-sm font-black">
                      Learning Intelligence
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Dependency analysis
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Active
                </span>

              </div>

              <div className="mt-6 space-y-2">

                {[
                  ["01", "Understand", "Build the foundation"],
                  ["02", "Diagnose", "Find weak concepts"],
                  ["03", "Trace", "Follow prerequisites"],
                  ["04", "Improve", "Learn + practice"],
                ].map((item, index) => (
                  <div key={item[0]}>

                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.04] p-3">

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black ${
                          index === 3
                            ? "bg-emerald-400 text-emerald-950"
                            : "bg-violet-500/15 text-violet-200"
                        }`}
                      >
                        {item[0]}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="text-sm font-bold">
                          {item[1]}
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {item[2]}
                        </div>

                      </div>

                      {index < 3 ? (
                        <CheckCircle2
                          size={17}
                          className="text-emerald-300"
                        />
                      ) : (
                        <Zap
                          size={17}
                          className="text-amber-300"
                        />
                      )}

                    </div>

                    {index < 3 && (
                      <div className="ml-7 h-2 border-l border-dashed border-white/10" />
                    )}

                  </div>
                ))}

              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 p-4">

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-violet-100">
                  <Sparkles size={14} />
                  LearnGraph insight
                </div>

                <p className="mt-1 text-sm font-bold text-white">
                  Don't reteach the whole topic.
                </p>

                <p className="mt-1 text-xs text-violet-100">
                  Find the missing concept.
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          QUICK STATS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Subjects */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <BookOpen size={21} />
            </div>

            <span className="text-xs font-bold text-emerald-600">
              Library
            </span>

          </div>

          <div className="mt-5 text-3xl font-black">
            {subjects.length}
          </div>

          <div className="mt-1 text-sm font-medium text-slate-500">
            Available subjects
          </div>

        </div>


        {/* Topic */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Network size={21} />
            </div>

            <span className="text-xs font-bold text-indigo-600">
              Current
            </span>

          </div>

          <div className="mt-5 truncate text-xl font-black">
            {selectedTopic?.name || "Not selected"}
          </div>

          <div className="mt-1 text-sm font-medium text-slate-500">
            Learning topic
          </div>

        </div>


        {/* Score */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Trophy size={21} />
            </div>

            <span className="text-xs font-bold text-amber-600">
              Latest
            </span>

          </div>

          <div className="mt-5 text-3xl font-black">
            {assessment ? `${score}%` : "—"}
          </div>

          <div className="mt-1 text-sm font-medium text-slate-500">
            Assessment score
          </div>

        </div>


        {/* Progress */}
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          <div className="flex items-start justify-between">

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <TrendingUp size={21} />
            </div>

            <span className="text-xs font-bold text-emerald-600">
              Progress
            </span>

          </div>

          <div className="mt-5 text-3xl font-black">
            {assessment ? `${score}%` : "0%"}
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${score}%`,
              }}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          CONTINUE LEARNING
      ===================================================== */}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-violet-600">
              <Zap size={14} />
              Continue learning
            </div>

            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
              Pick up where you left off
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your current learning path is ready.
            </p>

          </div>

          <button
            onClick={onSubjects}
            className="inline-flex items-center gap-2 text-sm font-black text-violet-700"
          >
            View all subjects
            <ArrowRight size={16} />
          </button>

        </div>


        <div className="mt-7 rounded-[1.5rem] border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-5 md:p-6">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200">
                <Brain size={25} />
              </div>

              <div>

                <div className="text-xs font-black uppercase tracking-wider text-violet-600">
                  Current learning path
                </div>

                <h3 className="mt-1 text-xl font-black">
                  {selectedTopic?.name || "Choose a topic"}
                </h3>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                  Explore the dependency graph, take a diagnostic,
                  identify your root gap, and follow a targeted learning path.
                </p>

              </div>

            </div>

            <button
              onClick={onGraph}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white"
            >
              Open Graph
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          LEARNGRAPH JOURNEY
      ===================================================== */}

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">

        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-violet-700">
            <Network size={14} />
            How LearnGraph works
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
            From confusion to clarity
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            LearnGraph connects every stage of the learning journey
            so you focus only on the concepts that matter.
          </p>

        </div>


        <div className="mt-8 grid gap-3 md:grid-cols-5">

          {[
            {
              num: "01",
              title: "Diagnose",
              desc: "Find weak concepts",
              icon: CircleHelp,
            },
            {
              num: "02",
              title: "Trace",
              desc: "Follow prerequisites",
              icon: Network,
            },
            {
              num: "03",
              title: "Learn",
              desc: "Target the root gap",
              icon: Lightbulb,
            },
            {
              num: "04",
              title: "Practice",
              desc: "Apply the concept",
              icon: PlayCircle,
            },
            {
              num: "05",
              title: "Reassess",
              desc: "Measure improvement",
              icon: TrendingUp,
            },
          ].map((item, index) => {

            const Icon = item.icon;

            return (
              <div
                key={item.num}
                className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50/50 hover:shadow-lg"
              >

                <div className="flex items-center justify-between">

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-black text-violet-700 shadow-sm">
                    {item.num}
                  </span>

                  <Icon
                    size={18}
                    className="text-slate-400 transition group-hover:text-violet-600"
                  />

                </div>

                <h3 className="mt-5 font-black">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {item.desc}
                </p>

                {index < 4 && (
                  <ArrowRight
                    className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-violet-300 md:block"
                    size={17}
                  />
                )}

              </div>
            );
          })}

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 to-indigo-600 p-7 text-white shadow-xl md:p-9">

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>

            <div className="flex items-center gap-2 text-sm font-bold text-violet-100">
              <Sparkles size={16} />
              Ready to learn smarter?
            </div>

            <h2 className="mt-2 text-2xl font-black md:text-3xl">
              Start with a diagnostic.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100">
              Let LearnGraph discover the concept that is actually
              blocking your progress.
            </p>

          </div>

          <button
            onClick={onDiagnostic}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-black text-violet-700 shadow-lg hover:-translate-y-0.5"
          >
            Start Diagnostic
            <ArrowRight size={17} />
          </button>

        </div>

      </section>

    </div>
  );
}

// ======================================================
// SUBJECTS
// ======================================================

function Subjects({
  subjects,
  selectedSubject,
  onSelect,
}: {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelect: (subject: Subject) => void;
}) {
  const palette = [
    "from-violet-600 to-indigo-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-pink-500 to-rose-600",
    "from-sky-500 to-cyan-600",
  ];

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl md:p-9">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-violet-200">
              <Sparkles size={14} /> AI learning space
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              Choose what you want to understand.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              LearnGraph maps prerequisite concepts first, then Gemini creates a fresh diagnostic for the topic you choose.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div className="text-2xl font-black">{subjects.length}</div>
            <div className="text-xs font-semibold text-slate-400">available subjects</div>
          </div>
        </div>
      </section>

      {subjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          No subjects are available yet. Run the backend seed to add the learning library.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject, index) => {
            const active = selectedSubject?._id === subject._id;
            return (
              <button
                key={subject._id}
                onClick={() => onSelect(subject)}
                className={`group relative overflow-hidden rounded-[1.7rem] border bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${active ? "border-violet-400 ring-4 ring-violet-100" : "border-slate-200"}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${palette[index % palette.length]}`} />
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${palette[index % palette.length]} text-2xl shadow-lg shadow-slate-200`}>
                    {subject.icon || "📚"}
                  </div>
                  {active && (
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700">Selected</span>
                  )}
                </div>
                <h2 className="mt-6 text-xl font-black tracking-tight">{subject.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{subject.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Concept map + AI quiz</span>
                  <span className="inline-flex items-center gap-1 text-sm font-black text-violet-700 transition group-hover:gap-2">Explore <ChevronRight size={16} /></span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ======================================================
// CONCEPT GRAPH
// ======================================================

function ConceptGraphPage({
  topics,
  selectedTopic,
  concepts,
  onTopic,
  onDiagnostic,
}: {
  topics: Topic[];
  selectedTopic: Topic | null;
  concepts: Concept[];
  onTopic: (topic: Topic) => void;
  onDiagnostic: () => void;
}) {
  return (
    <div className="space-y-7">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl md:p-9">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-violet-200">
                <Network size={14} />
                Knowledge graph
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                {selectedTopic?.name || "Choose a topic"}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                LearnGraph maps the prerequisite relationships between
                concepts so the system can understand what you need
                before moving to the next idea.
              </p>

            </div>

            <button
              onClick={onDiagnostic}
              disabled={!concepts.length}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-violet-700 shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CircleHelp size={17} />
              Start Diagnostic
              <ArrowRight size={16} />
            </button>

          </div>

          {/* Topic selector */}

          <div className="mt-7 flex flex-wrap gap-2">

            {topics.map((topic) => (

              <button
                key={topic._id}
                onClick={() => onTopic(topic)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  selectedTopic?._id === topic._id
                    ? "bg-white text-violet-700 shadow-lg"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {topic.name}
              </button>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          GRAPH SUMMARY
      ===================================================== */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
              <Network size={20} />
            </div>

            <div>
              <div className="text-2xl font-black">
                {concepts.length}
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Concepts mapped
              </div>
            </div>

          </div>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <div className="text-2xl font-black">
                {concepts.filter(
                  (concept) =>
                    !concept.prerequisites ||
                    concept.prerequisites.length === 0
                ).length}
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Foundation concepts
              </div>
            </div>

          </div>

        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Target size={20} />
            </div>

            <div>
              <div className="text-2xl font-black">
                {concepts.length > 0 ? 1 : 0}
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Target concept
              </div>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          GRAPH
      ===================================================== */}

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

        {/* Graph header */}

        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-6 py-6 md:px-8">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <div className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
                Dependency chain
              </div>

              <h2 className="mt-1 text-2xl font-black">
                How concepts connect
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Foundation concepts unlock prerequisite and advanced concepts.
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                Foundation
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Target
              </span>

            </div>

          </div>

        </div>


        {/* Graph body */}

        <div className="relative overflow-x-auto p-6 md:p-10">

          {concepts.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">

              <Network
                size={35}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-black text-slate-700">
                No concepts available
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Select another topic to view its dependency graph.
              </p>

            </div>

          ) : (

            <div className="min-w-[760px]">

              {/* Foundation → Target label */}

              <div className="mb-8 flex items-center justify-between">

                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Start here
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-700">
                    Foundational knowledge
                  </div>
                </div>

                <div className="flex-1 mx-6 border-t border-dashed border-slate-200" />

                <div className="text-right">

                  <div className="text-xs font-black uppercase tracking-wider text-amber-500">
                    Target
                  </div>

                  <div className="mt-1 text-sm font-bold text-slate-700">
                    Advanced understanding
                  </div>

                </div>

              </div>


              {/* Nodes */}

              <div className="grid gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">

                {concepts.map((concept, index) => {

                  const isFirst =
                    index === 0 ||
                    !concept.prerequisites ||
                    concept.prerequisites.length === 0;

                  const isLast =
                    index === concepts.length - 1;

                  return (
                    <div
                      key={concept._id}
                      className="contents"
                    >

                      {/* NODE */}

                      <div
                        className={`group relative rounded-[1.5rem] border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                          isLast
                            ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm"
                            : isFirst
                            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm"
                            : "border-violet-200 bg-gradient-to-br from-violet-50 to-white shadow-sm"
                        }`}
                      >

                        {/* Top status */}

                        <div className="flex items-start justify-between gap-3">

                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black shadow-sm ${
                              isLast
                                ? "bg-amber-300 text-amber-950"
                                : isFirst
                                ? "bg-emerald-500 text-white"
                                : "bg-violet-600 text-white"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                              isLast
                                ? "bg-amber-200 text-amber-900"
                                : isFirst
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-violet-100 text-violet-700"
                            }`}
                          >
                            {isLast
                              ? "Target"
                              : isFirst
                              ? "Foundation"
                              : "Prerequisite"}
                          </span>

                        </div>


                        {/* Concept */}

                        <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900">
                          {concept.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {concept.description}
                        </p>


                        {/* Prerequisites */}

                        {concept.prerequisites &&
                          concept.prerequisites.length > 0 && (

                            <div className="mt-5 border-t border-slate-200/70 pt-4">

                              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Requires
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">

                                {concept.prerequisites.map(
                                  (prerequisite) => (

                                    <span
                                      key={prerequisite._id}
                                      className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200"
                                    >
                                      {prerequisite.name}
                                    </span>

                                  )
                                )}

                              </div>

                            </div>

                          )}


                        {/* Target insight */}

                        {isLast && (

                          <div className="mt-5 rounded-xl bg-amber-200/60 p-3">

                            <div className="flex items-center gap-2 text-xs font-black text-amber-900">

                              <Target size={14} />

                              Learning target

                            </div>

                            <p className="mt-1 text-xs leading-5 text-amber-800">
                              Master the prerequisites before moving here.
                            </p>

                          </div>

                        )}

                      </div>


                      {/* CONNECTOR */}

                      {!isLast && (

                        <div className="flex items-center justify-center px-4">

                          <div className="flex items-center">

                            <div className="h-px w-10 bg-gradient-to-r from-slate-200 to-violet-300" />

                            <div className="relative">

                              <ArrowRight
                                size={22}
                                className="text-violet-500"
                              />

                              <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase tracking-wider text-slate-400">
                                unlocks
                              </span>

                            </div>

                          </div>

                        </div>

                      )}

                    </div>
                  );
                })}

              </div>


              {/* Graph explanation */}

              <div className="mt-10 rounded-2xl border border-violet-100 bg-violet-50/60 p-5">

                <div className="flex items-start gap-3">

                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                    <Brain size={19} />
                  </div>

                  <div>

                    <h3 className="font-black text-violet-950">
                      Why the graph matters
                    </h3>

                    <p className="mt-1 max-w-3xl text-sm leading-6 text-violet-900/70">
                      If a learner struggles with an advanced concept,
                      LearnGraph can trace the prerequisite chain instead
                      of assuming the advanced concept itself is the problem.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>


        {/* Bottom action */}

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-5 md:px-8">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>

              <div className="text-sm font-black text-slate-800">
                Ready to test your understanding?
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Gemini will generate a fresh diagnostic based on this concept graph.
              </div>

            </div>

            <button
              onClick={onDiagnostic}
              disabled={!concepts.length}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles size={16} />
              Generate AI Diagnostic
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}
// ======================================================
// ASSESSMENT
// ======================================================

function AssessmentPage({
  title,
  description,
  questions,
  currentIndex,
  answers,
  setAnswers,
  setCurrentIndex,
  onSubmit,
}: {
  title: string;
  description: string;
  questions: Question[];
  currentIndex: number;
  answers: Record<
    string,
    number
  >;
  setAnswers: React.Dispatch<
    React.SetStateAction<
      Record<string, number>
    >
  >;
  setCurrentIndex: React.Dispatch<
    React.SetStateAction<number>
  >;
  onSubmit: () => void;
}) {
  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-black">
          {title}
        </h1>

        <p className="mt-2 text-slate-500">
          No questions are available for this topic yet.
        </p>
      </div>
    );
  }

  const question =
    questions[
    currentIndex
    ];

  const selected =
    answers[
    question._id
    ];

  const answeredCount =
    Object.keys(
      answers
    ).length;

  const last =
    currentIndex ===
    questions.length - 1;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold text-violet-600">{title}</div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-50 to-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700 ring-1 ring-violet-100">
            <Sparkles size={12} /> Fresh Gemini questions
          </span>
        </div>

        <h1 className="mt-2 text-3xl font-black">
          {description}
        </h1>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-violet-600 transition-all"
          style={{
            width: `${((currentIndex +
              1) /
              questions.length) *
              100
              }%`,
          }}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
              Question{" "}
              {currentIndex +
                1}{" "}
              /{" "}
              {
                questions.length
              }
            </span>
            <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 sm:inline-flex">AI generated</span>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {
              answeredCount
            }{" "}
            answered
          </span>
        </div>

        <h2 className="text-xl font-black leading-8">
          {
            question.question
          }
        </h2>

        <div className="mt-7 space-y-3">
          {question.options.map(
            (
              option,
              index
            ) => {
              const active =
                selected ===
                index;

              return (
                <button
                  key={
                    option
                  }
                  onClick={() =>
                    setAnswers(
                      (
                        previous
                      ) => ({
                        ...previous,
                        [question._id]:
                          index,
                      })
                    )
                  }
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${active
                    ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                    : "border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${active
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {String.fromCharCode(
                      65 +
                      index
                    )}
                  </span>

                  <span className="font-medium">
                    {
                      option
                    }
                  </span>
                </button>
              );
            }
          )}
        </div>

        <div className="mt-8 flex justify-between gap-3">
          <button
            disabled={
              currentIndex ===
              0
            }
            onClick={() =>
              setCurrentIndex(
                (
                  index
                ) =>
                  index -
                  1
              )
            }
            className="rounded-xl border border-slate-200 px-5 py-3 font-bold disabled:opacity-40"
          >
            Previous
          </button>

          {!last ? (
            <button
              disabled={
                selected ===
                undefined
              }
              onClick={() =>
                setCurrentIndex(
                  (
                    index
                  ) =>
                    index +
                    1
                )
              }
              className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              onClick={
                onSubmit
              }
              disabled={
                answeredCount !==
                questions.length
              }
              className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white disabled:opacity-40"
            >
              Submit Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// ROOT GAP
// ======================================================

function RootGapPage({
  assessment,
  concept,
  onLearning,
  onPractice,
}: {
  assessment:
  | AssessmentResult
  | null;

  concept:
  | Concept
  | null;

  onLearning: () => void;

  onPractice: () => void;
}) {
  const gap =
    assessment?.rootGap;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="text-sm font-semibold text-violet-600">
          Diagnosis
        </div>

        <h1 className="mt-1 text-3xl font-black">
          Your Root Gap
        </h1>

        <p className="mt-2 text-slate-500">
          LearnGraph traced your weak concepts back to their prerequisite.
        </p>
      </div>

      <div className="rounded-3xl border border-violet-200 bg-violet-50 p-7">
        <div className="flex items-center gap-3 text-violet-700">
          <Target />

          <span className="font-bold">
            Root prerequisite identified
          </span>
        </div>

        <h2 className="mt-5 text-3xl font-black">
          {gap?.name ||
            "No root gap detected"}
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          {gap?.description ||
            "Your assessment did not produce a weak prerequisite concept."}
        </p>

        {concept &&
          concept
            .prerequisites
            ?.length >
          0 && (
            <div className="mt-5 text-sm text-slate-600">
              Prerequisites:{" "}
              {concept.prerequisites
                .map(
                  (item) =>
                    item.name
                )
                .join(", ")}
            </div>
          )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={
            onLearning
          }
          className="rounded-2xl bg-violet-600 p-5 text-left font-bold text-white"
        >
          <Lightbulb className="mb-4" />

          Learn the root gap

          <div className="mt-1 text-sm font-normal text-violet-100">
            Start targeted learning.
          </div>
        </button>

        <button
          onClick={
            onPractice
          }
          className="rounded-2xl border border-slate-200 bg-white p-5 text-left font-bold"
        >
          <PlayCircle className="mb-4 text-violet-600" />

          Practice weak concepts

          <div className="mt-1 text-sm font-normal text-slate-500">
            Apply what you have learned.
          </div>
        </button>
      </div>
    </div>
  );
}

// ======================================================
// LEARNING
// ======================================================

function LearningPage({
  assessment,
  concept,
  aiLearning,
  aiLearningLoading,
  aiLearningError,
  onRetryLearning,
  onPractice,
  onReassessment,
}: {
  assessment:
  | AssessmentResult
  | null;

  concept:
  | Concept
  | null;

  aiLearning:
  | LearningContent
  | null;

  aiLearningLoading: boolean;

  aiLearningError: string;

  onRetryLearning: () => void;

  onPractice: () => void;

  onReassessment: () => void;
}) {
  const name =
    assessment?.rootGap
      ?.name ||
    concept?.name ||
    "Root concept";

  const description =
    assessment?.rootGap
      ?.description ||
    concept?.description ||
    "Review the core idea before moving forward.";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="text-sm font-semibold text-violet-600">
          Targeted Learning
        </div>

        <h1 className="mt-1 text-3xl font-black">
          {name}
        </h1>

        <p className="mt-2 text-slate-500">
          AI-powered learning content generated specifically for your root gap.
        </p>
      </div>

      <article className="rounded-3xl border border-violet-200 bg-violet-50 p-7 shadow-sm md:p-9">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-3 text-violet-600">
            <Target />
          </div>

          <h2 className="text-xl font-black">
            Your identified root gap
          </h2>
        </div>

        <p className="mt-5 text-lg leading-8 text-slate-700">
          {description}
        </p>
      </article>

      {aiLearningLoading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />

            <div>
              <h2 className="font-black">
                Preparing your personalized lesson
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Gemini is creating an explanation, examples, and learning tips for you.
              </p>
            </div>
          </div>
        </div>
      )}

      {aiLearningError && !aiLearningLoading && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-black text-red-900">
            AI learning content could not be loaded
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {aiLearningError}
          </p>

          <button
            onClick={onRetryLearning}
            className="mt-4 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {aiLearning && !aiLearningLoading && (
        <>
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Lightbulb />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  Gemini AI Tutor
                </div>

                <h2 className="text-xl font-black">
                  Understanding the Concept
                </h2>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {aiLearning.explanation}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-xl font-black">
              Key Points
            </h2>

            <div className="mt-5 space-y-4">
              {aiLearning.keyPoints.map(
                (point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-black text-violet-700">
                      {index + 1}
                    </div>

                    <p className="pt-1 leading-7 text-slate-600">
                      {point}
                    </p>
                  </div>
                )
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Code2 />
              </div>

              <h2 className="text-xl font-black">
                Example
              </h2>
            </div>

            <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
              <code>
                {aiLearning.example}
              </code>
            </pre>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-7 md:p-9">
            <h2 className="text-xl font-black text-amber-900">
              Common Mistake
            </h2>

            <p className="mt-3 leading-7 text-amber-800">
              {aiLearning.commonMistake}
            </p>
          </article>

          <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 md:p-9">
            <h2 className="text-xl font-black text-emerald-900">
              Learning Tip
            </h2>

            <p className="mt-3 leading-7 text-emerald-800">
              {aiLearning.learningTip}
            </p>
          </article>
        </>
      )}

      {!aiLearning &&
        !aiLearningLoading &&
        !aiLearningError && (
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Lightbulb />
              </div>

              <h2 className="text-xl font-black">
                Concept explanation
              </h2>
            </div>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {description}
            </p>
          </article>
        )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onPractice}
          className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700"
        >
          Practice now
        </button>

        <button
          onClick={onReassessment}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold hover:bg-slate-50"
        >
          Reassess
        </button>
      </div>
    </div>
  );
}

// ======================================================
// PRACTICE
// ======================================================

function PracticePage({
  weakConcepts,
  concepts,
  onStart,
}: {
  weakConcepts: Array<{
    conceptId: string;
    conceptName: string;
    score: number;
  }>;

  concepts: Concept[];

  onStart: (
    conceptId: string
  ) => void;
}) {
  const list =
    weakConcepts.length >
      0
      ? weakConcepts
      : concepts.map(
        (concept) => ({
          conceptId:
            concept._id,

          conceptName:
            concept.name,

          score: 0,
        })
      );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-violet-600">
          Practice
        </div>

        <h1 className="mt-1 text-3xl font-black">
          Targeted Practice
        </h1>

        <p className="mt-2 text-slate-500">
          Practice concepts that need more reinforcement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map(
          (item) => (
            <div
              key={
                item.conceptId
              }
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-black">
                    {
                      item.conceptName
                    }
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Current score:{" "}
                    {
                      item.score
                    }
                    %
                  </p>
                </div>

                <div
                  className={`rounded-full px-3 py-1 text-xs font-bold ${item.score <
                    60
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                    }`}
                >
                  {item.score <
                    60
                    ? "Needs practice"
                    : "Improving"}
                </div>
              </div>

              <button
                onClick={() =>
                  onStart(
                    item.conceptId
                  )
                }
                className="mt-5 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white"
              >
                Practice
                <ArrowRight
                  size={16}
                />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ======================================================
// PROGRESS
// ======================================================

function ProgressPage({
  assessment,
  history,
  onReassessment,
}: {
  assessment:
  | AssessmentResult
  | null;

  history: any[];

  onReassessment: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-violet-600">
          Progress
        </div>

        <h1 className="mt-1 text-3xl font-black">
          Your Learning Progress
        </h1>
      </div>

      {assessment && (
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            icon={
              <TrendingUp />
            }
            label="Latest Score"
            value={`${assessment.overallScore}%`}
          />

          <StatCard
            icon={
              <Target />
            }
            label="Root Gap"
            value={
              assessment.rootGap
                ?.name ||
              "None"
            }
          />

          <StatCard
            icon={
              <Brain />
            }
            label="Weak Concepts"
            value={String(
              assessment
                .weakConcepts
                .length
            )}
          />
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">
            Concept Scores
          </h2>

          <button
            onClick={
              onReassessment
            }
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white"
          >
            <RotateCcw
              size={16}
            />

            Reassess
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {(
            assessment
              ?.conceptScores ||
            []
          ).map(
            (item) => (
              <div
                key={
                  item.conceptId
                }
              >
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-bold">
                    {
                      item.conceptName
                    }
                  </span>

                  <span className="font-bold">
                    {item.score}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-violet-600"
                    style={{
                      width: `${item.score}%`,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {history.length >
        0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-black">
              Assessment History
            </h2>

            <div className="mt-4 divide-y divide-slate-100">
              {history.map(
                (item) => (
                  <div
                    key={
                      item._id
                    }
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <div className="font-bold capitalize">
                        {
                          item.type ||
                          "assessment"
                        }
                      </div>

                      <div className="text-xs text-slate-400">
                        {item.createdAt
                          ? new Date(
                            item.createdAt
                          ).toLocaleString()
                          : "—"}
                      </div>
                    </div>

                    <div className="font-black text-violet-700">
                      {
                        item.overallScore ??
                        0
                      }
                      %
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {!assessment && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Complete a diagnostic assessment to see your progress.
        </div>
      )}
    </div>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 transition group-hover:scale-105">
        {icon}
      </div>

      <div className="text-sm text-slate-500">
        {label}
      </div>

      <div className="mt-1 truncate text-xl font-black">
        {value}
      </div>
    </div>
  );
}

export default App;