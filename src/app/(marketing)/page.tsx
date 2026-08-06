import Link from "next/link";
import { ArrowRight, Play, Zap, Image, Video, Music, Users, Globe, Check, Sparkles, Film, Camera, Radio, UserPlus, TrendingUp, Shield, Layers } from "lucide-react";
import { HomepageJsonLd } from "@/components/seo/json-ld";

const btnPrimary = "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all h-11 gap-2 px-6 text-base bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25";
const btnOutline = "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all h-11 gap-2 px-6 text-base border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white";

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <HomepageJsonLd />

      {/* Hero — primary keyword: AI video generator, AI image generator */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            AI Video & Image Generator<br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              for Content Creators
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
            The all-in-one AI creative suite — generate stunning videos from text prompts,
            create professional AI images, compose music, and build talking avatars.
            No credit card required to start.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/agent" className={btnPrimary}>
              Start Creating Free <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link href="/explore" className={btnOutline}>
              <Play className="mr-1 h-4 w-4" /> Explore AI Creations
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {[
              { value: "30M+", label: "Content Creators", icon: Users },
              { value: "100M+", label: "AI Generations", icon: Zap },
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

      {/* Tools Grid — keyword-rich descriptions */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            All-in-One AI Content Creation Platform
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            From text-to-video generation to AI image creation — everything a content creator needs in one place.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "AI Video Generator", desc: "Turn text prompts and images into cinematic videos. Best online ai video maker for social media, ads, and YouTube.", icon: Film, href: "/video" },
              { title: "AI Image Generator", desc: "Generate professional images from text descriptions. High-quality ai art and photo creator with 2K resolution.", icon: Camera, href: "/image" },
              { title: "AI Music & Voice", desc: "Create original music tracks and realistic voiceovers. Royalty-free ai music generator for video content.", icon: Radio, href: "/audio" },
              { title: "AI Avatar Creator", desc: "Build talking avatars from a single photo. Digital human and virtual presenter for videos and presentations.", icon: UserPlus, href: "/avatar" },
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

      {/* Why Seedance — competitor comparison keywords */}
      <section className="py-20 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            The Best AI Video Generator Alternative
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            Looking for a Sora alternative, Runway alternative, or Kling alternative? Here&apos;s why creators choose Seedance.
          </p>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "15+ AI Models in One Platform",
                desc: "Unlike Runway ML or Sora, Seedance gives you access to Seedance 2.0, Seedream 5.0, Wan 2.7, Kling 3.0, Veo 3.1, and 10 more models — all under one subscription.",
              },
              {
                icon: Zap,
                title: "Faster & More Affordable",
                desc: "A cheaper alternative to Runway and other ai video tools. Generate 1080p videos and 2K images at a fraction of the cost. Start with free credits — no credit card required.",
              },
              {
                icon: TrendingUp,
                title: "Built for Professional Creators",
                desc: "Whether you need an ai video generator for YouTube, TikTok, marketing ads, or ecommerce — Seedance delivers cinematic quality with AI voiceover and multi-reference input.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                  <item.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases — scenario keywords */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            AI Content Creation for Every Use Case
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            From social media content creators to digital marketing agencies — ai tools for every workflow.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "YouTube Creators", desc: "Generate ai videos for YouTube — explainer videos, B-roll, intros, and full content with AI voiceover." },
              { title: "TikTok & Reels", desc: "Create viral short-form videos with ai video generator for TikTok and Instagram Reels. Quick, engaging, professional." },
              { title: "Digital Marketing", desc: "AI video for ads, product demos, and brand storytelling. Perfect for marketers, agencies, and ecommerce brands." },
              { title: "Small Business", desc: "Affordable ai video generator for small business — create promotional content, social media posts, and website videos without a team." },
              { title: "Online Educators", desc: "AI tools for course creators and educators. Generate tutorial videos, explainer content, and educational animations." },
              { title: "Freelance Creators", desc: "Complete ai creative suite for freelancers — video, image, audio, and avatar generation in one platform." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-violet-500/20 transition-colors">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — how-to keywords */}
      <section className="py-20 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            How to Create AI Videos in 3 Steps
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            Getting started with AI video creation is easy. No download, no installation — everything runs in your browser.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Describe Your Vision", desc: "Type a text prompt or upload a reference image. Our AI enhances your description for the best results." },
              { step: "2", title: "Choose Your AI Model", desc: "Pick from 15+ cutting-edge models including Seedance 2.0, Sora 2, Veo 3.1, and Kling 3.0 for your project." },
              { step: "3", title: "Generate & Download", desc: "Your AI video, image, or music is ready in minutes. Download in high resolution — 1080p video, 2K images." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights — adds keyword density naturally */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Professional AI Video Generator — No Watermark, Full Commercial License
              </h2>
              <ul className="mt-6 space-y-3">
                {[
                  "Generate video from text prompts — cinematic quality up to 1080p",
                  "Turn photos into videos with AI image-to-video animation",
                  "Built-in AI voiceover and background music for videos",
                  "Create ai videos for social media, YouTube, TikTok, and ads",
                  "All plans include full commercial license for client work",
                  "Credits roll over each month and never expire",
                  "Failed generations don't consume credits — you only pay for success",
                  "Web-based ai video maker — no software download required",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                AI Image Generator — 2K Resolution, Multiple Styles
              </h2>
              <ul className="mt-6 space-y-3">
                {[
                  "Create stunning images from text descriptions with Seedream 5.0",
                  "Generate ai art, portraits, landscapes, and product photography",
                  "Reference image support — upload a photo and create variations",
                  "Multiple aspect ratios: square, landscape, and portrait",
                  "Mix and match AI models: Seedream, DALL-E 3, Flux Pro, SD XL",
                  "High-resolution 2K output for print and digital use",
                  "Royalty-free ai generated images for commercial projects",
                  "Batch generation supported for high-volume content needs",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-purple-950/50 p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Start Creating with Free AI Tools
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Join millions of content creators using Seedance. Get 20 free credits today — no credit card, no subscription required.
            </p>
            <Link href="/agent" className={`${btnPrimary} mt-8`}>
              Try Free AI Video Generator <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-600">&copy; 2026 Seedance — AI Video Generator & Creative Suite. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="https://toolchase.com" target="_blank" rel="noopener" className="text-sm text-zinc-600 hover:text-zinc-400">Listed on ToolChase</a>
              <Link href="/free-ai-tools" className="text-sm text-zinc-600 hover:text-zinc-400">Free AI Tools</Link>
              <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-400">Pricing</Link>
              <Link href="#" className="text-sm text-zinc-600 hover:text-zinc-400">Terms</Link>
              <Link href="#" className="text-sm text-zinc-600 hover:text-zinc-400">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
