import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@profitbnb.app" },
    update: {},
    create: {
      clerkId: "demo_clerk_id_12345",
      email: "demo@profitbnb.app",
    },
  });
  console.log("Created user:", user.email);

  // Create properties
  const property1 = await prisma.property.upsert({
    where: { id: "demo_property_1" },
    update: {},
    create: {
      id: "demo_property_1",
      userId: user.id,
      name: "Κεντρικό Διαμέρισμα",
      timezone: "Europe/Athens",
      pricePerWh: 15, // 0.15€/kWh
    },
  });
  console.log("Created property:", property1.name);

  const property2 = await prisma.property.upsert({
    where: { id: "demo_property_2" },
    update: {},
    create: {
      id: "demo_property_2",
      userId: user.id,
      name: "Beach House",
      timezone: "Europe/Athens",
      pricePerWh: 18,
    },
  });
  console.log("Created property:", property2.name);

  // Create expenses (fixed costs)
  const expenses = [
    { name: "Internet", amountCents: 3500, category: "utilities" },
    { name: "Netflix", amountCents: 1399, category: "subscriptions" },
    { name: "Ασφάλεια Ακινήτου", amountCents: 4500, category: "insurance" },
    { name: "Κοινόχρηστα", amountCents: 8000, category: "utilities" },
    { name: "Φυσικό Αέριο (πάγιο)", amountCents: 1200, category: "utilities" },
  ];

  for (const expense of expenses) {
    await prisma.expense.create({
      data: {
        propertyId: property1.id,
        name: expense.name,
        amountCents: expense.amountCents,
        category: expense.category,
        frequency: "MONTHLY",
        active: true,
      },
    });
  }
  console.log("Created", expenses.length, "expenses");

  // Create bookings for property1
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const bookingsData = [
    {
      guestName: "John Doe",
      startAt: new Date(currentYear, currentMonth, 5, 14, 0),
      endAt: new Date(currentYear, currentMonth, 9, 11, 0),
      payoutCents: 48000,
      platformFeeCents: 4800,
      source: "airbnb",
      status: "COMPLETED" as const,
    },
    {
      guestName: "Maria Schmidt",
      startAt: new Date(currentYear, currentMonth, 10, 14, 0),
      endAt: new Date(currentYear, currentMonth, 12, 11, 0),
      payoutCents: 24000,
      platformFeeCents: 2400,
      source: "booking",
      status: "COMPLETED" as const,
    },
    {
      guestName: "Alex Kowalski",
      startAt: new Date(currentYear, currentMonth, 15, 14, 0),
      endAt: new Date(currentYear, currentMonth, 16, 11, 0),
      payoutCents: 12000,
      platformFeeCents: 1200,
      source: "airbnb",
      status: "COMPLETED" as const,
    },
    {
      guestName: "Emma Wilson",
      startAt: new Date(currentYear, currentMonth, 18, 14, 0),
      endAt: new Date(currentYear, currentMonth, 21, 11, 0),
      payoutCents: 36000,
      platformFeeCents: 3600,
      source: "direct",
      status: "COMPLETED" as const,
    },
    {
      guestName: "Lucas Martin",
      startAt: new Date(currentYear, currentMonth + 1, 2, 14, 0),
      endAt: new Date(currentYear, currentMonth + 1, 5, 11, 0),
      payoutCents: 39000,
      platformFeeCents: 3900,
      source: "airbnb",
      status: "UPCOMING" as const,
    },
  ];

  for (const booking of bookingsData) {
    const nights = Math.ceil(
      (booking.endAt.getTime() - booking.startAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    await prisma.booking.create({
      data: {
        propertyId: property1.id,
        guestName: booking.guestName,
        startAt: booking.startAt,
        endAt: booking.endAt,
        nights,
        payoutCents: booking.payoutCents,
        platformFeeCents: booking.platformFeeCents,
        source: booking.source,
        status: booking.status,
      },
    });
  }
  console.log("Created", bookingsData.length, "bookings");

  // Create meter readings (hourly for past 60 days)
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  let cumulativeWh = 50000000; // Start at 50,000 kWh

  for (let day = 0; day < 60; day++) {
    for (let hour = 0; hour < 24; hour += 4) { // Every 4 hours
      const readingDate = new Date(startDate);
      readingDate.setDate(readingDate.getDate() + day);
      readingDate.setHours(hour, 0, 0, 0);

      // Vary consumption: more during day, less at night
      const hourlyConsumption = hour >= 8 && hour <= 22 ? 800 : 300; // Wh
      cumulativeWh += hourlyConsumption * 4; // 4 hours

      await prisma.meterReading.create({
        data: {
          propertyId: property1.id,
          recordedAt: readingDate,
          valueWh: cumulativeWh,
        },
      });
    }
  }
  console.log("Created meter readings");

  // Create cleaning events
  const cleaningEvents = [
    { scheduledAt: new Date(currentYear, currentMonth, 9, 11, 0), status: "COMPLETED" as const },
    { scheduledAt: new Date(currentYear, currentMonth, 12, 11, 0), status: "COMPLETED" as const },
    { scheduledAt: new Date(currentYear, currentMonth, 16, 11, 0), status: "COMPLETED" as const },
    { scheduledAt: new Date(currentYear, currentMonth, 21, 11, 0), status: "COMPLETED" as const },
    { scheduledAt: new Date(currentYear, currentMonth + 1, 5, 11, 0), status: "SCHEDULED" as const },
  ];

  for (const event of cleaningEvents) {
    await prisma.cleaningEvent.create({
      data: {
        propertyId: property1.id,
        scheduledAt: event.scheduledAt,
        costCents: 4500, // €45
        cleanerName: "Μαρία Κ.",
        status: event.status,
      },
    });
  }
  console.log("Created", cleaningEvents.length, "cleaning events");

  // Create guest page
  await prisma.guestPage.create({
    data: {
      propertyId: property1.id,
      slug: "demo-apartment",
      title: "Welcome!",
      published: true,
      blocks: [
        {
          type: "welcome",
          message: "Καλώς ήρθατε στο διαμέρισμά μας! Ελπίζουμε να περάσετε υπέροχα.",
        },
        {
          type: "wifi",
          networkName: "ApartmentWiFi_5G",
          password: "welcome2025",
        },
        {
          type: "checkout_time",
          time: "11:00",
        },
        {
          type: "rules",
          content: "• Μη κάπνισμα σε εσωτερικούς χώρους\n• Ησυχία μετά τις 22:00\n• Παρακαλούμε σβήστε τα φώτα όταν φεύγετε",
        },
        {
          type: "eco",
          message: "Βοηθήστε μας να προστατεύσουμε το περιβάλλον! Σκεφτείτε την κατανάλωση νερού και ενέργειας.",
          enabled: true,
        },
        {
          type: "links",
          links: [
            { label: "Οδηγός Περιοχής", url: "https://example.com/guide" },
            { label: "Menu Εστιατορίων", url: "https://example.com/restaurants" },
          ],
        },
      ],
    },
  });
  console.log("Created guest page");

  // Create cost allocations for completed bookings
  const completedBookings = await prisma.booking.findMany({
    where: {
      propertyId: property1.id,
      status: "COMPLETED",
    },
  });

  for (const booking of completedBookings) {
    // Simulate cost allocation
    const electricityCostCents = booking.nights * 550; // ~5.50€/night
    const cleaningCostCents = 4500; // €45
    const fixedCostCents = booking.nights * 950; // ~9.50€/night

    const totalCostCents = electricityCostCents + cleaningCostCents + fixedCostCents;
    const profitCents = booking.payoutCents - booking.platformFeeCents - totalCostCents;
    const marginPercent = (profitCents / booking.payoutCents) * 100;

    await prisma.costAllocation.create({
      data: {
        propertyId: property1.id,
        bookingId: booking.id,
        electricityWh: booking.nights * 3600, // ~3.6 kWh/night
        electricityCostCents,
        cleaningCostCents,
        fixedCostCents,
        totalCostCents,
        profitCents,
        marginPercent: Math.round(marginPercent * 10) / 10,
      },
    });
  }
  console.log("Created cost allocations");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
