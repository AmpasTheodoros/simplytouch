import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scanEventSchema } from "@/lib/validation/guest-page";
import { createHash } from "crypto";
import { rateLimiter } from "@/lib/rate-limit";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

// POST /api/guest-pages/scan - Track a scan event (public endpoint)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
    const { success } = await rateLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = scanEventSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { slug, userAgent, utmSource, utmMedium } = validated.data;

    // Find the guest page by slug
    const guestPage = await db.guestPage.findUnique({
      where: { slug },
      select: { propertyId: true, published: true },
    });

    if (!guestPage) {
      return NextResponse.json(
        { error: "Guest page not found" },
        { status: 404 }
      );
    }

    // Only track if published
    if (!guestPage.published) {
      return NextResponse.json({ success: true }); // Silent success for unpublished
    }

    // Hash IP for privacy
    const ipHash = hashIp(ip);

    // Create scan event
    await db.scanEvent.create({
      data: {
        propertyId: guestPage.propertyId,
        slug,
        userAgent,
        ipHash,
        utmSource,
        utmMedium,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking scan:", error);
    // Don't expose errors on public endpoint
    return NextResponse.json({ success: true });
  }
}
