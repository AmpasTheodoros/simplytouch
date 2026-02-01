import { db } from "@/lib/db";
export { interpolateBetweenReadings, calculateEnergyDelta } from "./interpolate-utils";

export interface InterpolationResult {
  valueWh: number;
  isExact: boolean; // true if we had an exact reading at this time
  beforeReading?: { recordedAt: Date; valueWh: number };
  afterReading?: { recordedAt: Date; valueWh: number };
}

/**
 * Interpolate the meter counter value at a specific timestamp
 * Uses linear interpolation between the closest readings before and after
 * 
 * @param propertyId - The property ID
 * @param timestamp - The timestamp to interpolate for
 * @returns The interpolated value in Wh, or null if no readings available
 */
export async function interpolateCounterAt(
  propertyId: string,
  timestamp: Date
): Promise<InterpolationResult | null> {
  // Get the closest reading before or at the timestamp
  const beforeReading = await db.meterReading.findFirst({
    where: {
      propertyId,
      recordedAt: { lte: timestamp },
    },
    orderBy: { recordedAt: "desc" },
    select: { recordedAt: true, valueWh: true },
  });

  // Get the closest reading after the timestamp
  const afterReading = await db.meterReading.findFirst({
    where: {
      propertyId,
      recordedAt: { gt: timestamp },
    },
    orderBy: { recordedAt: "asc" },
    select: { recordedAt: true, valueWh: true },
  });

  // No readings at all
  if (!beforeReading && !afterReading) {
    return null;
  }

  // Only have reading after - use that value
  if (!beforeReading && afterReading) {
    return {
      valueWh: afterReading.valueWh,
      isExact: false,
      afterReading,
    };
  }

  // Only have reading before - use that value
  if (beforeReading && !afterReading) {
    return {
      valueWh: beforeReading.valueWh,
      isExact: beforeReading.recordedAt.getTime() === timestamp.getTime(),
      beforeReading,
    };
  }

  // Have both - check if before is exact match
  if (beforeReading!.recordedAt.getTime() === timestamp.getTime()) {
    return {
      valueWh: beforeReading!.valueWh,
      isExact: true,
      beforeReading: beforeReading!,
      afterReading: afterReading!,
    };
  }

  // Linear interpolation
  const totalTime = afterReading!.recordedAt.getTime() - beforeReading!.recordedAt.getTime();
  const elapsedTime = timestamp.getTime() - beforeReading!.recordedAt.getTime();
  const ratio = elapsedTime / totalTime;

  const interpolatedValue = Math.round(
    beforeReading!.valueWh + (afterReading!.valueWh - beforeReading!.valueWh) * ratio
  );

  return {
    valueWh: interpolatedValue,
    isExact: false,
    beforeReading: beforeReading!,
    afterReading: afterReading!,
  };
}

/**
 * Compute the energy consumption for a booking period
 * Returns the delta between end and start counter values
 * 
 * @param propertyId - The property ID
 * @param startAt - Booking start timestamp
 * @param endAt - Booking end timestamp
 * @returns Energy consumed in Wh, or 0 if cannot be calculated
 */
export async function computeBookingEnergy(
  propertyId: string,
  startAt: Date,
  endAt: Date
): Promise<{
  energyWh: number;
  startReading: InterpolationResult | null;
  endReading: InterpolationResult | null;
}> {
  const startReading = await interpolateCounterAt(propertyId, startAt);
  const endReading = await interpolateCounterAt(propertyId, endAt);

  // Can't compute if missing readings
  if (!startReading || !endReading) {
    return {
      energyWh: 0,
      startReading,
      endReading,
    };
  }

  // Energy consumed = end - start (should always be positive)
  const energyWh = Math.max(0, endReading.valueWh - startReading.valueWh);

  return {
    energyWh,
    startReading,
    endReading,
  };
}

