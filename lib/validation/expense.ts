import { z } from "zod";
import { EXPENSE_CATEGORIES } from "../constants";

export const createExpenseSchema = z.object({
  propertyId: z.string().cuid(),
  name: z.string().min(1, "Name is required").max(100),
  amountCents: z.number().int().min(0),
  frequency: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
  category: z.enum(EXPENSE_CATEGORIES).default("utilities"),
  active: z.boolean().default(true),
});

export const updateExpenseSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  amountCents: z.number().int().min(0).optional(),
  frequency: z.enum(["MONTHLY", "YEARLY"]).optional(),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  active: z.boolean().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
