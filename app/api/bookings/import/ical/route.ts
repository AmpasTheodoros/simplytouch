import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, requirePropertyOwnership } from "@/lib/auth";
import { importIcalSchema } from "@/lib/validation/booking";
import { parseIcal, detectSource, extractGuestName } from "@/lib/ical-parser";

// POST /api/bookings/import/ical - Import bookings from iCal URL
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const validated = importIcalSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { propertyId, icalUrl } = validated.data;
    await requirePropertyOwnership(user.id, propertyId);

    // Fetch iCal content
    let icalContent: string;
    try {
      const response = await fetch(icalUrl, {
        headers: {
          "User-Agent": "ProfitBnB/1.0",
        },
      });
      
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch iCal: ${response.status} ${response.statusText}` },
          { status: 400 }
        );
      }
      
      icalContent = await response.text();
    } catch (fetchError) {
      console.error("Error fetching iCal:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch iCal URL. Please check the URL is accessible." },
        { status: 400 }
      );
    }

    // Parse iCal content
    const events = parseIcal(icalContent);
    
    if (events.length === 0) {
      return NextResponse.json(
        { error: "No valid events found in iCal feed" },
        { status: 400 }
      );
    }

    const source = detectSource(icalUrl);
    let imported = 0;
    let updated = 0;
    let skipped = 0;

    // Process each event
    for (const event of events) {
      // Skip blocked/unavailable dates (no guest)
      const guestName = extractGuestName(event.summary, event.description);
      const isBlocked = event.summary.toLowerCase().includes("blocked") ||
                       event.summary.toLowerCase().includes("not available") ||
                       event.summary.toLowerCase().includes("closed");
      
      if (isBlocked && !guestName) {
        skipped++;
        continue;
      }

      const nights = Math.ceil(
        (event.dtend.getTime() - event.dtstart.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (nights <= 0) {
        skipped++;
        continue;
      }

      // Determine status based on dates
      const now = new Date();
      let status: "UPCOMING" | "ACTIVE" | "COMPLETED" = "UPCOMING";
      if (event.dtend <= now) {
        status = "COMPLETED";
      } else if (event.dtstart <= now && event.dtend > now) {
        status = "ACTIVE";
      }

      // Upsert booking by externalId
      const existingBooking = await db.booking.findUnique({
        where: {
          propertyId_externalId: {
            propertyId,
            externalId: event.uid,
          },
        },
      });

      if (existingBooking) {
        // Update existing booking
        await db.booking.update({
          where: { id: existingBooking.id },
          data: {
            guestName: guestName || existingBooking.guestName,
            startAt: event.dtstart,
            endAt: event.dtend,
            nights,
            status,
          },
        });
        updated++;
      } else {
        // Create new booking
        await db.booking.create({
          data: {
            propertyId,
            externalId: event.uid,
            source,
            guestName,
            startAt: event.dtstart,
            endAt: event.dtend,
            nights,
            status,
          },
        });
        imported++;
      }
    }

    // Update property with iCal URL
    await db.property.update({
      where: { id: propertyId },
      data: { icalUrl },
    });

    return NextResponse.json({
      imported,
      updated,
      skipped,
      total: events.length,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (error.message.startsWith("Forbidden")) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
    }
    console.error("Error importing iCal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
