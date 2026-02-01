"use client";

import { useState } from "react";
import { Plus, Check, Clock, AlertCircle, User, Calendar, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";

const cleaningEvents = [
  {
    id: 1,
    date: "19 Ιαν 2025",
    time: "11:00",
    property: "Κεντρικό Διαμέρισμα",
    cleaner: "Μαρία Κ.",
    cost: 45,
    status: "completed",
    checkoutGuest: "John Doe",
    checkinGuest: "Maria Schmidt",
  },
  {
    id: 2,
    date: "22 Ιαν 2025",
    time: "11:00",
    property: "Κεντρικό Διαμέρισμα",
    cleaner: "Μαρία Κ.",
    cost: 45,
    status: "completed",
    checkoutGuest: "Maria Schmidt",
    checkinGuest: "Alex Kowalski",
  },
  {
    id: 3,
    date: "26 Ιαν 2025",
    time: "11:00",
    property: "Κεντρικό Διαμέρισμα",
    cleaner: "Μαρία Κ.",
    cost: 45,
    status: "completed",
    checkoutGuest: "Alex Kowalski",
    checkinGuest: "Emma Wilson",
  },
  {
    id: 4,
    date: "31 Ιαν 2025",
    time: "11:00",
    property: "Κεντρικό Διαμέρισμα",
    cleaner: "Μαρία Κ.",
    cost: 45,
    status: "scheduled",
    checkoutGuest: "Emma Wilson",
    checkinGuest: "Lucas Martin",
  },
  {
    id: 5,
    date: "05 Φεβ 2025",
    time: "11:00",
    property: "Κεντρικό Διαμέρισμα",
    cleaner: "Μαρία Κ.",
    cost: 45,
    status: "scheduled",
    checkoutGuest: "Lucas Martin",
    checkinGuest: "Sofia Garcia",
  },
];

const cleaners = [
  { id: 1, name: "Μαρία Κ.", rating: 4.9, completedJobs: 47 },
  { id: 2, name: "Ελένη Π.", rating: 4.7, completedJobs: 32 },
];

const statusConfig: Record<string, { label: string; icon: typeof Check; className: string }> = {
  completed: { label: "Ολοκληρώθηκε", icon: Check, className: "bg-profit/10 text-profit" },
  scheduled: { label: "Προγραμματισμένο", icon: Clock, className: "bg-primary/10 text-primary" },
  pending: { label: "Εκκρεμεί", icon: AlertCircle, className: "bg-warning/10 text-warning" },
};

export default function CleaningsView() {
  const [events] = useState(cleaningEvents);

  const completedCount = events.filter((e) => e.status === "completed").length;
  const scheduledCount = events.filter((e) => e.status === "scheduled").length;
  const totalCost = events.reduce((sum, e) => sum + e.cost, 0);
  const avgCost = totalCost / events.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Συνολικοί Καθαρισμοί</p>
          <p className="font-display font-bold text-3xl text-foreground">{events.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Ολοκληρωμένοι</p>
          <p className="font-display font-bold text-3xl text-profit">{completedCount}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Προγραμματισμένοι</p>
          <p className="font-display font-bold text-3xl text-primary">{scheduledCount}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Μέσο Κόστος</p>
          <p className="font-display font-bold text-3xl text-foreground">€{avgCost.toFixed(0)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="font-display font-semibold text-lg text-foreground">Turnover Events</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Νέος Καθαρισμός
        </Button>
      </div>

      {/* Cleaning Events */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Ημερομηνία</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Turnover</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Καθαριστής/τρια</th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">Κόστος</th>
                <th className="text-center p-4 font-medium text-muted-foreground text-sm">Κατάσταση</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const StatusIcon = statusConfig[event.status].icon;
                return (
                  <tr key={event.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{event.date}</p>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          <span className="text-accent">OUT:</span> {event.checkoutGuest}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-profit">IN:</span> {event.checkinGuest}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-foreground">{event.cleaner}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Euro className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{event.cost}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[event.status].className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[event.status].label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cleaners Section */}
      <div>
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">Ομάδα Καθαρισμού</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cleaners.map((cleaner) => (
            <div key={cleaner.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{cleaner.name}</p>
                  <p className="text-sm text-muted-foreground">{cleaner.completedJobs} καθαρισμοί</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-warning">
                  <span className="text-lg">⭐</span>
                  <span className="font-semibold">{cleaner.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
