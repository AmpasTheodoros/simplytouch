import type { Prisma } from "@prisma/client";

// Base model types inferred from Prisma schema
export type Property = Prisma.PropertyGetPayload<{}>;
export type Booking = Prisma.BookingGetPayload<{}>;
export type Expense = Prisma.ExpenseGetPayload<{}>;
export type MeterReading = Prisma.MeterReadingGetPayload<{}>;
export type CleaningEvent = Prisma.CleaningEventGetPayload<{}>;
export type CostAllocation = Prisma.CostAllocationGetPayload<{}>;
export type GuestPage = Prisma.GuestPageGetPayload<{}>;
export type ScanEvent = Prisma.ScanEventGetPayload<{}>;

// Booking with relations (commonly used in dashboard views)
export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: { costAllocation: true; cleaningEvent: true };
}>;

// Cleaning event with booking relation
export type CleaningEventWithBooking = Prisma.CleaningEventGetPayload<{
  include: {
    booking: {
      select: { id: true; guestName: true; startAt: true; endAt: true };
    };
  };
}>;

// Property with counts (returned by list API)
export type PropertyWithCounts = Prisma.PropertyGetPayload<{
  include: {
    _count: {
      select: { bookings: true; guestPages: true };
    };
  };
}>;

// Paginated response envelope
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Re-export enums for convenience
export type BookingStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type CleaningStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type ExpenseFrequency = "MONTHLY" | "YEARLY";
