import { create } from "zustand";
import type { Track, Clip, ProjectData } from "@/types";
import { persist } from "zustand/middleware";

interface EditorState {
  // Project
  projectId: string | null;
  projectName: string;
  projectData: ProjectData;

  // Playback
  isPlaying: boolean;
  currentTime: number;
  zoom: number;

  // Selection
  selectedTrackId: string | null;
  selectedClipId: string | null;

  // Actions
  setProject: (id: string, name: string, data: ProjectData) => void;
  setProjectName: (name: string) => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<Track>) => void;
  addClip: (trackId: string, clip: Clip) => void;
  removeClip: (trackId: string, clipId: string) => void;
  updateClip: (trackId: string, clipId: string, updates: Partial<Clip>) => void;
  moveClip: (clipId: string, fromTrackId: string, toTrackId: string, newStartTime: number) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setZoom: (zoom: number) => void;
  selectTrack: (trackId: string | null) => void;
  selectClip: (clipId: string | null) => void;
  duplicateClip: (trackId: string, clipId: string) => void;
  splitClip: (trackId: string, clipId: string, atTime: number) => void;
  reset: () => void;
}

const defaultProjectData: ProjectData = {
  tracks: [],
  settings: { width: 1920, height: 1080, fps: 30, duration: 60 },
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      projectId: null,
      projectName: "Untitled Project",
      projectData: defaultProjectData,
      isPlaying: false,
      currentTime: 0,
      zoom: 1,
      selectedTrackId: null,
      selectedClipId: null,

      setProject: (id, name, data) =>
        set({ projectId: id, projectName: name, projectData: data }),

      setProjectName: (name) => set({ projectName: name }),

      addTrack: (track) =>
        set((s) => ({
          projectData: {
            ...s.projectData,
            tracks: [...s.projectData.tracks, track],
          },
        })),

      removeTrack: (trackId) =>
        set((s) => ({
          projectData: {
            ...s.projectData,
            tracks: s.projectData.tracks.filter((t) => t.id !== trackId),
          },
          selectedTrackId: s.selectedTrackId === trackId ? null : s.selectedTrackId,
        })),

      updateTrack: (trackId, updates) =>
        set((s) => ({
          projectData: {
            ...s.projectData,
            tracks: s.projectData.tracks.map((t) =>
              t.id === trackId ? { ...t, ...updates } : t
            ),
          },
        })),

      addClip: (trackId, clip) =>
        set((s) => ({
          projectData: {
            ...s.projectData,
            tracks: s.projectData.tracks.map((t) =>
              t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
            ),
          },
        })),

      removeClip: (trackId, clipId) =>
        set((s) => ({
          projectData: {
            ...s.projectData,
            tracks: s.projectData.tracks.map((t) =>
              t.id === trackId
                ? { ...t, clips: t.clips.filter((c) => c.id !== clipId) }
                : t
            ),
          },
          selectedClipId: s.selectedClipId === clipId ? null : s.selectedClipId,
        })),

      updateClip: (trackId, clipId, updates) =>
        set((s) => ({
          projectData: {
            ...s.projectData,
            tracks: s.projectData.tracks.map((t) =>
              t.id === trackId
                ? {
                    ...t,
                    clips: t.clips.map((c) =>
                      c.id === clipId ? { ...c, ...updates } : c
                    ),
                  }
                : t
            ),
          },
        })),

      moveClip: (clipId, fromTrackId, toTrackId, newStartTime) =>
        set((s) => {
          const fromTrack = s.projectData.tracks.find((t) => t.id === fromTrackId);
          const clip = fromTrack?.clips.find((c) => c.id === clipId);
          if (!clip) return s;

          return {
            projectData: {
              ...s.projectData,
              tracks: s.projectData.tracks.map((t) => {
                if (t.id === fromTrackId) {
                  return { ...t, clips: t.clips.filter((c) => c.id !== clipId) };
                }
                if (t.id === toTrackId) {
                  return {
                    ...t,
                    clips: [...t.clips, { ...clip, startTime: newStartTime }],
                  };
                }
                return t;
              }),
            },
          };
        }),

      duplicateClip: (trackId, clipId) =>
        set((s) => {
          const track = s.projectData.tracks.find((t) => t.id === trackId);
          const clip = track?.clips.find((c) => c.id === clipId);
          if (!clip) return s;
          const newClip = { ...clip, id: crypto.randomUUID(), startTime: clip.startTime + clip.duration };
          return {
            projectData: {
              ...s.projectData,
              tracks: s.projectData.tracks.map((t) =>
                t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t
              ),
            },
          };
        }),

      splitClip: (trackId, clipId, atTime) =>
        set((s) => {
          const track = s.projectData.tracks.find((t) => t.id === trackId);
          const clip = track?.clips.find((c) => c.id === clipId);
          if (!clip) return s;
          const firstPart = { ...clip, id: crypto.randomUUID(), duration: atTime - clip.startTime, trimEnd: clip.trimStart + (atTime - clip.startTime) };
          const secondPart = { ...clip, id: crypto.randomUUID(), startTime: atTime, duration: clip.duration - firstPart.duration, trimStart: clip.trimStart + (atTime - clip.startTime) };
          return {
            projectData: {
              ...s.projectData,
              tracks: s.projectData.tracks.map((t) =>
                t.id === trackId
                  ? { ...t, clips: t.clips.flatMap((c) => (c.id === clipId ? [firstPart, secondPart] : [c])) }
                  : t
              ),
            },
          };
        }),

      setPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setZoom: (zoom) => set({ zoom }),
      selectTrack: (trackId) => set({ selectedTrackId: trackId }),
      selectClip: (clipId) => set({ selectedClipId: clipId }),
      reset: () =>
        set({
          projectId: null,
          projectName: "Untitled Project",
          projectData: defaultProjectData,
          isPlaying: false,
          currentTime: 0,
          selectedTrackId: null,
          selectedClipId: null,
        }),
    }),
    { name: "canvas-editor" }
  )
);
