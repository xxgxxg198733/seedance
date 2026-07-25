"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const GOOGLE_CLIENT_ID = "43452014125-06hrfv4un6sdfatc9bs9es3karg05rq2.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (opts: Record<string, unknown>) => void;
          prompt: (cb?: (n: unknown) => void) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
      });
    };
    document.head.appendChild(script);
  }, []);

  const handleGoogleResponse = async (response: { credential: string }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Google login failed");

      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("redirect") ?? "/agent";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    window.google?.accounts.id.prompt((notification: any) => {
      if (notification?.isNotDisplayed?.()) {
        setError("Google Sign-In is blocked. Check your browser settings.");
      }
    });
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("redirect") ?? "/agent";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("If this email is registered, a login link has been sent.");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-zinc-950 to-zinc-950" />

      <div className="relative w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">← Home</Link>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl p-8">
          <h1 className="text-2xl font-bold text-white text-center">Sign in to Seedance AI</h1>

          {/* Google OAuth — client-side SDK */}
          <button onClick={handleGoogleClick} disabled={loading}
            className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-white text-sm font-medium text-zinc-800 hover:bg-zinc-100 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            )}
            Continue with Google
          </button>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-600">Or continue with</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <div className="mt-5 flex rounded-xl bg-zinc-800/50 p-1">
            <button onClick={() => setMode("password")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === "password" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              Password
            </button>
            <button onClick={() => setMode("magic")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === "magic" ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>
              Magic Link
            </button>
          </div>

          <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink} className="mt-4 space-y-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none" />

            {mode === "password" && (
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" required
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none" />
            )}

            {error && (
              <p className={`text-sm ${error.includes("sent") ? "text-green-400" : "text-red-400"}`}>{error}</p>
            )}

            <button type="submit" disabled={loading || !email}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-medium text-white hover:bg-violet-500 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "password" ? "Sign In" : "Send Magic Link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-violet-400 hover:underline">Sign up</Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          We are a Seedance AI community and have no affiliation with ByteDance.
        </p>
      </div>
    </div>
  );
}
