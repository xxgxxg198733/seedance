import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Seedance vs Sora — Sora Alternative After Discontinuation (2026)",
  description:
    "Looking for a Sora alternative? Sora was discontinued April 2026. Seedance is the best replacement — 15+ AI video and image models including Seedance 2.0, with better pricing and no waitlist.",
};

export default function VsSoraPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-6 mb-12">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-amber-300">Sora Was Discontinued — April 26, 2026</h2>
              <p className="mt-1 text-sm text-amber-400/70">OpenAI shut down the Sora consumer app. The API will be available until September 2026. If you rely on Sora for content creation, you need an alternative now.</p>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white text-center">Seedance vs Sora</h1>
        <p className="mt-4 text-lg text-zinc-400 text-center">
          The best Sora alternative for AI video generation in 2026
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-500/30 bg-violet-950/10 p-8">
            <h3 className="text-xl font-bold text-violet-400">Seedance</h3>
            <ul className="mt-6 space-y-3">
              {[
                "✅ 15+ AI models in one platform",
                "✅ Seedance 2.0 with native audio & 1080p",
                "✅ Also includes Veo 3.1, Kling 3.0, Sora 2 access",
                "✅ AI image generation — Seedream 5.0, DALL-E 3, Flux Pro",
                "✅ AI music and avatar generation included",
                "✅ $20.1/month — all models included",
                "✅ 20 free credits, no credit card required",
                "✅ Full commercial license on all plans",
                "✅ Active development with regular model updates",
                "✅ Credits never expire, roll over monthly",
              ].map((item) => (
                <li key={item} className="text-sm text-zinc-300">{item}</li>
              ))}
            </ul>
            <Link href="/pricing" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
              Try Seedance Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 opacity-70">
            <h3 className="text-xl font-bold text-zinc-400 line-through">Sora</h3>
            <ul className="mt-6 space-y-3">
              {[
                "❌ Consumer app DISCONTINUED (April 26, 2026)",
                "⚠️ API ends September 2026",
                "❌ Required ChatGPT Plus ($20/mo) or Pro ($200/mo)",
                "❌ One model only — no image/audio/avatar tools",
                "❌ Aggressive content safety filters",
                "❌ No free tier, no trial",
                "❌ Waitlist and access issues",
                "❌ US-only restrictions on some features",
                "❌ Uncertain future — team reportedly reassigned",
                "❌ Expensive for what you get",
              ].map((item) => (
                <li key={item} className="text-sm text-zinc-500">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-purple-950/30 text-center">
          <h2 className="text-2xl font-bold text-white">Make the Switch from Sora to Seedance</h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Thousands of creators have already migrated from Sora to Seedance. Get access to more models, more features, and better pricing — all in one platform.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/agent" className="inline-flex h-12 items-center gap-2 rounded-lg bg-violet-600 px-8 text-base font-medium text-white hover:bg-violet-500 transition-all">
              Start Creating — Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
