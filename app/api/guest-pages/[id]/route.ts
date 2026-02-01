import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, verifyPropertyOwnership } from "@/lib/auth";
import { updateGuestPageSchema } from "@/lib/validation/guest-page";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/guest-pages/[id] - Get a single guest page
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const guestPage = await db.guestPage.findUnique({
      where: { id },
    });

    if (!guestPage) {
      return NextResponse.json({ error: "Guest page not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, guestPage.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(guestPage);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching guest page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/guest-pages/[id] - Update a guest page
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const existingPage = await db.guestPage.findUnique({
      where: { id },
      select: { propertyId: true },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Guest page not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, existingPage.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validated = updateGuestPageSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const guestPage = await db.guestPage.update({
      where: { id },
      data: validated.data,
    });

    return NextResponse.json(guestPage);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error updating guest page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/guest-pages/[id] - Delete a guest page
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existingPage = await db.guestPage.findUnique({
      where: { id },
      select: { propertyId: true },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Guest page not found" }, { status: 404 });
    }

    const isOwner = await verifyPropertyOwnership(user.id, existingPage.propertyId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.guestPage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error deleting guest page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
