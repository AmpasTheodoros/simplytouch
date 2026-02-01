import { describe, it, expect } from "vitest";
import { interpolateBetweenReadings } from "../interpolate-utils";

describe("interpolateBetweenReadings", () => {
  it("should return beforeValue when targetTime is before beforeTime", () => {
    const result = interpolateBetweenReadings(
      1000, // beforeTime
      100,  // beforeValue
      2000, // afterTime
      200,  // afterValue
      500   // targetTime (before beforeTime)
    );
    expect(result).toBe(100);
  });

  it("should return afterValue when targetTime is after afterTime", () => {
    const result = interpolateBetweenReadings(
      1000, // beforeTime
      100,  // beforeValue
      2000, // afterTime
      200,  // afterValue
      2500  // targetTime (after afterTime)
    );
    expect(result).toBe(200);
  });

  it("should return beforeValue when targetTime equals beforeTime", () => {
    const result = interpolateBetweenReadings(
      1000, // beforeTime
      100,  // beforeValue
      2000, // afterTime
      200,  // afterValue
      1000  // targetTime (equals beforeTime)
    );
    expect(result).toBe(100);
  });

  it("should interpolate correctly at midpoint", () => {
    const result = interpolateBetweenReadings(
      1000, // beforeTime
      100,  // beforeValue
      2000, // afterTime
      200,  // afterValue
      1500  // targetTime (midpoint)
    );
    expect(result).toBe(150);
  });

  it("should interpolate correctly at 25%", () => {
    const result = interpolateBetweenReadings(
      0,    // beforeTime
      0,    // beforeValue
      1000, // afterTime
      400,  // afterValue
      250   // targetTime (25%)
    );
    expect(result).toBe(100);
  });

  it("should interpolate correctly at 75%", () => {
    const result = interpolateBetweenReadings(
      0,    // beforeTime
      0,    // beforeValue
      1000, // afterTime
      400,  // afterValue
      750   // targetTime (75%)
    );
    expect(result).toBe(300);
  });

  it("should round to nearest integer", () => {
    const result = interpolateBetweenReadings(
      0,    // beforeTime
      0,    // beforeValue
      1000, // afterTime
      100,  // afterValue
      333   // targetTime (33.3%)
    );
    // 33.3% of 100 = 33.3, rounded = 33
    expect(result).toBe(33);
  });

  it("should handle large values", () => {
    const result = interpolateBetweenReadings(
      0,          // beforeTime
      50000000,   // beforeValue (50,000 kWh in Wh)
      86400000,   // afterTime (24 hours in ms)
      50010000,   // afterValue (50,010 kWh in Wh)
      43200000    // targetTime (12 hours - 50%)
    );
    expect(result).toBe(50005000); // 50,005 kWh
  });
});
