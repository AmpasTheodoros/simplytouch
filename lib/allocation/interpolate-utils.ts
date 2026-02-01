/**
 * Pure utility functions for interpolation (no database dependency)
 */

/**
 * Linear interpolation between two points
 * 
 * @param beforeTime - Timestamp of the reading before target
 * @param beforeValue - Value at beforeTime
 * @param afterTime - Timestamp of the reading after target
 * @param afterValue - Value at afterTime
 * @param targetTime - Timestamp to interpolate for
 * @returns Interpolated value
 */
export function interpolateBetweenReadings(
  beforeTime: number,
  beforeValue: number,
  afterTime: number,
  afterValue: number,
  targetTime: number
): number {
  if (targetTime <= beforeTime) return beforeValue;
  if (targetTime >= afterTime) return afterValue;
  
  const totalTime = afterTime - beforeTime;
  const elapsedTime = targetTime - beforeTime;
  const ratio = elapsedTime / totalTime;
  
  return Math.round(beforeValue + (afterValue - beforeValue) * ratio);
}

/**
 * Calculate energy consumed between two readings
 * 
 * @param startWh - Start meter value in Wh
 * @param endWh - End meter value in Wh
 * @returns Energy consumed in Wh (always >= 0)
 */
export function calculateEnergyDelta(startWh: number, endWh: number): number {
  return Math.max(0, endWh - startWh);
}
