import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requirePropertyOwnership } from "@/lib/auth";
import { createGuestPageSchema } from "@/lib/validation/guest-page";
import { nanoid } from "nanoid";
import { parsePagination, paginatedResponse } from "@/lib/pagination";

// GET /api/guest-pages - List guest pages for a property
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is required" },
        { status: 400 }
      );
    }

    await requirePropertyOwnership(user.id, propertyId);

    const { page, pageSize, skip, take } = parsePagination(searchParams);

    const where = { propertyId };

    const [guestPages, total] = await Promise.all([
      db.guestPage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      db.guestPage.count({ where }),
    ]);

    return NextResponse.json(paginatedResponse(guestPages, total, page, pageSize));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error fetching guest pages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/guest-pages - Create a new guest page
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validated = createGuestPageSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    await requirePropertyOwnership(user.id, validated.data.propertyId);

    // Generate unique slug
    const slug = nanoid(10);

    const guestPage = await db.guestPage.create({
      data: {
        propertyId: validated.data.propertyId,
        slug,
        title: validated.data.title,
        blocks: validated.data.blocks,
        published: validated.data.published,
      },
    });

    return NextResponse.json(guestPage, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error creating guest page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
