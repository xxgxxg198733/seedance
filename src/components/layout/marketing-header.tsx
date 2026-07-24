"use client";

import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { APP_NAME } from "@/lib/utils/constants";

export function MarketingHeader() {
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold">D</div>
            {APP_NAME}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/explore" className="text-sm text-zinc-400 hover:text-white transition-colors">Explore</Link>
            <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user ? (
            <>
              <Link href="/agent" className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <span className="text-sm text-zinc-500">{user.email}</span>
              <button onClick={logout} className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-black hover:bg-zinc-200 transition-colors">
                Start For Free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white p-2 rounded-lg hover:bg-zinc-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-black p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/explore" className="text-sm text-zinc-400">Explore</Link>
            <Link href="/pricing" className="text-sm text-zinc-400">Pricing</Link>
            {user ? (
              <>
                <Link href="/agent" className="text-sm text-zinc-400">Dashboard</Link>
                <button onClick={logout} className="text-sm text-zinc-400 text-left">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-zinc-400">Log in</Link>
                <Link href="/register" className="mt-2 text-center inline-flex h-9 items-center justify-center rounded-lg bg-white text-sm font-medium text-black">Start For Free</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
