import { z } from "zod";
import { BOOKING_SOURCES } from "../constants";

export const createBookingSchema = z.object({
  propertyId: z.string().cuid(),
  guestName: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  payoutCents: z.number().int().min(0).default(0),
  platformFeeCents: z.number().int().min(0).default(0),
  source: z.enum(BOOKING_SOURCES).default("manual"),
});

export const updateBookingSchema = z.object({
  guestName: z.string().optional(),
  payoutCents: z.number().int().min(0).optional(),
  platformFeeCents: z.number().int().min(0).optional(),
  status: z.enum(["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export const importIcalSchema = z.object({
  propertyId: z.string().cuid(),
  icalUrl: z.string().url(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type ImportIcalInput = z.infer<typeof importIcalSchema>;
