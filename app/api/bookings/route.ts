import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requirePropertyOwnership } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validation/booking";
import { parsePagination, paginatedResponse } from "@/lib/pagination";

// GET /api/bookings - List bookings with filters
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get("propertyId");
    const month = searchParams.get("month"); // YYYY-MM format
    const status = searchParams.get("status");

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is required" },
        { status: 400 }
      );
    }

    await requirePropertyOwnership(user.id, propertyId);

    // Build date filter if month is provided
    let dateFilter = {};
    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      const startOfMonth = new Date(Date.UTC(year, monthNum - 1, 1));
      const endOfMonth = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));
      dateFilter = {
        startAt: { lte: endOfMonth },
        endAt: { gte: startOfMonth },
      };
    }

    // Build status filter
    let statusFilter = {};
    if (status && ["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"].includes(status)) {
      statusFilter = { status };
    }

    const { page, pageSize, skip, take } = parsePagination(searchParams);

    const where = {
      propertyId,
      ...dateFilter,
      ...statusFilter,
    };

    const [bookings, total] = await Promise.all([
      db.booking.findMany({
        where,
        orderBy: { startAt: "desc" },
        include: {
          costAllocation: true,
          cleaningEvent: true,
        },
        skip,
        take,
      }),
      db.booking.count({ where }),
    ]);

    return NextResponse.json(paginatedResponse(bookings, total, page, pageSize));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking manually
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validated = createBookingSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    await requirePropertyOwnership(user.id, validated.data.propertyId);

    const startAt = new Date(validated.data.startAt);
    const endAt = new Date(validated.data.endAt);
    const nights = Math.ceil(
      (endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const booking = await db.booking.create({
      data: {
        propertyId: validated.data.propertyId,
        guestName: validated.data.guestName,
        startAt,
        endAt,
        nights,
        payoutCents: validated.data.payoutCents,
        platformFeeCents: validated.data.platformFeeCents,
        source: validated.data.source,
        status: startAt > new Date() ? "UPCOMING" : "ACTIVE",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
