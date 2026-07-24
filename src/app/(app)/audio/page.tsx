"use client";

import { useState, useEffect, useRef } from "react";
import { Music, Play, Square } from "lucide-react";

export default function AudioPage() {
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [voice, setVoice] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const load = () => {
      const zh = synthRef.current!.getVoices().filter((v) => v.lang.startsWith("zh"));
      setVoices(zh.length > 0 ? zh : []);
      if (zh.length > 0 && !voice) setVoice(zh[0].name);
    };
    load();
    synthRef.current!.onvoiceschanged = load;
    return () => { synthRef.current?.cancel(); };
  }, []);

  const speak = () => {
    if (!text.trim() || speaking) return;
    synthRef.current?.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find((v) => v.name === voice);
    if (v) u.voice = v;
    u.lang = "zh-CN";
    u.rate = 1.0;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synthRef.current?.speak(u);
  };

  return (
    <div className="flex h-full">
      <div className="w-72 shrink-0 border-r border-zinc-800 p-6 space-y-6 overflow-y-auto">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Music className="h-5 w-5 text-violet-400" /> AI Speech
        </h2>
        <div className="rounded-xl border border-violet-500/20 bg-violet-950/30 p-3">
          <p className="text-xs text-violet-300 font-medium">🎙️ Browser Speech Synthesis</p>
          <p className="text-xs text-zinc-500 mt-1">Web Speech API · Free · Local</p>
        </div>
        {voices.length > 0 && (
          <div>
            <label className="text-sm font-medium text-zinc-400">Voice</label>
            <select value={voice} onChange={(e) => setVoice(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white">
              {voices.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
              <Music className="h-8 w-8 text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">AI Speech</h2>
            <p className="mt-1 text-zinc-500">Type text, browser reads aloud · Best on Chrome/Edge</p>
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Type text to read aloud..." rows={6}
            className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none" />
          <button onClick={speaking ? () => { synthRef.current?.cancel(); setSpeaking(false); } : speak}
            disabled={!text.trim() && !speaking}
            className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-6 text-base font-medium shadow-lg transition-all disabled:opacity-50 ${
              speaking ? "bg-red-600 text-white hover:bg-red-500" : "bg-violet-600 text-white hover:bg-violet-500 shadow-violet-500/25"
            }`}>
            {speaking ? <><Square className="h-4 w-4" /> Stop</> : <><Play className="h-4 w-4" /> Speak</>}
          </button>
          <p className="text-center text-xs text-zinc-600">Powered by Web Speech API · Best on Chrome or Edge</p>
        </div>
      </div>
    </div>
  );
}
