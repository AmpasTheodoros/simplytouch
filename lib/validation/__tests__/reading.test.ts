import { describe, it, expect } from "vitest";
import {
  createReadingSchema,
  createReadingBatchSchema,
} from "@/lib/validation/reading";

const VALID_CUID = "clh1234567890abcdefghijkl";
const VALID_DATETIME = "2026-03-15T08:00:00.000Z";

describe("createReadingSchema", () => {
  const validReading = {
    propertyId: VALID_CUID,
    recordedAt: VALID_DATETIME,
    valueWh: 12500,
  };

  it("should accept a valid single reading", () => {
    const result = createReadingSchema.safeParse(validReading);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.propertyId).toBe(VALID_CUID);
      expect(result.data.valueWh).toBe(12500);
    }
  });

  it("should accept valueWh of 0", () => {
    const result = createReadingSchema.safeParse({
      ...validReading,
      valueWh: 0,
    });
    expect(result.success).toBe(true);
  });

  // --- Required field failures ---

  it("should fail when propertyId is missing", () => {
    const result = createReadingSchema.safeParse({
      recordedAt: VALID_DATETIME,
      valueWh: 12500,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when recordedAt is missing", () => {
    const result = createReadingSchema.safeParse({
      propertyId: VALID_CUID,
      valueWh: 12500,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when valueWh is missing", () => {
    const result = createReadingSchema.safeParse({
      propertyId: VALID_CUID,
      recordedAt: VALID_DATETIME,
    });
    expect(result.success).toBe(false);
  });

  // --- Invalid field values ---

  it("should fail when propertyId is not a valid CUID", () => {
    const result = createReadingSchema.safeParse({
      ...validReading,
      propertyId: "abc123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when recordedAt is not a valid datetime", () => {
    const result = createReadingSchema.safeParse({
      ...validReading,
      recordedAt: "yesterday",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when valueWh is negative", () => {
    const result = createReadingSchema.safeParse({
      ...validReading,
      valueWh: -100,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when valueWh is a float", () => {
    const result = createReadingSchema.safeParse({
      ...validReading,
      valueWh: 12.5,
    });
    expect(result.success).toBe(false);
  });
});

describe("createReadingBatchSchema", () => {
  const validBatch = {
    propertyId: VALID_CUID,
    readings: [
      { recordedAt: "2026-03-15T08:00:00.000Z", valueWh: 12500 },
      { recordedAt: "2026-03-15T09:00:00.000Z", valueWh: 12600 },
      { recordedAt: "2026-03-15T10:00:00.000Z", valueWh: 12750 },
    ],
  };

  it("should accept a valid batch of readings", () => {
    const result = createReadingBatchSchema.safeParse(validBatch);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.propertyId).toBe(VALID_CUID);
      expect(result.data.readings).toHaveLength(3);
    }
  });

  it("should accept a batch with a single reading", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: VALID_CUID,
      readings: [
        { recordedAt: VALID_DATETIME, valueWh: 5000 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should accept a batch with an empty readings array", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: VALID_CUID,
      readings: [],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.readings).toHaveLength(0);
    }
  });

  // --- Failures ---

  it("should fail when propertyId is missing", () => {
    const result = createReadingBatchSchema.safeParse({
      readings: [{ recordedAt: VALID_DATETIME, valueWh: 5000 }],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when propertyId is not a valid CUID", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: "invalid",
      readings: [{ recordedAt: VALID_DATETIME, valueWh: 5000 }],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when readings is missing", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: VALID_CUID,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when a reading in batch has invalid datetime", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: VALID_CUID,
      readings: [
        { recordedAt: "not-a-date", valueWh: 5000 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when a reading in batch has negative valueWh", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: VALID_CUID,
      readings: [
        { recordedAt: VALID_DATETIME, valueWh: -1 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when a reading in batch has float valueWh", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: VALID_CUID,
      readings: [
        { recordedAt: VALID_DATETIME, valueWh: 100.5 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when a reading in batch is missing recordedAt", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: VALID_CUID,
      readings: [
        { valueWh: 5000 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when a reading in batch is missing valueWh", () => {
    const result = createReadingBatchSchema.safeParse({
      propertyId: VALID_CUID,
      readings: [
        { recordedAt: VALID_DATETIME },
      ],
    });
    expect(result.success).toBe(false);
  });
});
