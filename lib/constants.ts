// Energy units: All energy values stored in Wh (Watt-hours)
// 1 kWh = 1000 Wh
export const ENERGY_UNIT = "Wh" as const;

// Default price per 100 Wh in cents (0.15€/kWh = 15 cents per 100 Wh)
export const DEFAULT_PRICE_PER_100WH_CENTS = 15;

// Convert kWh to Wh
export function kWhToWh(kWh: number): number {
  return Math.round(kWh * 1000);
}

// Convert Wh to kWh
export function WhToKWh(Wh: number): number {
  return Wh / 1000;
}

// Calculate cost in cents from Wh and price per 100 Wh
export function calculateEnergyCostCents(
  energyWh: number,
  pricePerWh: number // cents per 100 Wh
): number {
  return Math.round((energyWh / 100) * pricePerWh);
}

// Default timezone for new properties
export const DEFAULT_TIMEZONE = "Europe/Athens";

// Booking sources
export const BOOKING_SOURCES = [
  "airbnb",
  "booking",
  "vrbo",
  "direct",
  "manual",
] as const;
export type BookingSource = (typeof BOOKING_SOURCES)[number];

// Expense categories
export const EXPENSE_CATEGORIES = [
  "utilities",
  "subscriptions",
  "insurance",
  "maintenance",
  "other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

// Rate limiting
export const RATE_LIMIT = {
  GUEST_PAGE_SCAN: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
  },
} as const;

// Cron job settings
export const CRON_SECRET_HEADER = "x-cron-secret";
