"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export function useCanvasProject() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const saveProject = useCallback(
    async (id: string | null, name: string, data: unknown) => {
      setIsSaving(true);
      try {
        const method = id ? "PUT" : "POST";
        const url = id ? `/api/projects/${id}` : "/api/projects";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, data }),
        });

        if (!res.ok) throw new Error("Failed to save project");
        const project = await res.json();

        if (!id) router.push(`/app/canvas/${project.id}`);
        return project;
      } finally {
        setIsSaving(false);
      }
    },
    [router]
  );

  return { saveProject, isSaving };
}
