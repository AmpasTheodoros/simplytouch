import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requirePropertyOwnership } from "@/lib/auth";
import { createCleaningEventSchema } from "@/lib/validation/cleaning";

// GET /api/cleaning-events - List cleaning events for a property
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get("propertyId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is required" },
        { status: 400 }
      );
    }

    await requirePropertyOwnership(user.id, propertyId);

    // Build date filter
    let dateFilter = {};
    if (from || to) {
      dateFilter = {
        scheduledAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      };
    }

    const cleaningEvents = await db.cleaningEvent.findMany({
      where: {
        propertyId,
        ...dateFilter,
      },
      orderBy: { scheduledAt: "desc" },
      include: {
        booking: {
          select: {
            id: true,
            guestName: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    });

    return NextResponse.json(cleaningEvents);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error fetching cleaning events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/cleaning-events - Create a new cleaning event
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validated = createCleaningEventSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    await requirePropertyOwnership(user.id, validated.data.propertyId);

    // If bookingId is provided, verify it belongs to the same property
    if (validated.data.bookingId) {
      const booking = await db.booking.findUnique({
        where: { id: validated.data.bookingId },
        select: { propertyId: true },
      });

      if (!booking || booking.propertyId !== validated.data.propertyId) {
        return NextResponse.json(
          { error: "Invalid bookingId" },
          { status: 400 }
        );
      }
    }

    const cleaningEvent = await db.cleaningEvent.create({
      data: {
        propertyId: validated.data.propertyId,
        bookingId: validated.data.bookingId,
        scheduledAt: new Date(validated.data.scheduledAt),
        costCents: validated.data.costCents,
        cleanerName: validated.data.cleanerName,
        status: validated.data.status,
      },
      include: {
        booking: {
          select: {
            id: true,
            guestName: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    });

    return NextResponse.json(cleaningEvent, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error creating cleaning event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
