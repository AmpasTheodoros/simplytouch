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
 * Get aggregated overview stats across all properties for a user in a given month.
 * Avoids N+1 queries by fetching bookings from all properties in a single query.
 */
export async function getAggregatedOverviewStats(
  userId: string,
  year: number,
  month: number
): Promise<{
  stats: OverviewStats;
  bookings: (BookingWithAllocation & { propertyName: string })[];
}> {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  // Single query: get all bookings for all user's properties in this month
  const bookings = await db.booking.findMany({
    where: {
      property: { userId },
      startAt: { lte: monthEnd },
      endAt: { gte: monthStart },
    },
    include: {
      property: { select: { name: true } },
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

  // Aggregate stats
  let totalRevenueCents = 0;
  let totalCostsCents = 0;
  let totalProfitCents = 0;
  let totalNights = 0;
  let activeOrCompleted = 0;

  for (const booking of bookings) {
    if (booking.status === "ACTIVE" || booking.status === "COMPLETED") {
      activeOrCompleted++;
      totalRevenueCents += booking.payoutCents;
      totalNights += booking.nights;

      if (booking.costAllocation) {
        totalCostsCents += booking.costAllocation.totalCostCents;
        totalProfitCents += booking.costAllocation.profitCents;
      }
    }
  }

  const avgMarginPercent = totalRevenueCents > 0
    ? Math.round((totalProfitCents / totalRevenueCents) * 1000) / 10
    : 0;

  const avgCostPerNightCents = totalNights > 0
    ? Math.round(totalCostsCents / totalNights)
    : 0;

  return {
    stats: {
      totalBookings: activeOrCompleted,
      totalRevenueCents,
      totalCostsCents,
      totalProfitCents,
      avgMarginPercent,
      avgCostPerNightCents,
      totalNights,
    },
    bookings: bookings.map((b) => ({
      ...b,
      propertyName: b.property.name,
    })),
  };
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
