import { describe, it, expect } from "vitest";
import {
  createPropertySchema,
  updatePropertySchema,
} from "@/lib/validation/property";

describe("createPropertySchema", () => {
  it("should accept a valid property with all fields", () => {
    const result = createPropertySchema.safeParse({
      name: "Beach House",
      timezone: "Europe/London",
      pricePerWh: 20,
      icalUrl: "https://www.airbnb.com/calendar/ical/12345.ics",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Beach House");
      expect(result.data.timezone).toBe("Europe/London");
    }
  });

  it("should accept a property with only the name", () => {
    const result = createPropertySchema.safeParse({
      name: "Studio Apartment",
    });
    expect(result.success).toBe(true);
  });

  it("should default timezone to 'Europe/Athens'", () => {
    const result = createPropertySchema.safeParse({
      name: "My Property",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timezone).toBe("Europe/Athens");
    }
  });

  it("should fail when name is empty", () => {
    const result = createPropertySchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when name is missing", () => {
    const result = createPropertySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should fail when name exceeds 100 characters", () => {
    const result = createPropertySchema.safeParse({
      name: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("should accept a name exactly 100 characters long", () => {
    const result = createPropertySchema.safeParse({
      name: "A".repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it("should fail when icalUrl is not a valid URL", () => {
    const result = createPropertySchema.safeParse({
      name: "My Place",
      icalUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should accept icalUrl as null", () => {
    const result = createPropertySchema.safeParse({
      name: "My Place",
      icalUrl: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.icalUrl).toBeNull();
    }
  });

  it("should accept icalUrl as undefined (optional)", () => {
    const result = createPropertySchema.safeParse({
      name: "My Place",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.icalUrl).toBeUndefined();
    }
  });

  it("should fail when pricePerWh is negative", () => {
    const result = createPropertySchema.safeParse({
      name: "My Place",
      pricePerWh: -5,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when pricePerWh is a float", () => {
    const result = createPropertySchema.safeParse({
      name: "My Place",
      pricePerWh: 15.5,
    });
    expect(result.success).toBe(false);
  });

  it("should accept pricePerWh as 0", () => {
    const result = createPropertySchema.safeParse({
      name: "My Place",
      pricePerWh: 0,
    });
    expect(result.success).toBe(true);
  });
});

describe("updatePropertySchema", () => {
  it("should accept a valid partial update", () => {
    const result = updatePropertySchema.safeParse({
      name: "Updated Name",
    });
    expect(result.success).toBe(true);
  });

  it("should accept an empty object (all fields optional)", () => {
    const result = updatePropertySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should fail when name is empty string", () => {
    const result = updatePropertySchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when name exceeds 100 characters", () => {
    const result = updatePropertySchema.safeParse({
      name: "B".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("should accept timezone update", () => {
    const result = updatePropertySchema.safeParse({
      timezone: "America/New_York",
    });
    expect(result.success).toBe(true);
  });

  it("should accept icalUrl as null (to clear)", () => {
    const result = updatePropertySchema.safeParse({
      icalUrl: null,
    });
    expect(result.success).toBe(true);
  });

  it("should fail when icalUrl is invalid", () => {
    const result = updatePropertySchema.safeParse({
      icalUrl: "bad-url",
    });
    expect(result.success).toBe(false);
  });
});
