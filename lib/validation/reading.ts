import { z } from "zod";

export const createReadingSchema = z.object({
  propertyId: z.string().cuid(),
  recordedAt: z.string().datetime(),
  valueWh: z.number().int().min(0), // cumulative Wh
});

export const createReadingBatchSchema = z.object({
  propertyId: z.string().cuid(),
  readings: z.array(
    z.object({
      recordedAt: z.string().datetime(),
      valueWh: z.number().int().min(0),
    })
  ),
});

export type CreateReadingInput = z.infer<typeof createReadingSchema>;
export type CreateReadingBatchInput = z.infer<typeof createReadingBatchSchema>;
