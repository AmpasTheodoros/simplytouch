import { z } from "zod";

export const createCleaningEventSchema = z.object({
  propertyId: z.string().cuid(),
  bookingId: z.string().cuid().optional().nullable(),
  scheduledAt: z.string().datetime(),
  costCents: z.number().int().min(0),
  cleanerName: z.string().max(100).optional(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
});

export const updateCleaningEventSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  costCents: z.number().int().min(0).optional(),
  cleanerName: z.string().max(100).optional().nullable(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  bookingId: z.string().cuid().optional().nullable(),
});

export type CreateCleaningEventInput = z.infer<typeof createCleaningEventSchema>;
export type UpdateCleaningEventInput = z.infer<typeof updateCleaningEventSchema>;
