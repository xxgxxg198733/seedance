"use client";

import { useState, useRef } from "react";
import { ImageIcon, Sparkles, Clock, X, Upload } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";

export default function ImagePage() {
  const { fetchCredits } = useCredits();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("2K");
  const [refImage, setRefImage] = useState<File | null>(null);
  const [refPreview, setRefPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setRefImage(file); setRefPreview(URL.createObjectURL(file)); }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !refImage) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let refUrl: string | undefined;
      if (refImage) {
        setUploading(true);
        const fd = new FormData();
        fd.append("file", refImage);
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        const upData = await upRes.json();
        refUrl = upData.url;
        setUploading(false);
      }

      const res = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt || "Generate a variation", modelId: "seedream-5", aspectRatio, resolution, referenceImages: refUrl ? [refUrl] : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.output?.url);
      if (data.credits_remaining !== undefined) fetchCredits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-72 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-violet-400" /> AI Image
        </h2>

        <div className="rounded-xl border border-violet-500/20 bg-violet-950/30 p-3">
          <p className="text-xs text-violet-300 font-medium">🚀 Seedream 5.0</p>
          <p className="text-xs text-zinc-500 mt-1">Doubao · 2K cinematic quality</p>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-400">Aspect Ratio</label>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-zinc-900 p-1">
            {["1:1", "16:9", "9:16"].map((r) => (
              <button key={r} onClick={() => setAspectRatio(r)}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-all ${aspectRatio === r ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>{r}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-400">Resolution</label>
          <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-zinc-900 p-1">
            {["2K", "1K"].map((res) => (
              <button key={res} onClick={() => setResolution(res)}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-all ${resolution === res ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>{res}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {!result && !isLoading ? (
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
                <ImageIcon className="h-8 w-8 text-violet-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Generate an Image</h2>
              <p className="mt-1 text-zinc-500">Upload a reference or describe your image.</p>
            </div>

            {/* Reference image */}
            {refPreview ? (
              <div className="relative mx-auto w-48 rounded-xl overflow-hidden border border-zinc-700">
                <img src={refPreview} alt="Reference" className="w-full" />
                <button onClick={() => { setRefImage(null); setRefPreview(null); }}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600">
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-xs text-zinc-300">Reference</div>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()}
                className="mx-auto flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-zinc-700 p-8 hover:border-violet-500/30 transition-colors cursor-pointer w-64">
                <Upload className="h-8 w-8 text-zinc-500" />
                <span className="text-sm text-zinc-500">Upload reference image</span>
                <span className="text-xs text-zinc-600">Optional — for image-to-image</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              rows={3} maxLength={2000}
              className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none" />
            <p className="text-right text-xs text-zinc-600">{prompt.length}/2000</p>

            {error && <div className="rounded-xl border border-red-500/20 bg-red-950/30 p-3 text-sm text-red-400">{error}</div>}

            <button onClick={handleGenerate} disabled={isLoading || uploading || (!prompt.trim() && !refImage)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 text-base font-medium text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? <><Clock className="h-4 w-4 animate-spin" /> Uploading...</> :
               isLoading ? <><Clock className="h-4 w-4 animate-spin" /> Generating...</> :
               <><Sparkles className="h-4 w-4" /> Create</>}
            </button>
          </div>
        ) : isLoading || uploading ? (
          <div className="text-center space-y-4">
            <Clock className="mx-auto h-10 w-10 animate-spin text-violet-400" />
            <p className="text-zinc-400">{uploading ? "Uploading..." : "Seedream 5.0 is generating..."}</p>
          </div>
        ) : result ? (
          <div className="w-full max-w-3xl animate-fade-in">
            <img src={result} alt="Generated" className="w-full rounded-2xl shadow-2xl" />
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={() => window.open(result, "_blank")}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-700 px-3 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                🔗 Open Full
              </button>
              <button onClick={() => { setResult(null); setPrompt(""); setRefImage(null); setRefPreview(null); }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-xs font-medium text-white hover:bg-violet-500 transition-colors">
                <Sparkles className="h-3.5 w-3.5" /> Generate Another
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
