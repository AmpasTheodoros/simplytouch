import { describe, it, expect } from "vitest";
import {
  createCleaningEventSchema,
  updateCleaningEventSchema,
} from "@/lib/validation/cleaning";

const VALID_CUID = "clh1234567890abcdefghijkl";
const VALID_DATETIME = "2026-03-15T10:00:00.000Z";

describe("createCleaningEventSchema", () => {
  const validCleaning = {
    propertyId: VALID_CUID,
    scheduledAt: VALID_DATETIME,
    costCents: 4500,
    cleanerName: "Maria",
    status: "SCHEDULED" as const,
  };

  it("should accept a fully valid cleaning event", () => {
    const result = createCleaningEventSchema.safeParse(validCleaning);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.propertyId).toBe(VALID_CUID);
      expect(result.data.costCents).toBe(4500);
      expect(result.data.cleanerName).toBe("Maria");
    }
  });

  it("should accept a cleaning event with only required fields", () => {
    const result = createCleaningEventSchema.safeParse({
      propertyId: VALID_CUID,
      scheduledAt: VALID_DATETIME,
      costCents: 3000,
    });
    expect(result.success).toBe(true);
  });

  it("should default status to 'SCHEDULED'", () => {
    const result = createCleaningEventSchema.safeParse({
      propertyId: VALID_CUID,
      scheduledAt: VALID_DATETIME,
      costCents: 3000,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("SCHEDULED");
    }
  });

  it("should accept bookingId as optional", () => {
    const result = createCleaningEventSchema.safeParse({
      propertyId: VALID_CUID,
      scheduledAt: VALID_DATETIME,
      costCents: 3000,
      bookingId: VALID_CUID,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.bookingId).toBe(VALID_CUID);
    }
  });

  it("should accept bookingId as null", () => {
    const result = createCleaningEventSchema.safeParse({
      propertyId: VALID_CUID,
      scheduledAt: VALID_DATETIME,
      costCents: 3000,
      bookingId: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.bookingId).toBeNull();
    }
  });

  it("should accept cleanerName as optional", () => {
    const result = createCleaningEventSchema.safeParse({
      propertyId: VALID_CUID,
      scheduledAt: VALID_DATETIME,
      costCents: 3000,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cleanerName).toBeUndefined();
    }
  });

  // --- Required field failures ---

  it("should fail when propertyId is missing", () => {
    const result = createCleaningEventSchema.safeParse({
      scheduledAt: VALID_DATETIME,
      costCents: 3000,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when scheduledAt is missing", () => {
    const result = createCleaningEventSchema.safeParse({
      propertyId: VALID_CUID,
      costCents: 3000,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when costCents is missing", () => {
    const result = createCleaningEventSchema.safeParse({
      propertyId: VALID_CUID,
      scheduledAt: VALID_DATETIME,
    });
    expect(result.success).toBe(false);
  });

  // --- Invalid field values ---

  it("should fail when propertyId is not a valid CUID", () => {
    const result = createCleaningEventSchema.safeParse({
      ...validCleaning,
      propertyId: "bad-id",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when scheduledAt is not a valid datetime", () => {
    const result = createCleaningEventSchema.safeParse({
      ...validCleaning,
      scheduledAt: "next-tuesday",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when costCents is negative", () => {
    const result = createCleaningEventSchema.safeParse({
      ...validCleaning,
      costCents: -100,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when costCents is a float", () => {
    const result = createCleaningEventSchema.safeParse({
      ...validCleaning,
      costCents: 45.5,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when cleanerName exceeds 100 characters", () => {
    const result = createCleaningEventSchema.safeParse({
      ...validCleaning,
      cleanerName: "C".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("should fail when bookingId is not a valid CUID", () => {
    const result = createCleaningEventSchema.safeParse({
      ...validCleaning,
      bookingId: "not-valid",
    });
    expect(result.success).toBe(false);
  });

  // --- Valid status enum values ---

  it.each(["SCHEDULED", "COMPLETED", "CANCELLED"] as const)(
    "should accept status '%s'",
    (status) => {
      const result = createCleaningEventSchema.safeParse({
        ...validCleaning,
        status,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(status);
      }
    }
  );

  it("should fail when status is invalid", () => {
    const result = createCleaningEventSchema.safeParse({
      ...validCleaning,
      status: "PENDING",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateCleaningEventSchema", () => {
  it("should accept a valid partial update", () => {
    const result = updateCleaningEventSchema.safeParse({
      costCents: 5000,
      status: "COMPLETED",
    });
    expect(result.success).toBe(true);
  });

  it("should accept an empty object (all fields optional)", () => {
    const result = updateCleaningEventSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should accept cleanerName as null (to clear)", () => {
    const result = updateCleaningEventSchema.safeParse({
      cleanerName: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cleanerName).toBeNull();
    }
  });

  it("should accept bookingId as null (to unlink)", () => {
    const result = updateCleaningEventSchema.safeParse({
      bookingId: null,
    });
    expect(result.success).toBe(true);
  });

  it("should fail when costCents is negative", () => {
    const result = updateCleaningEventSchema.safeParse({ costCents: -1 });
    expect(result.success).toBe(false);
  });

  it("should fail when status is invalid", () => {
    const result = updateCleaningEventSchema.safeParse({ status: "DONE" });
    expect(result.success).toBe(false);
  });

  it("should fail when scheduledAt is invalid", () => {
    const result = updateCleaningEventSchema.safeParse({
      scheduledAt: "bad-date",
    });
    expect(result.success).toBe(false);
  });
});
