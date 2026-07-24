import { z } from "zod";

export const generationInputSchema = z.object({
  prompt: z.string().min(1).max(2000),
  negativePrompt: z.string().max(2000).optional(),
  aspectRatio: z.enum(["16:9", "9:16", "1:1", "4:3"]).optional(),
  resolution: z.enum(["480P", "720P", "1080P"]).optional(),
  duration: z.number().min(1).max(60).optional(),
  outputCount: z.number().min(1).max(4).optional().default(1),
  mode: z.string().optional(),
  modelId: z.string(),
  referenceImages: z.array(z.string()).max(7).optional(),
  referenceAudio: z.string().optional(),
});

export const projectDataSchema = z.object({
  tracks: z.array(z.object({
    id: z.string(),
    type: z.enum(["video", "image", "audio", "text", "voice"]),
    name: z.string(),
    clips: z.array(z.any()),
    muted: z.boolean(),
    locked: z.boolean(),
  })),
  settings: z.object({
    width: z.number(),
    height: z.number(),
    fps: z.number(),
    duration: z.number(),
  }),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  attachments: z.array(z.object({
    type: z.enum(["image", "video", "audio"]),
    url: z.string(),
    name: z.string(),
  })).optional(),
});
