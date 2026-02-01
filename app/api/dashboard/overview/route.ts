import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { getOverviewStats, getMonthlyBookings, type OverviewStats, type BookingWithAllocation } from "@/lib/queries/dashboard";

interface AggregatedBooking extends BookingWithAllocation {
  propertyName: string;
}

// GET /api/dashboard/overview - Get overview stats and bookings
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    
    const propertyId = searchParams.get("propertyId");
    const viewAll = searchParams.get("viewAll") === "true";
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));

    // If viewAll is true, aggregate stats from all properties
    if (viewAll) {
      const properties = await db.property.findMany({
        where: { userId: user.id },
        select: { id: true, name: true },
      });

      if (properties.length === 0) {
        return NextResponse.json({
          stats: null,
          bookings: [],
          propertyName: null,
        });
      }

      // Aggregate stats from all properties
      let totalStats: OverviewStats = {
        totalBookings: 0,
        totalRevenueCents: 0,
        totalCostsCents: 0,
        totalProfitCents: 0,
        avgMarginPercent: 0,
        avgCostPerNightCents: 0,
        totalNights: 0,
      };

      const allBookings: AggregatedBooking[] = [];

      for (const property of properties) {
        const stats = await getOverviewStats(property.id, year, month);
        const bookings = await getMonthlyBookings(property.id, year, month);

        totalStats.totalBookings += stats.totalBookings;
        totalStats.totalRevenueCents += stats.totalRevenueCents;
        totalStats.totalCostsCents += stats.totalCostsCents;
        totalStats.totalProfitCents += stats.totalProfitCents;
        totalStats.totalNights += stats.totalNights;

        // Add property name to bookings
        allBookings.push(
          ...bookings.map((b) => ({ ...b, propertyName: property.name }))
        );
      }

      // Recalculate averages
      totalStats.avgMarginPercent = totalStats.totalRevenueCents > 0
        ? Math.round((totalStats.totalProfitCents / totalStats.totalRevenueCents) * 1000) / 10
        : 0;
      totalStats.avgCostPerNightCents = totalStats.totalNights > 0
        ? Math.round(totalStats.totalCostsCents / totalStats.totalNights)
        : 0;

      // Sort bookings by date
      allBookings.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

      return NextResponse.json({
        stats: totalStats,
        bookings: allBookings,
        propertyName: "Όλα τα ακίνητα",
      });
    }

    // Single property view
    if (!propertyId) {
      // Get first property as default
      const defaultProperty = await db.property.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      });

      if (!defaultProperty) {
        return NextResponse.json({
          stats: null,
          bookings: [],
          propertyName: null,
        });
      }

      const stats = await getOverviewStats(defaultProperty.id, year, month);
      const bookings = await getMonthlyBookings(defaultProperty.id, year, month);

      return NextResponse.json({
        stats,
        bookings,
        propertyName: defaultProperty.name,
      });
    }

    // Verify the property belongs to the user
    const property = await db.property.findFirst({
      where: { id: propertyId, userId: user.id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const stats = await getOverviewStats(propertyId, year, month);
    const bookings = await getMonthlyBookings(propertyId, year, month);

    return NextResponse.json({
      stats,
      bookings,
      propertyName: property.name,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching overview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
