import { describe, it, expect } from "vitest";
import {
  createBookingSchema,
  updateBookingSchema,
  importIcalSchema,
} from "@/lib/validation/booking";
import { BOOKING_SOURCES } from "@/lib/constants";

// Helper: valid CUID for tests
const VALID_CUID = "clh1234567890abcdefghijkl";
const VALID_DATETIME = "2026-03-15T14:00:00.000Z";

describe("createBookingSchema", () => {
  const validBooking = {
    propertyId: VALID_CUID,
    startAt: "2026-03-15T14:00:00.000Z",
    endAt: "2026-03-18T10:00:00.000Z",
    guestName: "John Doe",
    payoutCents: 15000,
    platformFeeCents: 1500,
    source: "airbnb" as const,
  };

  it("should accept a fully valid booking", () => {
    const result = createBookingSchema.safeParse(validBooking);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.propertyId).toBe(VALID_CUID);
      expect(result.data.source).toBe("airbnb");
    }
  });

  it("should accept a booking with only required fields", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      startAt: "2026-03-15T14:00:00.000Z",
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("should default payoutCents to 0", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      startAt: VALID_DATETIME,
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.payoutCents).toBe(0);
    }
  });

  it("should default platformFeeCents to 0", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      startAt: VALID_DATETIME,
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.platformFeeCents).toBe(0);
    }
  });

  it("should default source to 'manual'", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      startAt: VALID_DATETIME,
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("manual");
    }
  });

  it("should accept guestName as optional", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      startAt: VALID_DATETIME,
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.guestName).toBeUndefined();
    }
  });

  // --- Required field failures ---

  it("should fail when propertyId is missing", () => {
    const result = createBookingSchema.safeParse({
      startAt: VALID_DATETIME,
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when startAt is missing", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when endAt is missing", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      startAt: VALID_DATETIME,
    });
    expect(result.success).toBe(false);
  });

  // --- Invalid field values ---

  it("should fail when propertyId is not a valid CUID", () => {
    const result = createBookingSchema.safeParse({
      propertyId: "not-a-cuid",
      startAt: VALID_DATETIME,
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when startAt is not a valid datetime", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      startAt: "not-a-date",
      endAt: "2026-03-18T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when endAt is not a valid datetime", () => {
    const result = createBookingSchema.safeParse({
      propertyId: VALID_CUID,
      startAt: VALID_DATETIME,
      endAt: "2026-13-40",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payoutCents is negative", () => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      payoutCents: -100,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when platformFeeCents is negative", () => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      platformFeeCents: -50,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payoutCents is a float", () => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      payoutCents: 150.5,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when source is an invalid value", () => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      source: "unknown_platform",
    });
    expect(result.success).toBe(false);
  });

  // --- Valid source enum values ---

  it.each(BOOKING_SOURCES)("should accept source '%s'", (source) => {
    const result = createBookingSchema.safeParse({
      ...validBooking,
      source,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe(source);
    }
  });
});

describe("updateBookingSchema", () => {
  it("should accept a valid partial update", () => {
    const result = updateBookingSchema.safeParse({
      guestName: "Jane Doe",
      payoutCents: 20000,
    });
    expect(result.success).toBe(true);
  });

  it("should accept an empty object (all fields optional)", () => {
    const result = updateBookingSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should accept valid status values", () => {
    const validStatuses = ["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"] as const;
    for (const status of validStatuses) {
      const result = updateBookingSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it("should fail when status is invalid", () => {
    const result = updateBookingSchema.safeParse({ status: "PENDING" });
    expect(result.success).toBe(false);
  });

  it("should fail when payoutCents is negative", () => {
    const result = updateBookingSchema.safeParse({ payoutCents: -1 });
    expect(result.success).toBe(false);
  });

  it("should fail when platformFeeCents is negative", () => {
    const result = updateBookingSchema.safeParse({ platformFeeCents: -1 });
    expect(result.success).toBe(false);
  });
});

describe("importIcalSchema", () => {
  it("should accept a valid import request", () => {
    const result = importIcalSchema.safeParse({
      propertyId: VALID_CUID,
      icalUrl: "https://www.airbnb.com/calendar/ical/12345.ics",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when icalUrl is not a valid URL", () => {
    const result = importIcalSchema.safeParse({
      propertyId: VALID_CUID,
      icalUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when propertyId is missing", () => {
    const result = importIcalSchema.safeParse({
      icalUrl: "https://example.com/cal.ics",
    });
    expect(result.success).toBe(false);
  });
});
