import type { AIAdapter } from "./adapter";
import { ReplicateAdapter } from "./replicate-adapter";
import { OpenAIAdapter } from "./openai-adapter";
import { VolcanoArkAdapter } from "./volcano-adapter";
import { getModelById } from "./model-registry";
import type { AIModel, GenerationInput, GenerationOutput } from "@/types";

let replicateAdapter: ReplicateAdapter | null = null;
let openaiAdapter: OpenAIAdapter | null = null;
let volcanoAdapter: VolcanoArkAdapter | null = null;

export function getAdapter(provider: "replicate" | "openai" | "volcano"): AIAdapter {
  if (provider === "replicate") {
    if (!replicateAdapter) {
      replicateAdapter = new ReplicateAdapter(process.env.REPLICATE_API_TOKEN!);
    }
    return replicateAdapter;
  }
  if (provider === "openai") {
    if (!openaiAdapter) {
      openaiAdapter = new OpenAIAdapter(process.env.OPENAI_API_KEY!);
    }
    return openaiAdapter;
  }
  if (provider === "volcano") {
    if (!volcanoAdapter) {
      volcanoAdapter = new VolcanoArkAdapter(process.env.VOLCANO_ARK_API_KEY!);
    }
    return volcanoAdapter;
  }
  throw new Error(`Unknown provider: ${provider}`);
}

export async function runGeneration(
  modelId: string,
  input: GenerationInput
): Promise<GenerationOutput> {
  const model = getModelById(modelId);
  if (!model) throw new Error(`Model not found: ${modelId}`);

  const adapter = getAdapter(model.provider as "replicate" | "openai" | "volcano");

  switch (model.type) {
    case "IMAGE":
      return adapter.generateImage(model, input);
    case "VIDEO":
      return adapter.generateVideo(model, input);
    case "AUDIO":
      return adapter.generateAudio(model, input);
    default:
      throw new Error(`Unsupported generation type: ${model.type}`);
  }
}
