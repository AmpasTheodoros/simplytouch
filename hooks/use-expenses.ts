import { useState, useEffect, useCallback } from "react";
import type { Expense } from "@/lib/types";

export function useExpenses(propertyId: string | null) {
  const [data, setData] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!propertyId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ propertyId, pageSize: "100" });

      const res = await fetch(`/api/expenses?${params}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data || json);
      } else {
        setError("Failed to load expenses");
      }
    } catch {
      setError("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { data, isLoading, error, refetch: fetchExpenses, setData };
}
