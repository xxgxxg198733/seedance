"use client";

import { useState, useCallback } from "react";

export function useCredits() {
  const [credits, setCredits] = useState(20); // Default free trial
  const [plan, setPlan] = useState("FREE");

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
        setPlan(data.plan);
      }
    } catch {
      // Use defaults
    }
  }, []);

  const deductCredits = useCallback((amount: number) => {
    setCredits((c) => c - amount);
  }, []);

  return { credits, plan, fetchCredits, deductCredits };
}
