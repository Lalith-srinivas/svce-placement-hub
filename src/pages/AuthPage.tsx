import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { HomeNavbar } from "@/components/layout/HomeNavbar";
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Zap,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const { signIn, signUp, loginDemoStudent, user, hasProfile, isLoading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if already authenticated and initial loading finished
  React.useEffect(() => {
    if (isLoading) return;
    if (user) {
      if (hasProfile) {
        navigate("/profile", { replace: true });
      } else {
        navigate("/profile/onboarding", { replace: true });
      }
    }
  }, [user, hasProfile, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (mode === "signin") {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMsg(res.error);
        toast.error("Sign In Failed: " + res.error);
        setLoading(false);
      } else {
        toast.success("Welcome back to SVCE Placement Hub!");
        if (res.hasProfile) {
          navigate("/profile", { replace: true });
        } else {
          navigate("/profile/onboarding", { replace: true });
        }
      }
    } else {
      if (!fullName.trim()) {
        setErrorMsg("Full name is required");
        setLoading(false);
        return;
      }
      const res = await signUp(email, password, fullName);
      if (res.error) {
        setErrorMsg(res.error);
        toast.error("Sign Up Failed: " + res.error);
        setLoading(false);
      } else {
        toast.success("Account created successfully!");
        if (res.hasProfile) {
          navigate("/profile", { replace: true });
        } else {
          navigate("/profile/onboarding", { replace: true });
        }
      }
    }
  };

  const handleDemoLogin = () => {
    loginDemoStudent();
    toast.success("⚡ Logged in as Demo Student (Lalith Srinivas)!");
    navigate("/profile", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black">
      <HomeNavbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          {/* Header Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-neo-yellow px-3 py-1 font-mono text-xs font-black uppercase shadow-neo-sm">
              <GraduationCap className="h-4 w-4 stroke-[2.5]" />
              SVCE STUDENT PORTAL
            </div>
            <h1 className="mt-3 font-heading text-3xl font-black uppercase tracking-tight text-black sm:text-4xl">
              {mode === "signin" ? "Student Sign In" : "Create Account"}
            </h1>
            <p className="mt-2 text-xs font-bold text-slate-700">
              Access your personalized placement profile, track eligibility, and build your recruiter-ready profile.
            </p>
          </div>

          {/* Quick Demo Access Callout */}
          <div className="mb-6 rounded-xl border-3 border-black bg-neo-cyan/20 p-4 shadow-neo">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-neo-cyan text-black">
                <Zap className="h-4 w-4 fill-black" />
              </div>
              <div className="flex-1">
                <h2 className="text-xs font-black uppercase font-heading text-black">
                  Instant Evaluator Access
                </h2>
                <p className="text-[11px] font-bold text-slate-700 mt-0.5">
                  Skip email sign-up and test the full multi-step wizard and dashboard immediately.
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black bg-neo-yellow px-3 py-2 font-heading text-xs font-black uppercase shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
                  ⚡ Quick Demo Student Login
                </button>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-xl border-3 border-black bg-white p-6 shadow-neo sm:p-8">
            {/* Tabs */}
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg border-2 border-black bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg("");
                }}
                className={`rounded-md py-2 font-heading text-xs font-black uppercase transition-all ${
                  mode === "signin"
                    ? "border-2 border-black bg-white shadow-neo-sm text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                }}
                className={`rounded-md py-2 font-heading text-xs font-black uppercase transition-all ${
                  mode === "signup"
                    ? "border-2 border-black bg-white shadow-neo-sm text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Register
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border-2 border-neo-red bg-neo-red/10 p-3 text-xs font-bold text-red-900">
                <AlertCircle className="h-4 w-4 shrink-0 stroke-[2.5] text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === "signin" && (
              <div className="mb-4 flex items-center justify-between rounded-lg border border-black bg-slate-50 px-3 py-2 text-[11px] font-mono">
                <span className="text-slate-600 font-bold">
                  Demo Account: <span className="text-black font-black">lalith.student@svce.ac.in</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("lalith.student@svce.ac.in");
                    setPassword("svce2026");
                    setErrorMsg("");
                  }}
                  className="rounded border border-black bg-neo-yellow px-2 py-0.5 font-heading text-[10px] font-black uppercase text-black hover:bg-yellow-300 cursor-pointer"
                >
                  Autofill
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block font-mono text-[11px] font-black uppercase text-slate-800 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lalith Srinivas"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg border-2 border-black bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-mono text-[11px] font-black uppercase text-slate-800 mb-1">
                  College / Personal Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@svce.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border-2 border-black bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-black uppercase text-slate-800 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border-2 border-black bg-white py-2 pl-9 pr-3 text-sm font-bold text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neo-yellow"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-black bg-neo-green py-2.5 font-heading text-xs font-black uppercase shadow-neo hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-neo-hover active:translate-x-1 active:translate-y-1 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{mode === "signin" ? "Sign In to Profile" : "Create Account & Start Profile"}</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t-2 border-slate-100 pt-4 text-center">
              <p className="font-mono text-[11px] text-slate-600">
                Placement Cell, SVCE Autonomous. Secure authentication powered by Supabase.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
