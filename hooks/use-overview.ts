import { useState, useEffect, useCallback } from "react";
import type { Property } from "@/lib/types";

interface OverviewStats {
  totalBookings: number;
  totalRevenueCents: number;
  totalCostsCents: number;
  totalProfitCents: number;
  avgMarginPercent: number;
  avgCostPerNightCents: number;
  totalNights: number;
}

interface OverviewBooking {
  id: string;
  guestName: string | null;
  startAt: string;
  endAt: string;
  nights: number;
  payoutCents: number;
  platformFeeCents: number;
  source: string;
  status: string;
  propertyId: string;
  costAllocation: {
    totalCostCents: number;
    electricityCostCents: number;
    waterCostCents: number;
    fixedCostCents: number;
    cleaningCostCents: number;
  } | null;
  propertyName?: string;
}

interface OverviewData {
  stats: OverviewStats | null;
  bookings: OverviewBooking[];
  propertyName: string | null;
}

export function useOverview(
  propertyId: string | null,
  properties: Property[],
  year: number,
  month: number
) {
  const [data, setData] = useState<OverviewData>({
    stats: null,
    bookings: [],
    propertyName: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        year: String(year),
        month: String(month),
      });

      // "All properties" mode
      if (!propertyId && properties.length > 0) {
        params.set("viewAll", "true");
      } else if (propertyId) {
        params.set("propertyId", propertyId);
      } else {
        // No properties at all
        setData({ stats: null, bookings: [], propertyName: null });
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/dashboard/overview?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError("Failed to load overview");
      }
    } catch {
      setError("Failed to load overview");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, properties.length, year, month]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { data, isLoading, error, refetch: fetchOverview, setData };
}
