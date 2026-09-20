import {
  Bell,
  ArrowRight,
  Flame,
  BookOpen,
  Target,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const stats = [
  {
    label: "Overall Mastery",
    value: "68%",
    icon: Target,
    description: "+8% this month",
  },
  {
    label: "Concepts Learned",
    value: "12",
    icon: BookOpen,
    description: "3 this week",
  },
  {
    label: "Learning Streak",
    value: "4",
    icon: Flame,
    description: "Keep going!",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
        <div>
          <p className="text-sm text-slate-400">Student Dashboard</p>
          <h2 className="text-lg font-semibold text-slate-900">
            Learning Overview
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50">
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
          </button>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              A
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Student
              </p>

              <p className="text-xs text-slate-400">
                Learner
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">

        {/* Welcome */}
        <section>
          <p className="mb-2 text-sm font-medium text-indigo-600">
            Welcome back 👋
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Good evening, Student
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Continue your learning journey and discover the concepts
            behind the topics you're finding difficult.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-emerald-600">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Continue Learning */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Continue Learning
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pick up where you left off.
              </p>
            </div>

            <button className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 sm:flex">
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Brain size={27} />
                  </div>

                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                        Computer Science
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      Recursion
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Continue understanding recursive calls
                    </p>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
                  Continue
                  <ArrowRight size={17} />
                </button>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Progress
                  </span>

                  <span className="text-xs font-bold text-indigo-600">
                    76%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[76%] rounded-full bg-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Graph Preview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Your Learning Graph
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              See how your concepts connect.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">

            {/* Graph */}
            <div className="relative min-h-[390px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

              <div className="absolute right-5 top-5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                Recursion pathway
              </div>

              <div className="flex h-full min-h-[330px] flex-col items-center justify-center">

                {/* Recursion */}
                <div className="w-48 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center shadow-sm">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={18} />
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    Recursion
                  </p>

                  <p className="mt-1 text-xs font-semibold text-emerald-600">
                    76% mastery
                  </p>
                </div>

                {/* Connector */}
                <div className="h-10 w-px bg-slate-300" />

                {/* Call Stack */}
                <div className="w-48 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center shadow-sm">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Brain size={18} />
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    Call Stack
                  </p>

                  <p className="mt-1 text-xs font-semibold text-amber-600">
                    55% mastery
                  </p>
                </div>

                {/* Connector */}
                <div className="h-10 w-px bg-slate-300" />

                {/* Root Gap */}
                <div className="w-56 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center shadow-md shadow-amber-100">
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <AlertTriangle size={18} />
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    Functions
                  </p>

                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-amber-600">
                    Root Gap · 25%
                  </p>
                </div>
              </div>
            </div>

            {/* Insight */}
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Target size={21} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Learning Insight
              </p>

              <h3 className="mt-2 text-xl font-bold">
                We found something underneath.
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your performance suggests that Functions may be affecting
                your understanding of more advanced concepts.
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">
                  Recommended next step
                </p>

                <p className="mt-1 font-semibold">
                  Review Functions
                </p>

                <div className="mt-3 h-1.5 rounded-full bg-white/10">
                  <div className="h-full w-1/4 rounded-full bg-amber-400" />
                </div>
              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Explore root gap
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}