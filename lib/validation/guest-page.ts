import { z } from "zod";

// Block type schemas
const welcomeBlockSchema = z.object({
  type: z.literal("welcome"),
  message: z.string(),
});

const wifiBlockSchema = z.object({
  type: z.literal("wifi"),
  networkName: z.string(),
  password: z.string(),
});

const rulesBlockSchema = z.object({
  type: z.literal("rules"),
  content: z.string(),
});

const ecoBlockSchema = z.object({
  type: z.literal("eco"),
  message: z.string(),
  enabled: z.boolean().default(true),
});

const linksBlockSchema = z.object({
  type: z.literal("links"),
  links: z.array(
    z.object({
      label: z.string(),
      url: z.string().url(),
    })
  ),
});

const checkoutTimeBlockSchema = z.object({
  type: z.literal("checkout_time"),
  time: z.string(), // HH:mm format
});

export const guestPageBlockSchema = z.discriminatedUnion("type", [
  welcomeBlockSchema,
  wifiBlockSchema,
  rulesBlockSchema,
  ecoBlockSchema,
  linksBlockSchema,
  checkoutTimeBlockSchema,
]);

export const createGuestPageSchema = z.object({
  propertyId: z.string().cuid(),
  title: z.string().min(1).max(100),
  blocks: z.array(guestPageBlockSchema).default([]),
  published: z.boolean().default(false),
});

export const updateGuestPageSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  blocks: z.array(guestPageBlockSchema).optional(),
  published: z.boolean().optional(),
});

export const scanEventSchema = z.object({
  slug: z.string(),
  userAgent: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
});

export type GuestPageBlock = z.infer<typeof guestPageBlockSchema>;
export type CreateGuestPageInput = z.infer<typeof createGuestPageSchema>;
export type UpdateGuestPageInput = z.infer<typeof updateGuestPageSchema>;
export type ScanEventInput = z.infer<typeof scanEventSchema>;
