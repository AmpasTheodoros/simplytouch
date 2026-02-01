import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { scanEventSchema } from "@/lib/validation/guest-page";
import { createHash } from "crypto";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function getRateLimitKey(request: NextRequest): string {
  // Get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

// POST /api/guest-pages/scan - Track a scan event (public endpoint)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
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
    const ipHash = hashIp(rateLimitKey);

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
