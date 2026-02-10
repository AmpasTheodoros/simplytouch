"use client";

import { Check, Clock, AlertCircle, User, Calendar, Euro, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface CleaningEvent {
  id: string;
  propertyId: string;
  bookingId: string | null;
  scheduledAt: string;
  costCents: number;
  cleanerName: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  booking?: {
    id: string;
    guestName: string | null;
    startAt: string;
    endAt: string;
  } | null;
}

interface CleaningsTableProps {
  events: CleaningEvent[];
  isLoading: boolean;
  error: string | null;
}

const statusConfig: Record<string, { icon: typeof Check; className: string }> = {
  COMPLETED: { icon: Check, className: "bg-profit/10 text-profit" },
  SCHEDULED: { icon: Clock, className: "bg-primary/10 text-primary" },
  CANCELLED: { icon: AlertCircle, className: "bg-accent/10 text-accent" },
};

function formatDateTime(dateStr: string, locale: string = "el-GR"): { date: string; time: string } {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function CleaningsTable({ events, isLoading, error }: CleaningsTableProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {isLoading ? (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" role="status" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-muted-foreground">{error}</div>
      ) : events.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {t.noData || "Δεν υπάρχουν δεδομένα"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" aria-label="Cleaning events">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                  {t.cleanings?.date || "Ημερομηνία"}
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                  {t.cleanings?.turnover || "Turnover"}
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                  {t.cleanings?.cleaner || "Καθαριστής/τρια"}
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                  {t.cleanings?.cost || "Κόστος"}
                </th>
                <th className="text-center p-4 font-medium text-muted-foreground text-sm">
                  {t.bookings?.status || "Κατάσταση"}
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const StatusIcon = statusConfig[event.status]?.icon || Clock;
                const { date, time } = formatDateTime(event.scheduledAt);

                return (
                  <tr key={event.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{date}</p>
                          <p className="text-xs text-muted-foreground">{time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {event.booking ? (
                        <div className="text-sm">
                          <p className="text-muted-foreground">
                            <span className="text-accent">{t.cleanings?.out || "OUT"}:</span>{" "}
                            {event.booking.guestName || "—"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">{event.cleanerName || "—"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Euro className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {(event.costCents / 100).toFixed(0)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[event.status]?.className || ""}`}>
                        <StatusIcon className="w-3 h-3" />
                        {t.cleanings?.statusLabels?.[event.status] || event.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
