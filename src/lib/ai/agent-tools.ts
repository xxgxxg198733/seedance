import { runGeneration } from "./index";
import { getModelById, getModelsByType, getCreditCost, MODEL_REGISTRY } from "./model-registry";
import type { GenerationInput } from "@/types";

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const AGENT_TOOLS: AgentTool[] = [
  {
    name: "generate_video",
    description: "Generate a video from a text prompt or reference image. Use this when the user wants to create a video.",
    parameters: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Detailed description of the video to generate" },
        model: { type: "string", enum: Object.keys(MODEL_REGISTRY).filter(k => MODEL_REGISTRY[k].type === "VIDEO"), description: "Video model to use" },
        duration: { type: "number", enum: [5, 10, 15], description: "Video duration in seconds" },
        aspectRatio: { type: "string", enum: ["16:9", "9:16", "1:1"], description: "Aspect ratio" },
        referenceImage: { type: "string", description: "Optional URL of reference image for image-to-video" },
      },
      required: ["prompt"],
    },
  },
  {
    name: "generate_image",
    description: "Generate an image from a text prompt. Use this when the user wants to create an image or photo.",
    parameters: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Detailed description of the image to generate" },
        model: { type: "string", enum: Object.keys(MODEL_REGISTRY).filter(k => MODEL_REGISTRY[k].type === "IMAGE"), description: "Image model to use" },
        aspectRatio: { type: "string", enum: ["16:9", "9:16", "1:1"], description: "Aspect ratio" },
        style: { type: "string", description: "Optional style description" },
        referenceImage: { type: "string", description: "Optional URL of reference image for image-to-image" },
      },
      required: ["prompt"],
    },
  },
  {
    name: "generate_audio",
    description: "Generate music or audio from a text prompt. Use this when the user wants to create music, sound effects, or voice.",
    parameters: {
      type: "object",
      properties: {
        prompt: { type: "string", description: "Description of the music/audio to generate" },
        model: { type: "string", enum: Object.keys(MODEL_REGISTRY).filter(k => MODEL_REGISTRY[k].type === "AUDIO"), description: "Audio model to use" },
        duration: { type: "number", enum: [30, 60, 120], description: "Audio duration in seconds" },
      },
      required: ["prompt"],
    },
  },
  {
    name: "list_models",
    description: "List available AI models. Use this when the user asks what models are available.",
    parameters: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["VIDEO", "IMAGE", "AUDIO"], description: "Filter by generation type" },
      },
    },
  },
  {
    name: "check_credits",
    description: "Check the user's credit balance. Use this when the user asks about their credits or pricing.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

export async function executeToolCall(
  toolName: string,
  args: Record<string, unknown>,
  _userId: string,
  _userCredits: number
): Promise<string> {
  switch (toolName) {
    case "generate_image": {
      const modelId = (args.model as string) ?? "flux-pro";
      const input: GenerationInput = {
        prompt: args.prompt as string,
        modelId,
        aspectRatio: (args.aspectRatio as string) ?? "1:1",
        referenceImages: args.referenceImage ? [args.referenceImage as string] : undefined,
      };
      const result = await runGeneration(modelId, input);
      return JSON.stringify({ type: "image", url: result.url, prompt: args.prompt });
    }

    case "generate_video": {
      const modelId = (args.model as string) ?? "wan-2.7-t2v";
      const input: GenerationInput = {
        prompt: args.prompt as string,
        modelId,
        aspectRatio: (args.aspectRatio as string) ?? "16:9",
        duration: (args.duration as number) ?? 5,
        referenceImages: args.referenceImage ? [args.referenceImage as string] : undefined,
      };
      const result = await runGeneration(modelId, input);
      return JSON.stringify({ type: "video", url: result.url, prompt: args.prompt });
    }

    case "generate_audio": {
      const modelId = (args.model as string) ?? "musicgen";
      const input: GenerationInput = {
        prompt: args.prompt as string,
        modelId,
        duration: (args.duration as number) ?? 30,
      };
      const result = await runGeneration(modelId, input);
      return JSON.stringify({ type: "audio", url: result.url, prompt: args.prompt });
    }

    case "list_models": {
      const type = args.type as string | undefined;
      const models = type
        ? getModelsByType(type)
        : Object.values(MODEL_REGISTRY);
      return JSON.stringify(
        models.map((m) => ({
          id: m.id,
          name: m.name,
          type: m.type,
          description: m.description,
          credits: m.credits,
        }))
      );
    }

    case "check_credits": {
      return JSON.stringify({
        credits: _userCredits,
        plan: "FREE",
        message: `You have ${_userCredits} credits remaining.`,
      });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }
}
