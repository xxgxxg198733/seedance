import type { AIModel, GenerationInput, GenerationOutput } from "@/types";

export interface AIAdapter {
  readonly provider: string;
  generateImage(model: AIModel, input: GenerationInput): Promise<GenerationOutput>;
  generateVideo(model: AIModel, input: GenerationInput): Promise<GenerationOutput>;
  generateAudio(model: AIModel, input: GenerationInput): Promise<GenerationOutput>;
  getStatus(predictionId: string): Promise<"processing" | "completed" | "failed">;
}
