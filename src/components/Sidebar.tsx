import {
  LayoutDashboard,
  Brain,
  ClipboardCheck,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Network,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Learn",
    icon: Brain,
  },
  {
    label: "Assessments",
    icon: ClipboardCheck,
  },
  {
    label: "Progress",
    icon: TrendingUp,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Network size={21} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Learn<span className="text-indigo-600">Graph</span>
            </h1>

            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Smart Learning
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  size={19}
                  className={
                    item.active
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-700"
                  }
                />

                {item.label}

                {item.label === "Assessments" && (
                  <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                    2
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Support
        </p>

        <div className="space-y-1">
          <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
            <HelpCircle
              size={19}
              className="text-slate-400 group-hover:text-slate-700"
            />
            Help Center
          </button>

          <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
            <Settings
              size={19}
              className="text-slate-400 group-hover:text-slate-700"
            />
            Settings
          </button>
        </div>
      </nav>

      {/* Bottom Profile */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            A
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              Student
            </p>
            <p className="truncate text-xs text-slate-400">
              Learner account
            </p>
          </div>

          <LogOut size={16} className="text-slate-400" />
        </div>
      </div>
    </aside>
  );
}