"use client";

import { useState, useCallback } from "react";
import type { GenerationType, GenerationInput } from "@/types";

interface UseGenerationOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useGeneration(options?: UseGenerationOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const generate = useCallback(
    async (type: GenerationType, input: GenerationInput) => {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setProgress(10);

      try {
        const endpoint =
          type === "VIDEO"
            ? "/api/ai/video"
            : type === "IMAGE"
            ? "/api/ai/image"
            : "/api/ai/audio";

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Generation failed");
        }

        setProgress(50);

        const data = await res.json();

        // Poll for completion
        const pollInterval = setInterval(async () => {
          const statusRes = await fetch(`/api/ai/generations/${data.id}`);
          const statusData = await statusRes.json();

          if (statusData.status === "COMPLETED") {
            clearInterval(pollInterval);
            setProgress(100);
            setResult(statusData.output?.url);
            options?.onSuccess?.(statusData.output?.url);
            setIsLoading(false);
          } else if (statusData.status === "FAILED") {
            clearInterval(pollInterval);
            const errMsg = statusData.error || "Generation failed";
            setError(errMsg);
            options?.onError?.(errMsg);
            setIsLoading(false);
          } else {
            setProgress((p) => Math.min(p + 2, 90));
          }
        }, 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        options?.onError?.(msg);
        setIsLoading(false);
      }
    },
    [options]
  );

  return { generate, isLoading, progress, error, result };
}
