import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, verifyPropertyOwnership } from "@/lib/auth";
import { updateCleaningEventSchema } from "@/lib/validation/cleaning";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/cleaning-events/[id] - Get a single cleaning event
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const cleaningEvent = await db.cleaningEvent.findUnique({
      where: { id },
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

    if (!cleaningEvent) {
      return NextResponse.json({ error: "Cleaning event not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, cleaningEvent.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(cleaningEvent);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching cleaning event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/cleaning-events/[id] - Update a cleaning event
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const existingEvent = await db.cleaningEvent.findUnique({
      where: { id },
      select: { propertyId: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Cleaning event not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, existingEvent.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validated = updateCleaningEventSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    // If bookingId is being updated, verify it belongs to the same property
    if (validated.data.bookingId) {
      const booking = await db.booking.findUnique({
        where: { id: validated.data.bookingId },
        select: { propertyId: true },
      });

      if (!booking || booking.propertyId !== existingEvent.propertyId) {
        return NextResponse.json(
          { error: "Invalid bookingId" },
          { status: 400 }
        );
      }
    }

    const cleaningEvent = await db.cleaningEvent.update({
      where: { id },
      data: {
        ...validated.data,
        scheduledAt: validated.data.scheduledAt
          ? new Date(validated.data.scheduledAt)
          : undefined,
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

    return NextResponse.json(cleaningEvent);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating cleaning event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/cleaning-events/[id] - Delete a cleaning event
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existingEvent = await db.cleaningEvent.findUnique({
      where: { id },
      select: { propertyId: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Cleaning event not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, existingEvent.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.cleaningEvent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting cleaning event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
