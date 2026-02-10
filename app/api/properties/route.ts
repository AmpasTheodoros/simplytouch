import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { createPropertySchema } from "@/lib/validation/property";
import { DEFAULT_TIMEZONE } from "@/lib/constants";
import { parsePagination, paginatedResponse } from "@/lib/pagination";

// GET /api/properties - List user's properties
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize, skip, take } = parsePagination(searchParams, 50);

    const where = { userId: user.id };

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              bookings: true,
              guestPages: true,
            },
          },
        },
        skip,
        take,
      }),
      db.property.count({ where }),
    ]);

    return NextResponse.json(paginatedResponse(properties, total, page, pageSize));
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validated = createPropertySchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const property = await db.property.create({
      data: {
        userId: user.id,
        name: validated.data.name,
        timezone: validated.data.timezone || DEFAULT_TIMEZONE,
        pricePerWh: validated.data.pricePerWh,
        icalUrl: validated.data.icalUrl,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
