import Link from "next/link";
import { ArrowRight, Play, Zap, Image, Video, Music, Users, Globe } from "lucide-react";

const btnPrimary = "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all h-11 gap-2 px-6 text-base bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25";
const btnOutline = "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all h-11 gap-2 px-6 text-base border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white";

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Create like a pro.<br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Just ask the Agent.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
            Your all-in-one AI director for video, image, avatar, voice, and music.
            Powered by 15+ cutting-edge AI models.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/agent" className={btnPrimary}>
              Start For Free <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link href="/explore" className={btnOutline}>
              <Play className="mr-1 h-4 w-4" /> Explore Creations
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {[
              { value: "30M+", label: "Creators", icon: Users },
              { value: "100M+", label: "Generations", icon: Zap },
              { value: "238", label: "Countries & Regions", icon: Globe },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-violet-400" />
                <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">Everything you need to create</h2>
          <p className="mb-12 text-center text-zinc-400">From images to viral videos, all in one platform.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "AI Video", desc: "Text & image to video", icon: Video, href: "/video" },
              { title: "AI Image", desc: "Generate & edit images", icon: Image, href: "/image" },
              { title: "AI Audio", desc: "Music & voice generation", icon: Music, href: "/audio" },
              { title: "AI Avatar", desc: "Talking avatars from photos", icon: Users, href: "/avatar" },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-violet-500/30 hover:bg-zinc-900">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                  <tool.icon className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">{tool.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-purple-950/50 p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to create?</h2>
            <p className="mt-4 text-lg text-zinc-400">Start with 20 free credits. No credit card required.</p>
            <Link href="/agent" className={`${btnPrimary} mt-8`}>
              Start Creating Free <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-600">&copy; 2026 Seedance. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-400">Pricing</Link>
              <Link href="#" className="text-sm text-zinc-600 hover:text-zinc-400">Terms</Link>
              <Link href="#" className="text-sm text-zinc-600 hover:text-zinc-400">Privacy</Link>
              <Link href="#" className="text-sm text-zinc-600 hover:text-zinc-400">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
