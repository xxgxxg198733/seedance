import type { AIAdapter } from "./adapter";
import type { AIModel, GenerationInput, GenerationOutput } from "@/types";
import OpenAI from "openai";

export class OpenAIAdapter implements AIAdapter {
  readonly provider = "openai";
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateImage(model: AIModel, input: GenerationInput): Promise<GenerationOutput> {
    const size = input.aspectRatio === "16:9" ? "1792x1024" as const
      : input.aspectRatio === "9:16" ? "1024x1792" as const
      : "1024x1024" as const;

    const response = await this.client.images.generate({
      model: "dall-e-3",
      prompt: input.prompt,
      n: 1,
      size,
      quality: "standard",
    });

    const image = response.data?.[0];
    if (!image?.url) throw new Error("No image generated");
    return {
      url: image.url,
      width: size === "1792x1024" ? 1792 : 1024,
      height: size === "1024x1792" ? 1792 : 1024,
    };
  }

  async generateVideo(_model: AIModel, _input: GenerationInput): Promise<GenerationOutput> {
    throw new Error("OpenAI adapter does not support video generation. Use Replicate instead.");
  }

  async generateAudio(_model: AIModel, _input: GenerationInput): Promise<GenerationOutput> {
    throw new Error("OpenAI adapter does not support audio generation. Use Replicate instead.");
  }

  async getStatus(_predictionId: string): Promise<"processing" | "completed" | "failed"> {
    return "completed";
  }
}
