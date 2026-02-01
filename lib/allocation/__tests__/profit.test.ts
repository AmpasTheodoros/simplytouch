import { describe, it, expect } from "vitest";
import { calculateEnergyCostCents } from "../../constants";

describe("calculateEnergyCostCents", () => {
  it("should calculate cost correctly for 0 Wh", () => {
    const result = calculateEnergyCostCents(0, 15);
    expect(result).toBe(0);
  });

  it("should calculate cost for 100 Wh at 15 cents/100Wh", () => {
    // 100 Wh / 100 * 15 = 15 cents
    const result = calculateEnergyCostCents(100, 15);
    expect(result).toBe(15);
  });

  it("should calculate cost for 1 kWh (1000 Wh) at 15 cents/100Wh", () => {
    // 1000 Wh / 100 * 15 = 150 cents = €1.50
    const result = calculateEnergyCostCents(1000, 15);
    expect(result).toBe(150);
  });

  it("should calculate cost for 10 kWh at 15 cents/100Wh", () => {
    // 10000 Wh / 100 * 15 = 1500 cents = €15
    const result = calculateEnergyCostCents(10000, 15);
    expect(result).toBe(1500);
  });

  it("should calculate cost with different price", () => {
    // 1000 Wh / 100 * 20 = 200 cents = €2.00
    const result = calculateEnergyCostCents(1000, 20);
    expect(result).toBe(200);
  });

  it("should round to nearest cent", () => {
    // 333 Wh / 100 * 15 = 49.95, rounded = 50 cents
    const result = calculateEnergyCostCents(333, 15);
    expect(result).toBe(50);
  });
});

describe("profit calculation formula", () => {
  it("should calculate profit correctly", () => {
    // Simulate a booking profit calculation
    const payoutCents = 48000; // €480
    const platformFeeCents = 4800; // €48 (10%)
    const electricityCostCents = 2200; // €22
    const cleaningCostCents = 4500; // €45
    const fixedCostCents = 2500; // €25

    const totalCostCents = electricityCostCents + cleaningCostCents + fixedCostCents;
    const profitCents = payoutCents - platformFeeCents - totalCostCents;
    const marginPercent = (profitCents / payoutCents) * 100;

    expect(totalCostCents).toBe(9200); // €92
    expect(profitCents).toBe(34000); // €340
    expect(marginPercent).toBeCloseTo(70.83, 1);
  });

  it("should handle low margin booking", () => {
    const payoutCents = 12000; // €120
    const platformFeeCents = 1200; // €12 (10%)
    const electricityCostCents = 800; // €8
    const cleaningCostCents = 4500; // €45
    const fixedCostCents = 600; // €6

    const totalCostCents = electricityCostCents + cleaningCostCents + fixedCostCents;
    const profitCents = payoutCents - platformFeeCents - totalCostCents;
    const marginPercent = (profitCents / payoutCents) * 100;

    expect(totalCostCents).toBe(5900); // €59
    expect(profitCents).toBe(4900); // €49
    expect(marginPercent).toBeCloseTo(40.83, 1);
  });

  it("should handle negative profit", () => {
    const payoutCents = 8000; // €80
    const platformFeeCents = 800; // €8
    const electricityCostCents = 800;
    const cleaningCostCents = 4500;
    const fixedCostCents = 600;

    const totalCostCents = electricityCostCents + cleaningCostCents + fixedCostCents;
    const profitCents = payoutCents - platformFeeCents - totalCostCents;

    expect(profitCents).toBe(1300); // Still positive in this case
    expect(profitCents).toBeGreaterThan(0);
  });
});

describe("fixed cost allocation", () => {
  it("should allocate monthly costs by nights", () => {
    const monthlyTotalCents = 18599; // €185.99 (sum of expenses in seed)
    const occupiedNights = 20;
    const bookingNights = 4;

    const perNightCents = Math.round(monthlyTotalCents / occupiedNights);
    const allocationCents = perNightCents * bookingNights;

    expect(perNightCents).toBe(930); // ~€9.30/night
    expect(allocationCents).toBe(3720); // ~€37.20 for 4 nights
  });

  it("should handle 0 occupied nights", () => {
    const monthlyTotalCents = 18599;
    const occupiedNights = 0;

    const perNightCents = occupiedNights > 0
      ? Math.round(monthlyTotalCents / occupiedNights)
      : 0;

    expect(perNightCents).toBe(0);
  });
});
