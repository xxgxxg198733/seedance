import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Seedance vs Kling — Best AI Video Generator Comparison 2026",
  description:
    "Seedance vs Kling AI: Compare the top AI video generators. Seedance offers 15+ models vs Kling's one — including Seedance 2.0, Veo 3.1, and Sora 2. Better value at $20.1/month.",
};

const rows = [
  { f: "AI Models", s: "15+ models in one platform", k: "1 model (Kling 3.0)", win: true },
  { f: "Video Quality", s: "1080p, cinematic", k: "1080p, excellent motion", win: false },
  { f: "Image Generation", s: "Yes — 4 image models", k: "No", win: true },
  { f: "Audio Generation", s: "Yes — MusicGen", k: "No", win: true },
  { f: "Avatar Creation", s: "Yes", k: "No", win: true },
  { f: "Free Tier", s: "20 free credits, no card", k: "66 daily credits", win: false },
  { f: "Starting Price", s: "$20.1/month", k: "$10/month", win: false },
  { f: "Platform Access", s: "Web — no download", k: "China-focused, limited global", win: true },
  { f: "Commercial License", s: "Included all plans", k: "Paid plans only", win: true },
  { f: "Credit Expiry", s: "Never expire", k: "Daily refresh only", win: true },
];

export default function VsKlingPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white text-center">Seedance vs Kling AI</h1>
        <p className="mt-4 text-lg text-zinc-400 text-center">Which AI video generator gives you more creative power?</p>
        <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-zinc-800 bg-zinc-900">
            <div className="text-sm font-semibold text-white">Feature</div>
            <div className="text-sm font-semibold text-violet-400 col-span-2">Seedance</div>
            <div className="text-sm font-semibold text-zinc-400">Kling AI</div>
          </div>
          {rows.map((r) => (
            <div key={r.f} className="grid grid-cols-4 gap-4 p-4 border-b border-zinc-800/50">
              <div className="text-sm text-zinc-400">{r.f}</div>
              <div className="text-sm text-white col-span-2 flex items-start gap-1.5">{r.win && <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />}{r.s}</div>
              <div className="text-sm text-zinc-500">{r.k}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 rounded-2xl border border-violet-500/20 bg-violet-950/20 text-center">
          <p className="text-white font-semibold text-lg">Kling is great for video. Seedance is great for everything — video, images, audio, avatars. Get more for your money.</p>
          <Link href="/pricing" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
            Try Seedance Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
