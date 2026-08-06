"use client";

import Link from "next/link";
import { useCredits } from "@/hooks/use-credits";
import { Coins, Zap } from "lucide-react";

export function CreditMeter() {
  const { credits } = useCredits();
  const isLow = credits <= 10;

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${isLow ? "bg-red-950/50 border border-red-500/30" : "bg-zinc-800/50"}`}>
      <Coins className={`h-4 w-4 ${isLow ? "text-red-400" : "text-amber-400"}`} />
      <span className="text-sm font-medium text-white">{credits}</span>
      <span className="text-xs text-zinc-500">credits</span>
      {isLow && (
        <Link href="/pricing" className="ml-1 flex items-center gap-1 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-violet-500 transition-colors">
          <Zap className="h-3 w-3" /> Upgrade
        </Link>
      )}
    </div>
  );
}
