import { db } from "@/lib/db";
import { computeBookingEnergy } from "./interpolate";
import { calculateEnergyCostCents } from "@/lib/constants";

export interface MonthlyFixedCostsResult {
  totalCents: number;
  occupiedNights: number;
  perNightCents: number;
}

export interface BookingProfitResult {
  electricityWh: number;
  electricityCostCents: number;
  cleaningCostCents: number;
  fixedCostCents: number;
  totalCostCents: number;
  profitCents: number;
  marginPercent: number;
}

/**
 * Calculate the monthly fixed costs and per-night allocation
 * 
 * @param year - Year
 * @param month - Month (1-12)
 * @param propertyId - The property ID
 * @returns Monthly fixed costs breakdown
 */
export async function allocateMonthlyFixedCosts(
  year: number,
  month: number,
  propertyId: string
): Promise<MonthlyFixedCostsResult> {
  // Get all active expenses for the property
  const expenses = await db.expense.findMany({
    where: {
      propertyId,
      active: true,
    },
  });

  // Calculate monthly total
  // MONTHLY expenses count as-is, YEARLY expenses are divided by 12
  const totalCents = expenses.reduce((sum: number, expense) => {
    if (expense.frequency === "MONTHLY") {
      return sum + expense.amountCents;
    } else {
      // YEARLY - divide by 12
      return sum + Math.round(expense.amountCents / 12);
    }
  }, 0);

  // Calculate month boundaries
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
    select: {
      startAt: true,
      endAt: true,
    },
  });

  // Count occupied nights within this month
  let occupiedNights = 0;
  for (const booking of bookings) {
    const bookingStart = booking.startAt > monthStart ? booking.startAt : monthStart;
    const bookingEnd = booking.endAt < monthEnd ? booking.endAt : monthEnd;
    
    // Calculate nights (difference in days)
    const nights = Math.ceil(
      (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    occupiedNights += Math.max(0, nights);
  }

  // Calculate per-night cost
  const perNightCents = occupiedNights > 0
    ? Math.round(totalCents / occupiedNights)
    : 0;

  return {
    totalCents,
    occupiedNights,
    perNightCents,
  };
}

/**
 * Compute the full profit breakdown for a booking
 * 
 * @param bookingId - The booking ID
 * @returns Complete profit breakdown
 */
export async function computeProfit(bookingId: string): Promise<BookingProfitResult | null> {
  // Get booking with property
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: true,
      cleaningEvent: true,
    },
  });

  if (!booking) {
    return null;
  }

  // Calculate electricity cost
  const { energyWh } = await computeBookingEnergy(
    booking.propertyId,
    booking.startAt,
    booking.endAt
  );
  const electricityCostCents = calculateEnergyCostCents(energyWh, booking.property.pricePerWh);

  // Get cleaning cost
  const cleaningCostCents = booking.cleaningEvent?.costCents ?? 0;

  // Calculate fixed cost allocation
  // Use the month of checkout for allocation
  const checkoutMonth = booking.endAt.getUTCMonth() + 1;
  const checkoutYear = booking.endAt.getUTCFullYear();
  const fixedCosts = await allocateMonthlyFixedCosts(checkoutYear, checkoutMonth, booking.propertyId);
  const fixedCostCents = fixedCosts.perNightCents * booking.nights;

  // Calculate totals
  const totalCostCents = electricityCostCents + cleaningCostCents + fixedCostCents;
  const profitCents = booking.payoutCents - booking.platformFeeCents - totalCostCents;
  const marginPercent = booking.payoutCents > 0
    ? (profitCents / booking.payoutCents) * 100
    : 0;

  return {
    electricityWh: energyWh,
    electricityCostCents,
    cleaningCostCents,
    fixedCostCents,
    totalCostCents,
    profitCents,
    marginPercent: Math.round(marginPercent * 10) / 10, // Round to 1 decimal
  };
}

/**
 * Process a booking and create/update its cost allocation
 * 
 * @param bookingId - The booking ID to process
 * @returns The created/updated CostAllocation
 */
export async function processBookingAllocation(bookingId: string) {
  const profitData = await computeProfit(bookingId);
  
  if (!profitData) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { propertyId: true },
  });

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  // Upsert cost allocation
  const allocation = await db.costAllocation.upsert({
    where: { bookingId },
    create: {
      propertyId: booking.propertyId,
      bookingId,
      ...profitData,
    },
    update: {
      ...profitData,
      allocatedAt: new Date(),
    },
  });

  return allocation;
}
