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

const checkinTimeBlockSchema = z.object({
  type: z.literal("checkin_time"),
  time: z.string(), // HH:mm format or range like "15:00 - 20:00"
});

const hostBlockSchema = z.object({
  type: z.literal("host"),
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
});

const amenitiesBlockSchema = z.object({
  type: z.literal("amenities"),
  items: z.array(
    z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })
  ),
});

const includedBlockSchema = z.object({
  type: z.literal("included"),
  items: z.array(z.string()),
});

const importantReminderBlockSchema = z.object({
  type: z.literal("important_reminder"),
  message: z.string(),
});

const locationBlockSchema = z.object({
  type: z.literal("location"),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  mapUrl: z.string().optional(),
  directions: z.object({
    car: z.string().optional(),
    bus: z.string().optional(),
    train: z.string().optional(),
  }).optional(),
});

const nearbyBlockSchema = z.object({
  type: z.literal("nearby"),
  places: z.array(
    z.object({
      name: z.string(),
      distance: z.string(),
    })
  ),
});

const exploreCategoriesBlockSchema = z.object({
  type: z.literal("explore_categories"),
  categories: z.array(
    z.object({
      title: z.string(),
      image: z.string().optional(),
      icon: z.string().optional(),
    })
  ),
});

export const guestPageBlockSchema = z.discriminatedUnion("type", [
  welcomeBlockSchema,
  wifiBlockSchema,
  rulesBlockSchema,
  ecoBlockSchema,
  linksBlockSchema,
  checkoutTimeBlockSchema,
  checkinTimeBlockSchema,
  hostBlockSchema,
  amenitiesBlockSchema,
  includedBlockSchema,
  importantReminderBlockSchema,
  locationBlockSchema,
  nearbyBlockSchema,
  exploreCategoriesBlockSchema,
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
