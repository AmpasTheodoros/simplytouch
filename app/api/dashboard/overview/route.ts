import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { getOverviewStats, getMonthlyBookings, getAggregatedOverviewStats, type OverviewStats, type BookingWithAllocation } from "@/lib/queries/dashboard";

// GET /api/dashboard/overview - Get overview stats and bookings
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    
    const propertyId = searchParams.get("propertyId");
    const viewAll = searchParams.get("viewAll") === "true";
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));

    // If viewAll is true, aggregate stats from all properties in a single query
    if (viewAll) {
      const result = await getAggregatedOverviewStats(user.id, year, month);

      if (result.bookings.length === 0 && result.stats.totalBookings === 0) {
        // Check if user has any properties at all
        const propertyCount = await db.property.count({ where: { userId: user.id } });
        if (propertyCount === 0) {
          return NextResponse.json({
            stats: null,
            bookings: [],
            propertyName: null,
          });
        }
      }

      return NextResponse.json({
        stats: result.stats,
        bookings: result.bookings,
        propertyName: null,
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
