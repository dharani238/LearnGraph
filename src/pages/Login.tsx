import { useState } from "react";
import {
  ArrowRight,
  Brain,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import { loginUser } from "../api/api";

interface LoginProps {
  onLogin: (token: string) => void;
  onRegister: () => void;
}

export default function Login({
  onLogin,
  onRegister,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await loginUser(
        email,
        password
      );

      localStorage.setItem(
        "learngraph_token",
        result.token
      );

      localStorage.setItem(
        "learngraph_user",
        JSON.stringify(result.user)
      );

      onLogin(result.token);
    } catch (err: any) {
      setError(
        err?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT */}
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between p-12 xl:p-20">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-900/30">
                <Brain size={23} />
              </div>

              <div>
                <div className="text-xl font-black">
                  LearnGraph
                </div>
                <div className="text-xs text-slate-400">
                  AI-powered learning
                </div>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-200">
                <Sparkles size={13} />
                Personalized learning intelligence
              </div>

              <h1 className="text-5xl font-black leading-tight xl:text-6xl">
                Find the concept
                <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  behind the confusion.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                LearnGraph identifies prerequisite gaps,
                creates targeted learning paths and helps
                you master concepts step by step.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  ["01", "Diagnose"],
                  ["02", "Learn"],
                  ["03", "Master"],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="text-xs font-black text-violet-300">
                      {number}
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-200">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              © 2026 LearnGraph
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center bg-slate-50 px-5 py-10 text-slate-900">
          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
                  <Brain size={23} />
                </div>

                <div>
                  <div className="text-xl font-black">
                    LearnGraph
                  </div>
                  <div className="text-xs text-slate-500">
                    AI-powered learning
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 md:p-9">

              <div>
                <div className="text-sm font-bold text-violet-600">
                  Welcome back
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Sign in to LearnGraph
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Continue your personalized learning journey.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm transition focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm transition focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-xl"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}

                  {!loading && (
                    <ArrowRight size={17} />
                  )}
                </button>
              </form>

              <div className="mt-7 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <button
                  onClick={onRegister}
                  className="font-black text-violet-600 hover:text-violet-700"
                >
                  Create account
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}