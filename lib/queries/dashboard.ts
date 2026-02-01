import { db } from "@/lib/db";

export interface OverviewStats {
  totalBookings: number;
  totalRevenueCents: number;
  totalCostsCents: number;
  totalProfitCents: number;
  avgMarginPercent: number;
  avgCostPerNightCents: number;
  totalNights: number;
}

export interface BookingWithAllocation {
  id: string;
  guestName: string | null;
  startAt: Date;
  endAt: Date;
  nights: number;
  payoutCents: number;
  platformFeeCents: number;
  source: string;
  status: string;
  costAllocation: {
    electricityCostCents: number;
    cleaningCostCents: number;
    fixedCostCents: number;
    totalCostCents: number;
    profitCents: number;
    marginPercent: number;
  } | null;
}

/**
 * Get overview statistics for a property in a given month
 */
export async function getOverviewStats(
  propertyId: string,
  year: number,
  month: number
): Promise<OverviewStats> {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  // Get all bookings that overlap with this month
  const bookings = await db.booking.findMany({
    where: {
      propertyId,
      status: { in: ["ACTIVE", "COMPLETED"] },
      startAt: { lte: monthEnd },
      endAt: { gte: monthStart },
    },
    include: {
      costAllocation: true,
    },
  });

  // Calculate totals
  let totalRevenueCents = 0;
  let totalCostsCents = 0;
  let totalProfitCents = 0;
  let totalNights = 0;

  for (const booking of bookings) {
    totalRevenueCents += booking.payoutCents;
    totalNights += booking.nights;

    if (booking.costAllocation) {
      totalCostsCents += booking.costAllocation.totalCostCents;
      totalProfitCents += booking.costAllocation.profitCents;
    }
  }

  const avgMarginPercent = totalRevenueCents > 0
    ? (totalProfitCents / totalRevenueCents) * 100
    : 0;

  const avgCostPerNightCents = totalNights > 0
    ? Math.round(totalCostsCents / totalNights)
    : 0;

  return {
    totalBookings: bookings.length,
    totalRevenueCents,
    totalCostsCents,
    totalProfitCents,
    avgMarginPercent: Math.round(avgMarginPercent * 10) / 10,
    avgCostPerNightCents,
    totalNights,
  };
}

/**
 * Get bookings with allocation data for a property in a given month
 */
export async function getMonthlyBookings(
  propertyId: string,
  year: number,
  month: number
): Promise<BookingWithAllocation[]> {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const bookings = await db.booking.findMany({
    where: {
      propertyId,
      startAt: { lte: monthEnd },
      endAt: { gte: monthStart },
    },
    include: {
      costAllocation: {
        select: {
          electricityCostCents: true,
          cleaningCostCents: true,
          fixedCostCents: true,
          totalCostCents: true,
          profitCents: true,
          marginPercent: true,
        },
      },
    },
    orderBy: { startAt: "desc" },
  });

  return bookings;
}

/**
 * Get the user's first property (for single-property MVP)
 */
export async function getDefaultProperty(userId: string) {
  return db.property.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Get all properties for a user
 */
export async function getUserProperties(userId: string) {
  return db.property.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });
}
