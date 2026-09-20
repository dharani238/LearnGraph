import { useState } from "react";
import {
  ArrowRight,
  Brain,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { registerUser } from "../api/api";

interface RegisterProps {
  onRegister: (token: string) => void;
  onLogin: () => void;
}

export default function Register({
  onRegister,
  onLogin,
}: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await registerUser(
        name,
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

      onRegister(result.token);
    } catch (err: any) {
      setError(
        err?.message ||
          "Could not create your account."
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
          <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between p-12 xl:p-20">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600">
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
                Build knowledge, not just scores
              </div>

              <h1 className="text-5xl font-black leading-tight xl:text-6xl">
                Learn from the
                <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  root of the problem.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                LearnGraph maps concept dependencies
                and helps you strengthen the prerequisite
                knowledge behind difficult topics.
              </p>
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

                <div className="text-xl font-black">
                  LearnGraph
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 md:p-9">

              <div>
                <div className="text-sm font-bold text-violet-600">
                  Get started
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Start your personalized learning journey.
                </p>
              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Your name"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:bg-white"
                    />
                  </div>
                </div>

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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:bg-white"
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
                      placeholder="At least 6 characters"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Confirm password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Repeat your password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}

                  {!loading && (
                    <ArrowRight size={17} />
                  )}
                </button>
              </form>

              <div className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  onClick={onLogin}
                  className="font-black text-violet-600 hover:text-violet-700"
                >
                  Sign in
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}