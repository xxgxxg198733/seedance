"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { CreditMeter } from "@/components/billing/credit-meter";
import { Zap, Settings, LogOut } from "lucide-react";

export function AppTopbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl px-6">
      <span className="text-sm font-medium text-zinc-400">Create like a pro. Just ask the Agent.</span>

      <div className="flex items-center gap-3">
        {user && <CreditMeter />}
        <Link href="/pricing" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-violet-600/50 px-3 text-xs font-medium text-violet-400 hover:bg-violet-600/10 transition-colors">
          <Zap className="h-3.5 w-3.5" /> Upgrade
        </Link>
        {user ? (
          <>
            <Link href="/settings"><Settings className="h-4 w-4 text-zinc-400 hover:text-white" /></Link>
            <button onClick={logout}><LogOut className="h-4 w-4 text-zinc-400 hover:text-red-400" /></button>
          </>
        ) : (
          <Link href="/login" className="text-xs font-medium text-zinc-400 hover:text-white">Log in</Link>
        )}
      </div>
    </header>
  );
}
