import { useState, useEffect, useCallback } from "react";
import type { CleaningEventWithBooking } from "@/lib/types";

interface UseCleaningEventsOptions {
  from?: string; // ISO date string
  to?: string; // ISO date string
}

export function useCleaningEvents(
  propertyId: string | null,
  options?: UseCleaningEventsOptions
) {
  const [data, setData] = useState<CleaningEventWithBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCleaningEvents = useCallback(async () => {
    if (!propertyId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ propertyId, pageSize: "100" });
      if (options?.from) params.set("from", options.from);
      if (options?.to) params.set("to", options.to);

      const res = await fetch(`/api/cleaning-events?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data || json);
      } else {
        setError("Failed to load cleaning events");
      }
    } catch {
      setError("Failed to load cleaning events");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, options?.from, options?.to]);

  useEffect(() => {
    fetchCleaningEvents();
  }, [fetchCleaningEvents]);

  return { data, isLoading, error, refetch: fetchCleaningEvents, setData };
}
