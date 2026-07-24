"use client";

import Link from "next/link";
import { Layout, Sparkles, Video, Image, Music } from "lucide-react";

const tools = [
  { icon: Video, label: "Video", desc: "Generate videos from text or images", href: "/app/video" },
  { icon: Image, label: "Image", desc: "Create stunning AI-generated images", href: "/app/image" },
  { icon: Music, label: "Audio", desc: "Compose music and sound effects", href: "/app/audio" },
  { icon: Layout, label: "Canvas", desc: "Edit and compose your video timeline", href: "/app/canvas" },
];

export default function StudioPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600">
          <Layout className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">AI Studio</h1>
        <p className="mt-3 text-zinc-400">
          Your creative workspace. Combine AI tools to produce professional content.
          Start with any tool below or ask the Agent to orchestrate everything.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.label}
              href={tool.href}
              className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-left hover:border-violet-500/30 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                <tool.icon className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">{tool.label}</h3>
                <p className="mt-1 text-sm text-zinc-500">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/app/agent" className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-violet-600 px-6 text-base font-medium text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25 transition-colors">
          <Sparkles className="h-4 w-4" /> Open Agent
        </Link>
      </div>
    </div>
  );
}
