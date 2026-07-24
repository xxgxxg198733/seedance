import type { AIAdapter } from "./adapter";
import type { AIModel, GenerationInput, GenerationOutput } from "@/types";

export class VolcanoArkAdapter implements AIAdapter {
  readonly provider = "volcano";
  private apiKey: string;
  private baseUrl = "https://ark.cn-beijing.volces.com/api/v3";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // ── Image (sync) ──────────────────────────────────────────
  async generateImage(model: AIModel, input: GenerationInput): Promise<GenerationOutput> {
    const size = input.resolution === "2K" ? "2K" : "1024x1024";

    const body: Record<string, unknown> = {
      model: model.modelId,
      prompt: input.prompt,
      response_format: "url",
      size,
      stream: false,
      watermark: true,
      sequential_image_generation: "disabled",
    };

    if (input.referenceImages?.length) {
      body.image = input.referenceImages[0];
    }

    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Volcano image API error: ${response.status} ${err}`);
    }

    const data = (await response.json()) as { data: Array<{ url: string }> };
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) throw new Error("No image URL in response");

    return { url: imageUrl, width: 2048, height: 2048 };
  }

  // ── Video (async task-based) ──────────────────────────────
  async generateVideo(model: AIModel, input: GenerationInput): Promise<GenerationOutput> {
    const content: Record<string, unknown>[] = [
      { type: "text", text: input.prompt },
    ];

    // Reference images
    if (input.referenceImages?.length) {
      for (const url of input.referenceImages) {
        content.push({
          type: "image_url",
          image_url: { url },
          role: "reference_image",
        });
      }
    }

    // Reference video
    if (input.referenceVideo) {
      content.push({
        type: "video_url",
        video_url: { url: input.referenceVideo },
        role: "reference_video",
      });
    }

    // Reference audio
    if (input.referenceAudio) {
      content.push({
        type: "audio_url",
        audio_url: { url: input.referenceAudio },
        role: "reference_audio",
      });
    }

    const body: Record<string, unknown> = {
      model: model.modelId,
      content,
      generate_audio: input.generateAudio ?? true,
      ratio: input.aspectRatio ?? "16:9",
      duration: input.duration ?? 5,
      watermark: false,
    };

    // 1. Submit task
    const submitRes = await fetch(`${this.baseUrl}/contents/generations/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      throw new Error(`Volcano video API error: ${submitRes.status} ${err}`);
    }

    const submitData = (await submitRes.json()) as { data: { task_id: string } };
    const taskId = submitData.data?.task_id;
    if (!taskId) throw new Error("No task_id in video generation response");

    // 2. Poll for completion
    let videoUrl = "";
    for (let i = 0; i < 120; i++) {
      await new Promise((r) => setTimeout(r, 3000)); // wait 3s

      const pollRes = await fetch(
        `${this.baseUrl}/contents/generations/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );

      if (!pollRes.ok) continue;

      const pollData = (await pollRes.json()) as {
        data: {
          status: string;
          output: Array<{ type: string; video_url?: { url: string } }>;
        };
      };

      if (pollData.data?.status === "completed") {
        const videoOutput = pollData.data.output?.find((o) => o.type === "video_url");
        videoUrl = videoOutput?.video_url?.url ?? "";
        break;
      }

      if (pollData.data?.status === "failed") {
        throw new Error("Video generation task failed");
      }
    }

    if (!videoUrl) throw new Error("Video generation timed out or no video URL returned");

    return { url: videoUrl, duration: (input.duration ?? 5) as number };
  }

  async generateAudio(_model: AIModel, _input: GenerationInput): Promise<GenerationOutput> {
    throw new Error("Volcano Ark adapter does not support standalone audio generation.");
  }

  async getStatus(_predictionId: string): Promise<"processing" | "completed" | "failed"> {
    return "completed";
  }
}
