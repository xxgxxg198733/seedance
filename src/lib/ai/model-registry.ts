import type { AIModel } from "@/types";

export const MODEL_REGISTRY: Record<string, AIModel> = {
  // Video Models
  "seedance-2": {
    id: "seedance-2",
    name: "Seedance 2.0",
    provider: "volcano",
    modelId: "doubao-seedance-2-0-260128",
    type: "VIDEO" as const,
    description: "Doubao Seedance 2.0 — Multi-ref input, AI voiceover, 1080p",
    credits: { "720p_5s": 20, "1080p_10s": 45 },
  },
  "wan-2.7-t2v": {
    id: "wan-2.7-t2v",
    name: "Wan 2.7",
    provider: "replicate",
    modelId: "wavespeedai/wan-2.7-t2v",
    type: "VIDEO" as const,
    description: "Latest open-source video generation, 27B MoE architecture",
    credits: { "480p_5s": 8, "720p_5s": 15, "1080p_10s": 30 },
  },
  "sora-2": {
    id: "sora-2",
    name: "Sora 2",
    provider: "replicate",
    modelId: "openai/sora-2",
    type: "VIDEO" as const,
    description: "OpenAI's flagship video model with synced audio",
    credits: { "720p_5s": 40, "1080p_10s": 80 },
  },
  "veo-3.1": {
    id: "veo-3.1",
    name: "Veo 3.1",
    provider: "replicate",
    modelId: "google/veo-3.1",
    type: "VIDEO" as const,
    description: "Google's video model with native audio",
    credits: { "720p_5s": 35, "1080p_10s": 70 },
  },
  "kling-3": {
    id: "kling-3",
    name: "Kling 3.0",
    provider: "replicate",
    modelId: "kwaivgi/kling-v3",
    type: "VIDEO" as const,
    description: "Up to 15s, lip-synced dialogue, multi-shot mode",
    credits: { "720p_5s": 20, "1080p_10s": 45 },
  },
  "runway-gen4": {
    id: "runway-gen4",
    name: "Runway Gen-4.5",
    provider: "replicate",
    modelId: "runwayml/gen-4.5",
    type: "VIDEO" as const,
    description: "#1 on text-to-video benchmark",
    credits: { "720p_5s": 40, "1080p_10s": 85 },
  },
  "luma-ray3": {
    id: "luma-ray3",
    name: "Luma Ray 3.2",
    provider: "replicate",
    modelId: "luma/ray-3.2",
    type: "VIDEO" as const,
    description: "Cinematic quality with HDR and EXR export",
    credits: { "720p_5s": 25, "1080p_10s": 55 },
  },
  // Image Models
  "seedream-5": {
    id: "seedream-5",
    name: "Seedream 5.0",
    provider: "volcano",
    modelId: "doubao-seedream-5-0-260128",
    type: "IMAGE" as const,
    description: "Doubao Seedream 5.0 — Ultra HD 2K, cinematic quality",
    credits: { "1024x1024": 3, "2K": 5 },
  },
  "dalle-3": {
    id: "dalle-3",
    name: "DALL-E 3",
    provider: "openai",
    modelId: "dall-e-3",
    type: "IMAGE" as const,
    description: "OpenAI's latest text-to-image model",
    credits: { "1024x1024": 5, "1792x1024": 8 },
  },
  "sd-xl": {
    id: "sd-xl",
    name: "Stable Diffusion XL",
    provider: "replicate",
    modelId: "stability-ai/sdxl",
    type: "IMAGE" as const,
    description: "High-quality open-source image generation",
    credits: { "1024x1024": 2 },
  },
  "flux-pro": {
    id: "flux-pro",
    name: "Flux Pro",
    provider: "replicate",
    modelId: "black-forest-labs/flux-pro",
    type: "IMAGE" as const,
    description: "State-of-the-art image quality and prompt adherence",
    credits: { "1024x1024": 6 },
  },

  // Audio Models
  "musicgen": {
    id: "musicgen",
    name: "MusicGen",
    provider: "replicate",
    modelId: "meta/musicgen",
    type: "AUDIO" as const,
    description: "Meta's music generation model",
    credits: { "30s": 5, "60s": 10, "120s": 18 },
  },
};

export function getModelById(id: string): AIModel | undefined {
  return MODEL_REGISTRY[id];
}

export function getModelsByType(type: string): AIModel[] {
  return Object.values(MODEL_REGISTRY).filter((m) => m.type === type);
}

export function getCreditCost(modelId: string, config: string): number {
  const model = MODEL_REGISTRY[modelId];
  if (!model) return 0;
  return model.credits[config] ?? 0;
}
