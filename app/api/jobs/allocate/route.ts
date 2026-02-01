import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { processBookingAllocation } from "@/lib/allocation/profit";
import { CRON_SECRET_HEADER } from "@/lib/constants";

// POST /api/jobs/allocate - Process cost allocation for completed bookings
// Protected by CRON_SECRET
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const cronSecret = request.headers.get(CRON_SECRET_HEADER);
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      console.error("CRON_SECRET environment variable not set");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (cronSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find completed bookings without cost allocation
    const bookingsToProcess = await db.booking.findMany({
      where: {
        status: "COMPLETED",
        costAllocation: null,
      },
      select: {
        id: true,
        propertyId: true,
        guestName: true,
        startAt: true,
        endAt: true,
      },
      take: 100, // Process in batches
    });

    // Also update bookings that are past their end date but not marked completed
    const now = new Date();
    await db.booking.updateMany({
      where: {
        status: { in: ["UPCOMING", "ACTIVE"] },
        endAt: { lte: now },
      },
      data: {
        status: "COMPLETED",
      },
    });

    // Update active bookings
    await db.booking.updateMany({
      where: {
        status: "UPCOMING",
        startAt: { lte: now },
        endAt: { gt: now },
      },
      data: {
        status: "ACTIVE",
      },
    });

    const processed: string[] = [];
    const errors: string[] = [];

    // Process each booking
    for (const booking of bookingsToProcess) {
      try {
        await processBookingAllocation(booking.id);
        processed.push(booking.id);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        errors.push(`Booking ${booking.id}: ${errorMessage}`);
        console.error(`Error processing booking ${booking.id}:`, error);
      }
    }

    return NextResponse.json({
      processed: processed.length,
      errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in allocation job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support GET for Vercel cron compatibility
export async function GET(request: NextRequest) {
  return POST(request);
}
