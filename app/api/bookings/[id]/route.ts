import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, verifyPropertyOwnership } from "@/lib/auth";
import { updateBookingSchema } from "@/lib/validation/booking";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/bookings/[id] - Get a single booking with cost breakdown
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        property: true,
        costAllocation: true,
        cleaningEvent: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, booking.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/[id] - Update a booking (payout, fees, guest name, status)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const existingBooking = await db.booking.findUnique({
      where: { id },
      select: { propertyId: true },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, existingBooking.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validated = updateBookingSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const booking = await db.booking.update({
      where: { id },
      data: validated.data,
      include: {
        costAllocation: true,
        cleaningEvent: true,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Delete a booking
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existingBooking = await db.booking.findUnique({
      where: { id },
      select: { propertyId: true },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, existingBooking.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
