"use client";

import { useEffect, useState } from "react";
import { getForms } from "@/lib/getForms";

export function useForms() {
  const [forms, setForms] = useState<
    Awaited<ReturnType<typeof getForms>>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await getForms();
        setForms(data);
      } catch (err) {
        console.error("Error in useForms:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch forms")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  return { forms, loading, error };
}
