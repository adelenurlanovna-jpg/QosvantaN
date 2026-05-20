"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = "email" | "code";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError = searchParams.get("error");

  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ? "Sign-in failed. Please try again." : null);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setGoogleLoading(false);
      setError(error.message);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setEmailLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });
    setEmailLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep("code");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 8) return;
    setEmailLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: "email",
    });
    setEmailLoading(false);
    if (error) {
      setError("Invalid or expired code. Please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12"
      style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)" }}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl p-6 sm:p-10"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <img
            src="/logo-icon-transparent.png"
            alt=""
            aria-hidden
            className="w-9 h-9 rounded-lg"
            style={{ display: "block" }}
          />
          <span className="font-bold text-[17px] tracking-tight" style={{ color: "#0F172A" }}>
            Qosvanta
          </span>
        </Link>

        {step === "email" ? (
          <>
            <h1 className="text-[26px] font-bold text-center mb-2 tracking-tight" style={{ color: "#0F172A" }}>
              Welcome back
            </h1>
            <p className="text-center text-sm mb-8" style={{ color: "#64748B" }}>
              Sign in to access your dashboard
            </p>

            {error && (
              <div
                className="mb-5 px-4 py-3 rounded-lg text-sm"
                style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading || emailLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-full text-sm font-semibold transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: "#0F172A", border: "1px solid rgba(15,23,42,0.14)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: "rgba(15,23,42,0.08)" }} />
              <span className="text-xs" style={{ color: "#94A3B8" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(15,23,42,0.08)" }} />
            </div>

            <form onSubmit={handleSendCode} className="space-y-3">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailLoading || googleLoading}
                className="w-full px-4 py-3 rounded-full text-sm transition-all focus:outline-none focus:border-blue-400 disabled:opacity-50"
                style={{ border: "1px solid rgba(15,23,42,0.14)", color: "#0F172A" }}
              />
              <button
                type="submit"
                disabled={emailLoading || googleLoading || !email}
                className="w-full py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
              >
                {emailLoading ? "Sending..." : "Send code to email"}
              </button>
            </form>

            <p className="text-center text-xs mt-6" style={{ color: "#94A3B8" }}>
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-slate-700">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="underline hover:text-slate-700">Privacy Policy</Link>.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-[26px] font-bold text-center mb-2 tracking-tight" style={{ color: "#0F172A" }}>
              Check your email
            </h1>
            <p className="text-center text-sm mb-8" style={{ color: "#64748B" }}>
              We sent an 8-digit code to <span style={{ color: "#0F172A", fontWeight: 500 }}>{email}</span>
            </p>

            {error && (
              <div
                className="mb-5 px-4 py-3 rounded-lg text-sm"
                style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={8}
                required
                placeholder="12345678"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                disabled={emailLoading}
                autoFocus
                className="w-full px-4 py-3 rounded-full text-center text-lg font-semibold tracking-[0.3em] transition-all focus:outline-none focus:border-blue-400 disabled:opacity-50"
                style={{ border: "1px solid rgba(15,23,42,0.14)", color: "#0F172A" }}
              />
              <button
                type="submit"
                disabled={emailLoading || code.length < 8}
                className="w-full py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #3B82F6, #7C3AED)" }}
              >
                {emailLoading ? "Verifying..." : "Verify and sign in"}
              </button>
            </form>

            <button
              onClick={() => { setStep("email"); setCode(""); setError(null); }}
              className="w-full text-center text-xs mt-6 hover:text-slate-700"
              style={{ color: "#94A3B8" }}
            >
              ← Use a different email
            </button>
          </>
        )}
      </div>
    </main>
  );
}
