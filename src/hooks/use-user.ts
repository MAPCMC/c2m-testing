"use client";

import { useState, useEffect } from "react";
import { getUser, UserWithProfile } from "@/lib/getUser";

export const useUser = () => {
  const [user, setUser] = useState<UserWithProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        setUser(user || null);
      } catch (err) {
        console.error("Error in useRole:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch role")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
