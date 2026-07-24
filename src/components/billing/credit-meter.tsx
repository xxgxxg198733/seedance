"use client";

import { useCredits } from "@/hooks/use-credits";
import { Coins } from "lucide-react";

export function CreditMeter() {
  const { credits } = useCredits();

  return (
    <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-1.5">
      <Coins className="h-4 w-4 text-amber-400" />
      <span className="text-sm font-medium text-white">{credits}</span>
      <span className="text-xs text-zinc-500">credits</span>
    </div>
  );
}
