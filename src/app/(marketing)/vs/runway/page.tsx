import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Seedance vs Runway — Best AI Video Generator Comparison 2026",
  description:
    "Seedance vs Runway: Which AI video generator is right for you? Compare pricing, features, models, and output quality. Seedance gives you 15+ models vs Runway's single model — at a fraction of the cost.",
};

const rows = [
  { feature: "AI Models Available", seedance: "15+ models (Seedance 2.0, Sora 2, Veo 3.1, Kling 3.0, DALL-E 3, Flux Pro, etc.)", runway: "1 model (Runway Gen-4)", seedanceWin: true },
  { feature: "Video Generation", seedance: "Yes — 1080p, up to 15s", runway: "Yes — 4K, up to 60s", seedanceWin: false },
  { feature: "Image Generation", seedance: "Yes — 2K resolution, 4 models", runway: "Limited", seedanceWin: true },
  { feature: "Audio/Music Generation", seedance: "Yes — MusicGen included", runway: "No", seedanceWin: true },
  { feature: "AI Avatar Creation", seedance: "Yes — from single photo", runway: "No", seedanceWin: true },
  { feature: "Free Trial", seedance: "20 free credits, no credit card", runway: "125 one-time credits", seedanceWin: true },
  { feature: "Starting Price", seedance: "$20.1/month", runway: "$15/month", seedanceWin: false },
  { feature: "Credits Roll Over", seedance: "Yes — never expire", runway: "No — reset monthly", seedanceWin: true },
  { feature: "Failed Gen Cost", seedance: "No charge for failures", runway: "Credits consumed", seedanceWin: true },
  { feature: "Commercial License", seedance: "Included, all plans", runway: "Included", seedanceWin: true },
  { feature: "AI Models per Dollar", seedance: "15 models / $20.1 = 0.75 models/$", runway: "1 model / $15 = 0.07 models/$", seedanceWin: true },
];

export default function VsRunwayPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white text-center">Seedance vs Runway</h1>
        <p className="mt-4 text-lg text-zinc-400 text-center">The honest comparison for AI video creators in 2026</p>

        <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-zinc-800 bg-zinc-900">
            <div className="text-sm font-semibold text-white">Feature</div>
            <div className="text-sm font-semibold text-violet-400">Seedance</div>
            <div className="text-sm font-semibold text-zinc-400">Runway</div>
          </div>
          {rows.map((row) => (
            <div key={row.feature} className="grid grid-cols-3 gap-4 p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30">
              <div className="text-sm text-zinc-400">{row.feature}</div>
              <div className="text-sm text-white flex items-start gap-1.5">
                {row.seedanceWin && <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />}
                {row.seedance}
              </div>
              <div className="text-sm text-zinc-500">{row.runway}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-2xl border border-violet-500/20 bg-violet-950/20 text-center">
          <p className="text-white font-semibold text-lg">Bottom line: Seedance gives you 15+ AI models for creative work. Runway is a better video editor. Use both.</p>
          <Link href="/pricing" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
            Try Seedance Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
