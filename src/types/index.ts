import type { AssetType, GenerationType, GenStatus, Plan } from "../generated/prisma/client";

// Generation
export interface GenerationInput {
  prompt: string;
  modelId: string;
  negativePrompt?: string;
  aspectRatio?: string;
  resolution?: string;
  duration?: number;
  seed?: number;
  outputCount?: number;
  referenceImages?: string[];
  referenceAudio?: string;
  referenceVideo?: string;
  generateAudio?: boolean;
  mode?: string;
  style?: string;
}

export interface GenerationOutput {
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  width?: number;
  height?: number;
  metadata?: Record<string, unknown>;
}

// AI Models
export interface AIModel {
  id: string;
  name: string;
  provider: "replicate" | "openai" | "volcano";
  modelId: string;
  type: GenerationType;
  description: string;
  credits: Record<string, number>;
  supportedModes?: string[];
}

// Canvas
export interface ProjectData {
  tracks: Track[];
  settings: ProjectSettings;
}

export interface ProjectSettings {
  width: number;
  height: number;
  fps: number;
  duration: number;
}

export interface Track {
  id: string;
  type: "video" | "image" | "audio" | "text" | "voice";
  name: string;
  clips: Clip[];
  muted: boolean;
  locked: boolean;
}

export interface Clip {
  id: string;
  assetId: string;
  assetUrl: string;
  assetName: string;
  startTime: number;
  duration: number;
  trimStart: number;
  trimEnd: number;
  transformations: ClipTransform;
  transition?: ClipTransition;
  textOverlay?: TextOverlay;
}

export interface ClipTransform {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  opacity: number;
}

export interface ClipTransition {
  type: "none" | "fade" | "slide" | "zoom" | "wipe";
  duration: number;
}

export interface TextOverlay {
  content: string;
  style: TextStyle;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  alignment: "left" | "center" | "right";
}

// Chat
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: MessageAttachment[];
  toolCalls?: ToolCall[];
  createdAt: Date;
}

export interface MessageAttachment {
  type: "image" | "video" | "audio";
  url: string;
  name: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

// Re-exports
export type { AssetType, GenerationType, GenStatus, Plan };
