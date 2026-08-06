import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Free AI Video Generator — No Credit Card Required | Seedance",
  description:
    "Create professional AI videos, images, and music for free. 20 free credits to start, no credit card required. Generate from text prompts with Seedance 2.0, Kling 3.0, Veo 3.1 and more.",
};

const tools = [
  {
    title: "AI Video Generator",
    desc: "Turn text prompts into cinematic videos. Text-to-video and image-to-video with AI voiceover. 1080p output, no watermark.",
    href: "/video",
    tag: "Most Popular",
  },
  {
    title: "AI Image Generator",
    desc: "Generate stunning images from descriptions. 2K resolution, multiple styles and aspect ratios. Reference image support.",
    href: "/image",
    tag: "2K Quality",
  },
  {
    title: "AI Music Generator",
    desc: "Create original music tracks and sound effects. Royalty-free music for your videos, podcasts, and content.",
    href: "/audio",
  },
  {
    title: "AI Avatar Creator",
    desc: "Build talking avatars from a single photo. Perfect for presentations, tutorials, and social media content.",
    href: "/avatar",
  },
];

const comparisons = [
  { title: "Seedance vs Runway", desc: "15+ models vs 1. Cheaper, faster, more versatile." },
  { title: "Seedance vs Sora", desc: "Sora was discontinued. Seedance is the future." },
  { title: "Seedance vs Kling", desc: "Same video quality, more models, better pricing." },
  { title: "Seedance vs Veo", desc: "Access 15 models instead of just one." },
];

const faqs = [
  { q: "Is Seedance really free?", a: "Yes! New users get 20 free credits to try all features. No credit card, no subscription required to start." },
  { q: "Which AI models are available?", a: "Seedance 2.0, Seedream 5.0, Sora 2, Veo 3.1, Kling 3.0, Runway Gen-4.5, Wan 2.7, Luma Ray 3.2, DALL-E 3, Flux Pro, SD XL, and more." },
  { q: "Is there a watermark?", a: "No. All generations on paid plans are watermark-free with full commercial license." },
  { q: "How much does it cost?", a: "Plans start at $20.1/month with 36,000 credits per year. Premium at $34.9/mo, Advanced at $62.9/mo." },
  { q: "Do credits expire?", a: "No. Credits roll over each month and never expire as long as your account is active." },
  { q: "Can I use generated content commercially?", a: "Yes! All paid plans include full commercial license. Use generated videos, images, and music in client work." },
];

export default function FreeAIToolsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Free AI Video Generator
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
            Create professional AI videos, images, and music — completely free to start.
            20 free credits, no credit card required. Access 15+ cutting-edge AI models in one platform.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/agent"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-violet-600 px-8 text-base font-medium text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25 transition-all">
              Start Creating Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-zinc-700 bg-transparent px-8 text-base font-medium text-zinc-300 hover:bg-zinc-800 transition-all">
              View Plans
            </Link>
          </div>
        </div>

        {/* Free Tools Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Free AI Tools Included</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-violet-500/30 hover:bg-zinc-900">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-violet-400 transition-colors">{tool.title}</h3>
                  {tool.tag && (
                    <span className="rounded-full bg-violet-600/20 px-2.5 py-0.5 text-xs font-medium text-violet-400">{tool.tag}</span>
                  )}
                </div>
                <p className="text-zinc-400">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Seedance */}
        <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-purple-950/30 p-12 mb-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Choose Seedance Over Other AI Video Generators?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {comparisons.map((item) => (
              <div key={item.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <h3 className="font-semibold text-violet-400 text-sm">{item.title}</h3>
                <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">How to Create AI Videos for Free</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: "1", title: "Sign Up Free", desc: "Create an account in 30 seconds. No credit card required. Get 20 free credits instantly." },
              { step: "2", title: "Describe Your Video", desc: "Type a text prompt or upload a reference image. Our AI enhances your description automatically." },
              { step: "3", title: "Download & Share", desc: "Your AI video is ready in minutes. Download in 1080p, share on social media, or use in your projects." },
            ].map((item) => (
              <div key={item.step} className="text-center rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">{item.step}</div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-16">
          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-purple-950/50 p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Create with AI?
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Join creators worldwide using Seedance. Start with 20 free credits — no subscription needed.
            </p>
            <Link href="/agent" className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-violet-600 px-8 text-base font-medium text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25 transition-all">
              <Sparkles className="h-4 w-4" /> Try Free AI Generator
            </Link>
          </div>
        </div>

        {/* FAQ — Schema-friendly for featured snippets */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 group">
                <summary className="cursor-pointer text-sm font-medium text-white">{faq.q}</summary>
                <p className="mt-2 text-sm text-zinc-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
