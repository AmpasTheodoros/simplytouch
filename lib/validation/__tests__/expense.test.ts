import { describe, it, expect } from "vitest";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "@/lib/validation/expense";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

const VALID_CUID = "clh1234567890abcdefghijkl";

describe("createExpenseSchema", () => {
  const validExpense = {
    propertyId: VALID_CUID,
    name: "Electricity",
    amountCents: 5000,
    frequency: "MONTHLY" as const,
    category: "utilities" as const,
    active: true,
  };

  it("should accept a fully valid expense", () => {
    const result = createExpenseSchema.safeParse(validExpense);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Electricity");
      expect(result.data.amountCents).toBe(5000);
    }
  });

  it("should accept an expense with only required fields", () => {
    const result = createExpenseSchema.safeParse({
      propertyId: VALID_CUID,
      name: "Internet",
      amountCents: 3000,
    });
    expect(result.success).toBe(true);
  });

  it("should default frequency to 'MONTHLY'", () => {
    const result = createExpenseSchema.safeParse({
      propertyId: VALID_CUID,
      name: "Internet",
      amountCents: 3000,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.frequency).toBe("MONTHLY");
    }
  });

  it("should default category to 'utilities'", () => {
    const result = createExpenseSchema.safeParse({
      propertyId: VALID_CUID,
      name: "Internet",
      amountCents: 3000,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe("utilities");
    }
  });

  it("should default active to true", () => {
    const result = createExpenseSchema.safeParse({
      propertyId: VALID_CUID,
      name: "Internet",
      amountCents: 3000,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
    }
  });

  it("should accept frequency 'YEARLY'", () => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      frequency: "YEARLY",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.frequency).toBe("YEARLY");
    }
  });

  // --- Failures ---

  it("should fail when name is empty", () => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when name is missing", () => {
    const result = createExpenseSchema.safeParse({
      propertyId: VALID_CUID,
      amountCents: 3000,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when name exceeds 100 characters", () => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      name: "X".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("should fail when amountCents is negative", () => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      amountCents: -1,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when amountCents is a float", () => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      amountCents: 50.5,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when amountCents is missing", () => {
    const result = createExpenseSchema.safeParse({
      propertyId: VALID_CUID,
      name: "Internet",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when propertyId is missing", () => {
    const result = createExpenseSchema.safeParse({
      name: "Internet",
      amountCents: 3000,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when propertyId is not a valid CUID", () => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      propertyId: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when frequency is invalid", () => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      frequency: "WEEKLY",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when category is invalid", () => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      category: "food",
    });
    expect(result.success).toBe(false);
  });

  // --- Valid category enum values ---

  it.each(EXPENSE_CATEGORIES)("should accept category '%s'", (category) => {
    const result = createExpenseSchema.safeParse({
      ...validExpense,
      category,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.category).toBe(category);
    }
  });
});

describe("updateExpenseSchema", () => {
  it("should accept a valid partial update", () => {
    const result = updateExpenseSchema.safeParse({
      name: "Updated Expense",
      amountCents: 6000,
    });
    expect(result.success).toBe(true);
  });

  it("should accept an empty object (all fields optional)", () => {
    const result = updateExpenseSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should fail when name is empty string", () => {
    const result = updateExpenseSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("should fail when amountCents is negative", () => {
    const result = updateExpenseSchema.safeParse({ amountCents: -10 });
    expect(result.success).toBe(false);
  });

  it("should accept active as false", () => {
    const result = updateExpenseSchema.safeParse({ active: false });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(false);
    }
  });

  it("should fail when frequency is invalid", () => {
    const result = updateExpenseSchema.safeParse({ frequency: "DAILY" });
    expect(result.success).toBe(false);
  });
});
