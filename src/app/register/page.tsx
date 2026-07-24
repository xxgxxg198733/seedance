"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("redirect") ?? "/agent";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 text-xl font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold">D</div>
          Seedance
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
          <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
          <p className="text-sm text-zinc-500 mb-6">Start with 20 free credits</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400">Name</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 focus-within:border-violet-500/50">
                <User className="h-4 w-4 text-zinc-500" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your name" required
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-400">Email</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 focus-within:border-violet-500/50">
                <Mail className="h-4 w-4 text-zinc-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 focus-within:border-violet-500/50">
                <Lock className="h-4 w-4 text-zinc-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters" required minLength={6}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none" />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account? <Link href="/login" className="text-violet-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
