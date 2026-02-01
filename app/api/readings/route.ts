import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requirePropertyOwnership } from "@/lib/auth";
import { createReadingSchema, createReadingBatchSchema } from "@/lib/validation/reading";

// GET /api/readings - List meter readings for a property
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get("propertyId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = searchParams.get("limit");

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
        recordedAt: {
          ...(from && { gte: new Date(from) }),
          ...(to && { lte: new Date(to) }),
        },
      };
    }

    const readings = await db.meterReading.findMany({
      where: {
        propertyId,
        ...dateFilter,
      },
      orderBy: { recordedAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(readings);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error fetching readings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/readings - Create meter reading(s)
// Supports both single reading and batch
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Try batch first
    const batchValidation = createReadingBatchSchema.safeParse(body);
    if (batchValidation.success) {
      const { propertyId, readings: readingsData } = batchValidation.data;
      await requirePropertyOwnership(user.id, propertyId);

      const readings = await db.meterReading.createMany({
        data: readingsData.map((r) => ({
          propertyId,
          recordedAt: new Date(r.recordedAt),
          valueWh: r.valueWh,
        })),
      });

      return NextResponse.json(
        { created: readings.count },
        { status: 201 }
      );
    }

    // Try single reading
    const singleValidation = createReadingSchema.safeParse(body);
    if (singleValidation.success) {
      const { propertyId, recordedAt, valueWh } = singleValidation.data;
      await requirePropertyOwnership(user.id, propertyId);

      const reading = await db.meterReading.create({
        data: {
          propertyId,
          recordedAt: new Date(recordedAt),
          valueWh,
        },
      });

      return NextResponse.json(reading, { status: 201 });
    }

    // Neither validation passed
    return NextResponse.json(
      {
        error: "Validation error",
        details: {
          single: singleValidation.error?.flatten(),
          batch: batchValidation.error?.flatten(),
        },
      },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error creating reading:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
