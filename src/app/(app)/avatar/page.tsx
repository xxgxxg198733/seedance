"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Upload, Sparkles, Mic, Play } from "lucide-react";

export default function AvatarPage() {
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("natural-female");

  return (
    <div className="flex h-full">
      <div className="w-80 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-violet-400" /> Talking Avatar
        </h2>

        <div>
          <label className="text-sm font-medium text-zinc-400">Voice</label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          >
            <option value="natural-female">Natural Female</option>
            <option value="natural-male">Natural Male</option>
            <option value="energetic-female">Energetic Female</option>
            <option value="warm-male">Warm Male</option>
          </select>
        </div>

        <p className="text-xs text-zinc-600">Upload a photo or choose from presets to create a talking avatar.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
              <User className="h-8 w-8 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Talking Avatar</h2>
            <p className="mt-1 text-zinc-500">Upload a photo and make it speak with AI.</p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-700 p-12 hover:border-violet-500/30 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-zinc-500" />
            <p className="text-sm text-zinc-500">Upload a portrait photo</p>
            <p className="text-xs text-zinc-600">Front-facing, well-lit photos work best</p>
          </div>

          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write what you want the avatar to say..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none"
          />

          <Button variant="primary" size="lg" className="w-full gap-2">
            <Mic className="h-4 w-4" />
            Generate Avatar Video
          </Button>
        </div>
      </div>
    </div>
  );
}
