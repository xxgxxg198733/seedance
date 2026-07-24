"use client";

import { Button } from "@/components/ui/button";
import { PenTool, Plus, Play, Pause, SkipBack, SkipForward, Undo, Redo, Scissors, Type, Music } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils/cn";
import { formatDuration } from "@/lib/utils/format";
import Link from "next/link";

export default function CanvasPage() {
  const {
    projectName,
    projectData,
    isPlaying,
    currentTime,
    zoom,
    selectedTrackId,
    selectedClipId,
    setPlaying,
    setCurrentTime,
    setZoom,
    selectTrack,
    selectClip,
  } = useEditorStore();

  const totalDuration = projectData.settings.duration;

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
        <Button variant="ghost" size="icon-sm"><Undo className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon-sm"><Redo className="h-4 w-4" /></Button>
        <div className="mx-2 h-5 w-px bg-zinc-800" />
        <Button variant="ghost" size="icon-sm"><Scissors className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon-sm"><Type className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon-sm"><Music className="h-4 w-4" /></Button>
        <div className="ml-auto" />
        <span className="text-sm font-medium text-white">{projectName}</span>
        <div className="mx-2 h-5 w-px bg-zinc-800" />
        <Button variant="primary" size="sm">Export</Button>
      </div>

      {/* Preview + Properties */}
      <div className="flex flex-1 border-b border-zinc-800">
        <div className="flex-1 flex items-center justify-center bg-zinc-950 p-8">
          <div className="text-center">
            <PenTool className="mx-auto h-8 w-8 text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-500">Preview area</p>
            <p className="text-xs text-zinc-600">Drag assets from the media library below to get started</p>
          </div>
        </div>
        <div className="w-64 shrink-0 border-l border-zinc-800 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Properties</h3>
          {selectedClipId ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-500">Position</label>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <input placeholder="X" className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white" />
                  <input placeholder="Y" className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white" />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500">Scale</label>
                <input type="range" min="0.1" max="3" step="0.1" defaultValue="1" className="mt-1 w-full" />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Opacity</label>
                <input type="range" min="0" max="100" defaultValue="100" className="mt-1 w-full" />
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-600">Select a clip to edit its properties</p>
          )}
        </div>
      </div>

      {/* Media Library */}
      <div className="border-b border-zinc-800 px-4 py-2">
        <div className="flex gap-4">
          {["Images", "Videos", "Audio", "Text", "Transitions"].map((tab) => (
            <button key={tab} className="text-xs text-zinc-500 hover:text-white transition-colors py-1 border-b-2 border-transparent hover:border-violet-500/50">
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="h-48 overflow-y-auto bg-zinc-950">
        {/* Time ruler */}
        <div className="flex border-b border-zinc-800 text-xs text-zinc-600 px-4 py-1">
          {Array.from({ length: Math.ceil(totalDuration / 5) }).map((_, i) => (
            <div key={i} className="w-[100px] shrink-0">{formatDuration(i * 5)}</div>
          ))}
        </div>

        {/* Playhead */}
        <div className="relative h-6 border-b border-zinc-800">
          <div
            className="absolute top-0 h-full w-px bg-violet-500 z-10"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
          >
            <div className="h-2 w-2 -translate-x-1/2 rounded-full bg-violet-500" />
          </div>
        </div>

        {/* Tracks */}
        <div className="space-y-px">
          {projectData.tracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-zinc-500">No tracks yet</p>
              <p className="text-xs text-zinc-600 mt-1">
                <Link href="/app/assets" className="text-violet-400 hover:underline">Upload assets</Link> to start building your video
              </p>
            </div>
          ) : (
            projectData.tracks.map((track) => (
              <div
                key={track.id}
                className={cn(
                  "flex h-10 items-center border-b border-zinc-900 px-4 hover:bg-zinc-900/50 cursor-pointer",
                  selectedTrackId === track.id && "bg-zinc-900/80"
                )}
                onClick={() => selectTrack(track.id)}
              >
                <span className="w-20 shrink-0 text-xs text-zinc-500">{track.name}</span>
                <div className="flex-1 relative h-7">
                  {track.clips.map((clip) => (
                    <div
                      key={clip.id}
                      className={cn(
                        "absolute top-0 h-full rounded bg-violet-600/30 border border-violet-500/30 px-2 text-xs text-white flex items-center cursor-move",
                        selectedClipId === clip.id && "bg-violet-600/50 border-violet-400"
                      )}
                      style={{
                        left: `${(clip.startTime / totalDuration) * 100}%`,
                        width: `${(clip.duration / totalDuration) * 100}%`,
                      }}
                      onClick={(e) => { e.stopPropagation(); selectClip(clip.id); }}
                    >
                      {clip.assetName}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 border-t border-zinc-800 px-4 py-2">
          <Button variant="ghost" size="icon-sm" onClick={() => setCurrentTime(0)}>
            <SkipBack className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon-sm">
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
          <span className="ml-2 text-xs text-zinc-400 font-mono">
            {formatDuration(currentTime)} / {formatDuration(totalDuration)}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-xs text-zinc-600">{zoom}x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
