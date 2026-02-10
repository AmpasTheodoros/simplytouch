"use client";

import { Loader2, Eye, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Booking {
  id: string;
  guestName: string | null;
  startAt: string;
  endAt: string;
  nights: number;
  payoutCents: number;
  platformFeeCents: number;
  source: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  propertyId: string;
}

export type { Booking };

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-muted text-muted-foreground",
  ACTIVE: "bg-profit/10 text-profit",
  UPCOMING: "bg-primary/10 text-primary",
  CANCELLED: "bg-accent/10 text-accent",
};

function getInitials(name: string | null): string {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string, locale: string = "el-GR"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  onView?: (booking: Booking) => void;
  onEdit?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
}

export default function BookingsTable({
  bookings,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
}: BookingsTableProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {isLoading ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" role="status" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-muted-foreground">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {t.noData || "Δεν υπάρχουν δεδομένα"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Bookings">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.guest || "Επισκέπτης"}
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.checkIn || "Check-in"}
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.checkOut || "Check-out"}
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.nights || "Νύχτες"}
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.revenue || "Έσοδα"}
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.source || "Πηγή"}
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.status || "Κατάσταση"}
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.actions || "Ενέργειες"}
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {getInitials(booking.guestName)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        {booking.guestName || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(booking.startAt)}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(booking.endAt)}</td>
                  <td className="p-4 text-center text-foreground">{booking.nights}</td>
                  <td className="p-4 text-right font-medium text-foreground">
                    €{(booking.payoutCents / 100).toFixed(0)}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-secondary text-foreground capitalize">
                      {t.bookings?.sources?.[booking.source as keyof typeof t.bookings.sources] || booking.source}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                      {t.bookings?.statusLabels?.[booking.status] || booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        aria-label="View"
                        onClick={() => onView?.(booking)}
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        aria-label="Edit"
                        onClick={() => onEdit?.(booking)}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        aria-label="Delete"
                        onClick={() => onDelete?.(booking)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
