"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages, Upload, Sparkles } from "lucide-react";

const languages = [
  { code: "es", name: "Spanish" },
  { code: "pt", name: "Portuguese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
];

export default function TranslatorPage() {
  const [targetLang, setTargetLang] = useState("es");

  return (
    <div className="flex h-full">
      <div className="w-80 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Languages className="h-5 w-5 text-violet-400" /> Video Translator
        </h2>

        <div>
          <label className="text-sm font-medium text-zinc-400">Target Language</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-zinc-600">Upload a video and translate its speech to another language with voice cloning.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl text-center space-y-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
            <Languages className="h-8 w-8 text-violet-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Video Translator</h2>
          <p className="text-zinc-500">Dub your videos into any language while preserving the original voice.</p>

          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-700 p-16 hover:border-violet-500/30 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 text-zinc-500" />
            <p className="text-sm text-zinc-500">Drop your video here</p>
            <p className="text-xs text-zinc-600">Supports MP4, MOV, WebM</p>
          </div>

          <Button variant="primary" size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Translate & Dub
          </Button>
        </div>
      </div>
    </div>
  );
}
