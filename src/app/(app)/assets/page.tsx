"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen, Upload, Search, Grid3X3, List, MoreHorizontal, Image, Video, Music, File, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatFileSize, formatRelativeTime } from "@/lib/utils/format";

// Mock assets for demonstration
const mockAssets = [
  { id: "1", name: "sunset-video.mp4", type: "VIDEO" as const, url: "", size: 24500000, duration: 10, createdAt: new Date(Date.now() - 3600000) },
  { id: "2", name: "mountain-landscape.png", type: "IMAGE" as const, url: "https://picsum.photos/400/300", size: 2300000, createdAt: new Date(Date.now() - 7200000) },
  { id: "3", name: "podcast-intro.mp3", type: "AUDIO" as const, url: "", size: 5400000, duration: 45, createdAt: new Date(Date.now() - 86400000) },
  { id: "4", name: "product-shot.jpg", type: "IMAGE" as const, url: "https://picsum.photos/400/400", size: 1800000, createdAt: new Date(Date.now() - 172800000) },
  { id: "5", name: "ad-variant-1.mp4", type: "VIDEO" as const, url: "", size: 12000000, duration: 15, createdAt: new Date(Date.now() - 259200000) },
];

const typeIcons = {
  VIDEO: Video,
  IMAGE: Image,
  AUDIO: Music,
  OTHER: File,
};

export default function AssetsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockAssets.filter(
    (a) =>
      (!selectedType || a.type === selectedType) &&
      (!search || a.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex h-full flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-violet-400" /> Assets
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Your media library</p>
        </div>
        <Button variant="primary" size="sm">
          <Upload className="mr-1 h-4 w-4" /> Upload
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none"
          />
        </div>

        <div className="flex rounded-lg bg-zinc-900 p-1">
          {["All", "IMAGE", "VIDEO", "AUDIO"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type === "All" ? null : type)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium",
                (type === "All" && !selectedType) || selectedType === type
                  ? "bg-violet-600 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="flex rounded-lg bg-zinc-900 p-1 ml-auto">
          <button
            onClick={() => setView("grid")}
            className={cn("rounded-md p-1.5", view === "grid" ? "bg-zinc-700 text-white" : "text-zinc-500")}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("rounded-md p-1.5", view === "list" ? "bg-zinc-700 text-white" : "text-zinc-500")}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grid / List */}
      {view === "grid" ? (
        <div className="grid flex-1 auto-rows-max grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((asset) => {
            const Icon = typeIcons[asset.type];
            return (
              <div key={asset.id} className="group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-violet-500/30 transition-all">
                <div className="aspect-video rounded-t-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {asset.type === "IMAGE" && asset.url ? (
                    <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
                  ) : (
                    <Icon className="h-8 w-8 text-zinc-600" />
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                    <span>{asset.type}</span>
                    <span>{formatFileSize(asset.size)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 space-y-1">
          {filtered.map((asset) => {
            const Icon = typeIcons[asset.type];
            return (
              <div key={asset.id} className="flex items-center gap-4 rounded-lg px-4 py-3 hover:bg-zinc-800/50 cursor-pointer transition-colors">
                <Icon className="h-5 w-5 text-zinc-400" />
                <span className="flex-1 text-sm text-white">{asset.name}</span>
                <span className="text-xs text-zinc-500">{formatFileSize(asset.size)}</span>
                <span className="text-xs text-zinc-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {formatRelativeTime(asset.createdAt)}
                </span>
                <button className="text-zinc-600 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-zinc-700" />
            <p className="mt-4 text-zinc-500">No assets found</p>
            <Button variant="outline" size="sm" className="mt-4">
              <Upload className="mr-1 h-4 w-4" /> Upload your first asset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
