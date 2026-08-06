"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Video, Sparkles, Clock, Monitor, Timer, Upload, X, Image, Plus } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";

const MODES = [
  { id: "text-to-video", label: "Text to Video", desc: "Describe your video" },
  { id: "image-to-video", label: "Image to Video", desc: "Upload a reference image" },
  { id: "first-frame", label: "First & Last Frame", desc: "Start + end images" },
];

export default function VideoPage() {
  const router = useRouter();
  const { fetchCredits } = useCredits();
  const [mode, setMode] = useState("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState(5);
  const [refImages, setRefImages] = useState<File[]>([]);
  const [refPreviews, setRefPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const max = mode === "first-frame" ? 2 : 7;
    const newFiles = files.slice(0, max - refImages.length);
    setRefImages((p) => [...p, ...newFiles]);
    setRefPreviews((p) => [...p, ...newFiles.map(URL.createObjectURL)]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeRef = (i: number) => {
    setRefImages((p) => p.filter((_, j) => j !== i));
    setRefPreviews((p) => p.filter((_, j) => j !== i));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && refImages.length === 0) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let refUrls: string[] | undefined;
      if (refImages.length > 0) {
        setUploading(true);
        refUrls = [];
        for (const f of refImages) {
          const fd = new FormData();
          fd.append("file", f);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const d = await res.json();
          if (d.url) refUrls.push(d.url);
        }
        setUploading(false);
      }

      const res = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || "Animate this image",
          modelId: "seedance-2",
          aspectRatio,
          duration,
          referenceImages: refUrls,
          mode,
        }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setError(`Insufficient credits — need ${data.required} but you have ${data.credits}. Upgrade to get 36,000+ credits.`);
        return;
      }
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

  const busy = isLoading || uploading;

  return (
    <div className="flex h-full">
      {/* Left Config Panel */}
      <div className="w-72 shrink-0 border-r border-zinc-800 p-6 overflow-y-auto space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Video className="h-5 w-5 text-violet-400" /> AI Video
        </h2>

        <div className="rounded-xl border border-violet-500/20 bg-violet-950/30 p-3">
          <p className="text-xs text-violet-300 font-medium">🚀 Seedance 2.0</p>
          <p className="text-xs text-zinc-500 mt-1">Multi-ref input · 1080p · AI voiceover · 5-15s</p>
        </div>

        <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-3">
          <p className="text-xs text-zinc-400">Credits per generation</p>
          <div className="mt-1.5 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">720p / 5s</span>
              <span className="text-violet-400 font-medium">20 credits</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">1080p / 10s</span>
              <span className="text-violet-400 font-medium">45 credits</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
            <Monitor className="h-3.5 w-3.5" /> Ratio
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-zinc-900 p-1">
            {["16:9", "9:16", "1:1"].map((r) => (
              <button key={r} onClick={() => setAspectRatio(r)}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-all ${aspectRatio === r ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>{r}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
            <Timer className="h-3.5 w-3.5" /> Duration
          </label>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-zinc-900 p-1">
            {[5, 10, 15].map((d) => (
              <button key={d} onClick={() => setDuration(d)}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-all ${duration === d ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}>{d}s</button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {!result && !isLoading ? (
          <div className="w-full max-w-2xl space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                <Video className="h-7 w-7 text-violet-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Create a Video</h2>
            </div>

            {/* Mode Tabs */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-900 p-1">
              {MODES.map((m) => (
                <button key={m.id} onClick={() => { setMode(m.id); setRefImages([]); setRefPreviews([]); }}
                  className={`rounded-lg px-3 py-2.5 text-center transition-all ${
                    mode === m.id ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}>
                  <p className="text-xs font-medium">{m.label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>

            {/* Upload Area */}
            {mode !== "text-to-video" && (
              <>
                {refPreviews.length > 0 ? (
                  <div className="flex gap-2 flex-wrap justify-center">
                    {refPreviews.map((url, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-zinc-700">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => removeRef(i)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600">
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center text-[10px] text-zinc-300 py-0.5">
                          {mode === "first-frame" ? (i === 0 ? "Start" : "End") : `Ref ${i + 1}`}
                        </div>
                      </div>
                    ))}
                    {refImages.length < (mode === "first-frame" ? 2 : 7) && (
                      <button onClick={() => fileRef.current?.click()}
                        className="w-24 h-24 rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center hover:border-violet-500/30 transition-colors">
                        <Plus className="h-5 w-5 text-zinc-500" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-zinc-700 p-10 hover:border-violet-500/30 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-zinc-500" />
                    <span className="text-sm text-zinc-400">
                      {mode === "first-frame" ? "Upload start & end images (2)" : "Upload reference images (up to 7)"}
                    </span>
                    <span className="text-xs text-zinc-600">Click or drag & drop</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
              </>
            )}

            {/* Prompt */}
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === "text-to-video"
                ? "Describe the video you want to create..."
                : "Describe the motion, camera, and style... (optional)"}
              rows={3} maxLength={2000}
              className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none" />
            <p className="text-right text-xs text-zinc-600">{prompt.length}/2000</p>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-950/30 p-4">
                <p className="text-sm text-red-400">{error}</p>
                {error.includes("Insufficient credits") && (
                  <button onClick={() => router.push("/pricing")}
                    className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg bg-violet-600 px-4 text-sm font-medium text-white hover:bg-violet-500 transition-colors">
                    ⚡ Upgrade Now — from $20.1/mo
                  </button>
                )}
              </div>
            )}

            <button onClick={handleGenerate} disabled={busy || (mode === "text-to-video" ? !prompt.trim() : refImages.length === 0)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 text-base font-medium text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {busy ? <><Clock className="h-4 w-4 animate-spin" /> {uploading ? "Uploading..." : "Generating..."}</> : <><Sparkles className="h-4 w-4" /> Create Video</>}
            </button>
          </div>
        ) : busy ? (
          <div className="text-center space-y-4">
            <Clock className="mx-auto h-10 w-10 animate-spin text-violet-400" />
            <p className="text-zinc-400">{uploading ? "Uploading reference images..." : "Seedance 2.0 is generating..."}</p>
            <p className="text-xs text-zinc-500">{!uploading && "This may take 1-3 minutes"}</p>
          </div>
        ) : result ? (
          <div className="w-full max-w-3xl animate-fade-in">
            <video src={result} controls className="w-full rounded-2xl shadow-2xl" autoPlay loop />
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={() => window.open(result, "_blank")}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-700 px-3 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">🔗 Open Full</button>
              <button onClick={() => { setResult(null); setPrompt(""); setRefImages([]); setRefPreviews([]); }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-xs font-medium text-white hover:bg-violet-500 transition-colors">
                <Sparkles className="h-3.5 w-3.5" /> Generate Another</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
