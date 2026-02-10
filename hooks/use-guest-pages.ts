import { useState, useEffect, useCallback } from "react";
import type { GuestPage } from "@/lib/types";

export function useGuestPages(propertyId: string | null) {
  const [data, setData] = useState<GuestPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuestPages = useCallback(async () => {
    if (!propertyId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ propertyId, pageSize: "100" });

      const res = await fetch(`/api/guest-pages?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data || json);
      } else {
        setError("Failed to load guest pages");
      }
    } catch {
      setError("Failed to load guest pages");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchGuestPages();
  }, [fetchGuestPages]);

  return { data, isLoading, error, refetch: fetchGuestPages, setData };
}
