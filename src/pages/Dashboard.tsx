import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  CircleHelp,
  Lightbulb,
  Network,
  PlayCircle,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface Subject {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface Topic {
  _id: string;
  subjectId: string;
  name: string;
  description?: string;
  difficulty?: string;
}

interface ConceptScore {
  conceptId: string;
  conceptName: string;
  score: number;
  correct: number;
  total: number;
}

interface RootGap {
  id: string;
  name: string;
  description?: string;
}

interface AssessmentResult {
  assessmentId: string;
  overallScore: number;
  rootGap: RootGap | null;
  conceptScores: ConceptScore[];
  weakConcepts: ConceptScore[];
}

interface DashboardProps {
  subjects: Subject[];
  selectedTopic: Topic | null;
  assessment: AssessmentResult | null;
  onSubjects: () => void;
  onGraph: () => void;
  onDiagnostic: () => void;
  onLearning: () => void;
}

export default function Dashboard({
  subjects,
  selectedTopic,
  assessment,
  onSubjects,
  onGraph,
  onDiagnostic,
  onLearning,
}: DashboardProps) {
  const score = Math.round(assessment?.overallScore ?? 0);

  const rootGap = assessment?.rootGap ?? null;

  const conceptScores = assessment?.conceptScores ?? [];

  const weakConcepts = [...conceptScores]
    .filter((concept) => concept.score < 60)
    .sort((a, b) => a.score - b.score);

  const topConcepts = [...conceptScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const userName =
    JSON.parse(localStorage.getItem("learngraph_user") || "{}")?.name ||
    "Learner";

  const firstName = userName.split(" ")[0];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-7 p-5 md:p-8">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl md:p-10">

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">

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
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-violet-700 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  <CircleHelp size={17} />
                  Start Diagnostic
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onGraph}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Network size={17} />
                  Explore Knowledge Graph
                </button>

              </div>
            </div>

            {/* RIGHT - LEARNING INTELLIGENCE */}

            <div>
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
                        Personalized analysis
                      </div>
                    </div>

                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                    {assessment ? "Analyzed" : "Ready"}
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
                            index < 3
                              ? "bg-violet-500/15 text-violet-200"
                              : "bg-emerald-400 text-emerald-950"
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

                  {rootGap ? (
                    <>
                      <p className="mt-2 text-sm font-black text-white">
                        Root gap detected: {rootGap.name}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-violet-100">
                        Focus on this prerequisite before moving deeper
                        into the topic.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-2 text-sm font-black text-white">
                        Don't reteach the whole topic.
                      </p>

                      <p className="mt-1 text-xs text-violet-100">
                        Take a diagnostic to find the missing concept.
                      </p>
                    </>
                  )}

                </div>

              </div>
            </div>

          </div>
        </section>


        {/* =====================================================
            WELCOME
        ===================================================== */}

        <section className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <p className="text-sm font-bold text-violet-600">
                Welcome back, {firstName} 👋
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                Let's find what is holding you back.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                LearnGraph analyzes your understanding and traces
                prerequisite relationships to identify the concept
                behind your confusion.
              </p>
            </div>

            {selectedTopic && (
              <div className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4">

                <p className="text-[10px] font-black uppercase tracking-wider text-violet-500">
                  Current topic
                </p>

                <p className="mt-1 font-black text-slate-900">
                  {selectedTopic.name}
                </p>

              </div>
            )}

          </div>

        </section>


        {/* =====================================================
            QUICK STATS
        ===================================================== */}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* SUBJECTS */}

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


          {/* TOPIC */}

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


          {/* SCORE */}

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


          {/* ROOT GAP */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

              <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                <Target size={21} />
              </div>

              <span className="text-xs font-bold text-orange-600">
                AI
              </span>

            </div>

            <div className="mt-5 truncate text-xl font-black">
              {rootGap?.name || "Not detected"}
            </div>

            <div className="mt-1 text-sm font-medium text-slate-500">
              Root prerequisite gap
            </div>

          </div>

        </section>


        {/* =====================================================
            AI ROOT GAP
        ===================================================== */}

        {rootGap && (
          <section className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-sm md:p-8">

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm">
                  <AlertTriangle size={26} />
                </div>

                <div>

                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-600">
                    <Sparkles size={14} />
                    AI detected a prerequisite gap
                  </div>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    {rootGap.name}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    {rootGap.description ||
                      "Your latest diagnostic suggests that this concept may be affecting your understanding of the current topic."}
                  </p>

                </div>

              </div>

              <button
                onClick={onLearning}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Learn this concept
                <ArrowRight size={16} />
              </button>

            </div>

            <div className="relative mt-6 rounded-2xl border border-amber-200/70 bg-white/70 p-4">

              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Latest assessment</span>

                <span className="font-black text-slate-900">
                  {score}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                  style={{
                    width: `${Math.min(Math.max(score, 0), 100)}%`,
                  }}
                />

              </div>

            </div>

          </section>
        )}


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
                Follow the learning path created from your latest assessment.
              </p>

            </div>

            <button
              onClick={onSubjects}
              className="inline-flex items-center gap-2 text-sm font-black text-violet-700 transition hover:text-violet-900"
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
                    {rootGap?.name ||
                      selectedTopic?.name ||
                      "Choose a topic"}
                  </h3>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    {rootGap
                      ? `Strengthen ${rootGap.name} before continuing with ${selectedTopic?.name || "this topic"}.`
                      : "Explore the dependency graph, take a diagnostic, identify your root gap, and follow a targeted learning path."}
                  </p>

                </div>

              </div>

              <button
                onClick={rootGap ? onLearning : onGraph}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                {rootGap ? "Continue Learning" : "Open Graph"}
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

        </section>


        {/* =====================================================
            CONCEPT MASTERY
        ===================================================== */}

        {conceptScores.length > 0 && (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">

              <div>

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                  <TrendingUp size={14} />
                  Concept mastery
                </div>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  Your understanding at a glance
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  See which concepts are strong and which need more attention.
                </p>

              </div>

            </div>


            <div className="mt-7 grid gap-4 md:grid-cols-3">

              {topConcepts.map((concept) => {

                const conceptScore = Math.round(concept.score);

                const isWeak = conceptScore < 60;

                return (
                  <div
                    key={concept.conceptId}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                        {isWeak ? (
                          <AlertTriangle size={19} />
                        ) : (
                          <CheckCircle2 size={19} />
                        )}
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                          isWeak
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isWeak ? "Needs focus" : "On track"}
                      </span>

                    </div>

                    <h3 className="mt-5 truncate text-base font-black text-slate-900">
                      {concept.conceptName}
                    </h3>

                    <div className="mt-4 flex items-center justify-between text-xs font-bold">

                      <span className="text-slate-500">
                        Mastery
                      </span>

                      <span className="text-slate-900">
                        {conceptScore}%
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">

                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isWeak
                            ? "bg-amber-400"
                            : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.max(conceptScore, 0),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

            {weakConcepts.length > 0 && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">

                <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
                  <Lightbulb size={18} />
                </div>

                <p className="text-sm text-amber-900">
                  <span className="font-black">
                    {weakConcepts.length} concept
                    {weakConcepts.length > 1 ? "s" : ""}
                  </span>{" "}
                  may need additional practice based on your latest assessment.
                </p>

              </div>
            )}

          </section>
        )}


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
                {rootGap
                  ? `Strengthen ${rootGap.name}.`
                  : "Start with a diagnostic."}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100">
                {rootGap
                  ? "Continue your personalized learning path and work on the concept behind your confusion."
                  : "Let LearnGraph discover the concept that is actually blocking your progress."}
              </p>

            </div>

            <button
              onClick={rootGap ? onLearning : onDiagnostic}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-black text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {rootGap ? "Continue Learning" : "Start Diagnostic"}
              <ArrowRight size={17} />
            </button>

          </div>

        </section>

      </div>
    </main>
  );
}