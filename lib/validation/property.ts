import { z } from "zod";

export const createPropertySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  timezone: z.string().default("Europe/Athens"),
  pricePerWh: z.number().int().min(0).optional(), // cents per 100 Wh
  icalUrl: z.string().url().optional().nullable(),
});

export const updatePropertySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().optional(),
  pricePerWh: z.number().int().min(0).optional(), // cents per 100 Wh
  icalUrl: z.string().url().optional().nullable(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
