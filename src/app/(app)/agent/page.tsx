"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Bot, User, Send, Video, Image, Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
  toolResult?: { type: "image" | "video"; url: string; prompt: string } | null;
}

const quickPrompts = [
  { icon: Image, text: "Generate a cyberpunk cat wearing neon sunglasses, digital art" },
  { icon: Video, text: "Create a slow-motion video of waves crashing on rocks" },
  { icon: Image, text: "Paint a futuristic city sunset, Studio Ghibli animation style" },
  { icon: Video, text: "Make a close-up video of barista pouring latte art" },
];

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    setUploading(false);
    return urls;
  };

  const sendMessage = async (text: string, uploadedUrls: string[] = []) => {
    if ((!text.trim() && uploadedUrls.length === 0) || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text || "[Sent an image]",
      images: uploadedUrls.length > 0 ? uploadedUrls : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setImages([]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
            ...(m.images?.length ? { images: m.images } : {}),
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.content || "",
          toolResult: data.toolResult || null,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Sorry, error: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    let urls: string[] = [];
    if (images.length > 0) {
      urls = await uploadFiles(images);
    }
    await sendMessage(input, urls);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImages((prev) => [...prev, ...files]);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex h-full flex-col">
      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Seedance Agent</h1>
          <p className="mt-2 text-zinc-400 text-center max-w-md">
            DeepSeek-powered · Upload a reference image or describe your idea
          </p>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 max-w-xl">
            {quickPrompts.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p.text)} disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-left text-sm text-zinc-400 hover:border-violet-500/30 hover:text-white transition-all disabled:opacity-50">
                <p.icon className="h-4 w-4 text-violet-400 shrink-0" />
                <span className="line-clamp-2">{p.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/20">
                    <Bot className="h-4 w-4 text-violet-400" />
                  </div>
                )}
                <div className={cn("max-w-[85%] space-y-3", msg.role === "user" && "flex flex-col items-end")}>
                  {/* Images in user message */}
                  {msg.images && msg.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {msg.images.map((url, i) => (
                        <img key={i} src={url} alt="" className="h-32 w-32 rounded-xl object-cover border border-zinc-700" />
                      ))}
                    </div>
                  )}
                  {/* Text bubble */}
                  {msg.content && (
                    <div className={cn("rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "user" ? "bg-violet-600 text-white" : "bg-zinc-800/50 text-zinc-200")}>
                      {msg.content}
                    </div>
                  )}
                  {/* Generated media */}
                  {msg.toolResult && (
                    <div className="rounded-2xl overflow-hidden border border-zinc-700 shadow-xl">
                      {msg.toolResult.type === "image" ? (
                        <img src={msg.toolResult.url} alt={msg.toolResult.prompt}
                          className="w-full max-h-96 object-contain bg-zinc-900" />
                      ) : (
                        <video src={msg.toolResult.url} controls className="w-full max-h-96 bg-black" autoPlay loop />
                      )}
                      <div className="bg-zinc-900 px-4 py-2 text-xs text-zinc-500">
                        {msg.toolResult.type === "image" ? "🖼️ Seedream 5.0" : "🎬 Seedance 2.0"}
                      </div>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700">
                    <User className="h-4 w-4 text-zinc-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/20">
                  <Bot className="h-4 w-4 text-violet-400" />
                </div>
                <div className="rounded-2xl bg-zinc-800/50 px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-zinc-800 p-4">
        <div className="mx-auto max-w-3xl">
          {/* Image previews */}
          {images.length > 0 && (
            <div className="mb-3 flex gap-2 flex-wrap">
              {images.map((f, i) => (
                <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-zinc-700">
                  <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {uploading && (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-zinc-800/50">
                  <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
                </div>
              )}
            </div>
          )}

          <div className="flex items-end gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 p-2 focus-within:border-violet-500/50 transition-colors">
            <button onClick={() => fileRef.current?.click()} disabled={loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 hover:text-violet-400 hover:bg-zinc-800 transition-colors disabled:opacity-50">
              <Plus className="h-5 w-5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Describe what you want to create, or upload a reference image..."
              rows={1} disabled={loading}
              className="flex-1 resize-none bg-transparent px-1 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none" />
            <button onClick={handleSend} disabled={loading || (!input.trim() && images.length === 0)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-colors disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
