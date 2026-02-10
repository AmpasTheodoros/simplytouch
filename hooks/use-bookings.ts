import { useState, useEffect, useCallback } from "react";
import type { BookingWithRelations, BookingStatus } from "@/lib/types";

interface UseBookingsOptions {
  month?: string; // YYYY-MM format
  status?: BookingStatus;
}

export function useBookings(
  propertyId: string | null,
  options?: UseBookingsOptions
) {
  const [data, setData] = useState<BookingWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!propertyId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ propertyId, pageSize: "100" });
      if (options?.month) params.set("month", options.month);
      if (options?.status) params.set("status", options.status);

      const res = await fetch(`/api/bookings?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data || json);
      } else {
        setError("Failed to load bookings");
      }
    } catch {
      setError("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, options?.month, options?.status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { data, isLoading, error, refetch: fetchBookings, setData };
}
