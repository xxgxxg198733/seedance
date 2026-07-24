import type { AIAdapter } from "./adapter";
import type { AIModel, GenerationInput, GenerationOutput } from "@/types";
import Replicate from "replicate";

export class ReplicateAdapter implements AIAdapter {
  readonly provider = "replicate";
  private client: Replicate;

  constructor(apiToken: string) {
    this.client = new Replicate({ auth: apiToken });
  }

  async generateImage(model: AIModel, input: GenerationInput): Promise<GenerationOutput> {
    const prediction = await this.client.predictions.create({
      model: model.modelId as `${string}/${string}`,
      input: {
        prompt: input.prompt,
        negative_prompt: input.negativePrompt,
        width: input.aspectRatio === "9:16" ? 768 : 1024,
        height: input.aspectRatio === "9:16" ? 1344 : 1024,
        num_outputs: 1,
      },
    });

    const result = await this.client.wait(prediction);
    const url = Array.isArray(result.output) ? result.output[0] : result.output;
    return { url: String(url), width: 1024, height: 1024 };
  }

  async generateVideo(model: AIModel, input: GenerationInput): Promise<GenerationOutput> {
    const prediction = await this.client.predictions.create({
      model: model.modelId as `${string}/${string}`,
      input: {
        prompt: input.prompt,
        ...(input.referenceImages?.length ? { start_image: input.referenceImages[0] } : {}),
        duration: input.duration ?? 5,
        aspect_ratio: input.aspectRatio ?? "16:9",
      },
    });

    const result = await this.client.wait(prediction);
    const url = Array.isArray(result.output) ? result.output[0] : result.output;
    return { url: String(url), duration: input.duration ?? 5 };
  }

  async generateAudio(model: AIModel, input: GenerationInput): Promise<GenerationOutput> {
    const prediction = await this.client.predictions.create({
      model: model.modelId as `${string}/${string}`,
      input: {
        prompt: input.prompt,
        duration: input.duration ?? 30,
      },
    });

    const result = await this.client.wait(prediction);
    const url = Array.isArray(result.output) ? result.output[0] : result.output;
    return { url: String(url), duration: input.duration ?? 30 };
  }

  async getStatus(predictionId: string): Promise<"processing" | "completed" | "failed"> {
    const prediction = await this.client.predictions.get(predictionId);
    if (prediction.status === "succeeded") return "completed";
    if (prediction.status === "failed" || prediction.status === "canceled") return "failed";
    return "processing";
  }
}
