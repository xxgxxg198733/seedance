"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles, Upload, Zap } from "lucide-react";

export default function ViralStudioPage() {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [platform, setPlatform] = useState("tiktok");

  return (
    <div className="flex h-full">
      <div className="w-80 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-400" /> Viral Studio
          <span className="rounded-md bg-violet-600 px-1.5 py-0.5 text-[10px] text-white">New</span>
        </h2>

        <div>
          <label className="text-sm font-medium text-zinc-400">Platform</label>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-zinc-900 p-1">
            {["tiktok", "instagram", "youtube"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`rounded-md px-2 py-1.5 text-xs font-medium capitalize ${
                  platform === p ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-400">Variants</label>
          <select className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white">
            <option>3 variants</option>
            <option>5 variants</option>
            <option>10 variants</option>
          </select>
        </div>

        <p className="text-xs text-zinc-600">Creates multiple ad variants from one product image</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl text-center space-y-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
            <TrendingUp className="h-8 w-8 text-violet-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Viral Ad Generator</h2>
          <p className="text-zinc-500">Upload a product image and get multiple platform-optimized ad videos.</p>

          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-700 p-16 hover:border-violet-500/30 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 text-zinc-500" />
            <p className="text-sm text-zinc-500">Drop your product image here</p>
            <p className="text-xs text-zinc-600">Or click to browse</p>
          </div>

          <Button variant="primary" size="lg" className="gap-2">
            <Zap className="h-4 w-4" />
            Generate Viral Variants
          </Button>
        </div>
      </div>
    </div>
  );
}
