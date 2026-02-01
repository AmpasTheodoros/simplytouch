"use client";

import { useState } from "react";
import { Calendar, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const allBookings = [
  {
    id: 1,
    guest: "John Doe",
    initials: "JD",
    checkIn: "15 Ιαν 2025",
    checkOut: "19 Ιαν 2025",
    nights: 4,
    revenue: 480,
    source: "Airbnb",
    status: "completed",
  },
  {
    id: 2,
    guest: "Maria Schmidt",
    initials: "MS",
    checkIn: "20 Ιαν 2025",
    checkOut: "22 Ιαν 2025",
    nights: 2,
    revenue: 240,
    source: "Booking.com",
    status: "completed",
  },
  {
    id: 3,
    guest: "Alex Kowalski",
    initials: "AK",
    checkIn: "25 Ιαν 2025",
    checkOut: "26 Ιαν 2025",
    nights: 1,
    revenue: 120,
    source: "Airbnb",
    status: "completed",
  },
  {
    id: 4,
    guest: "Emma Wilson",
    initials: "EW",
    checkIn: "28 Ιαν 2025",
    checkOut: "31 Ιαν 2025",
    nights: 3,
    revenue: 360,
    source: "Direct",
    status: "active",
  },
  {
    id: 5,
    guest: "Lucas Martin",
    initials: "LM",
    checkIn: "02 Φεβ 2025",
    checkOut: "05 Φεβ 2025",
    nights: 3,
    revenue: 390,
    source: "Airbnb",
    status: "upcoming",
  },
  {
    id: 6,
    guest: "Sofia Garcia",
    initials: "SG",
    checkIn: "08 Φεβ 2025",
    checkOut: "12 Φεβ 2025",
    nights: 4,
    revenue: 520,
    source: "VRBO",
    status: "upcoming",
  },
];

const statusLabels: Record<string, { label: string; className: string }> = {
  completed: { label: "Ολοκληρωμένη", className: "bg-muted text-muted-foreground" },
  active: { label: "Ενεργή", className: "bg-profit/10 text-profit" },
  upcoming: { label: "Επερχόμενη", className: "bg-primary/10 text-primary" },
};

export default function BookingsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch = booking.guest.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStatus || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Αναζήτηση επισκέπτη..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Φίλτρα
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Ημερολόγιο
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterStatus(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !filterStatus ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Όλες ({allBookings.length})
        </button>
        <button
          onClick={() => setFilterStatus("upcoming")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "upcoming" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Επερχόμενες ({allBookings.filter((b) => b.status === "upcoming").length})
        </button>
        <button
          onClick={() => setFilterStatus("active")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "active" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Ενεργές ({allBookings.filter((b) => b.status === "active").length})
        </button>
        <button
          onClick={() => setFilterStatus("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "completed" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Ολοκληρωμένες ({allBookings.filter((b) => b.status === "completed").length})
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Επισκέπτης</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Check-in</th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">Check-out</th>
                <th className="text-center p-4 font-medium text-muted-foreground text-sm">Νύχτες</th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">Έσοδα</th>
                <th className="text-center p-4 font-medium text-muted-foreground text-sm">Πηγή</th>
                <th className="text-center p-4 font-medium text-muted-foreground text-sm">Κατάσταση</th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{booking.initials}</span>
                      </div>
                      <span className="font-medium text-foreground">{booking.guest}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{booking.checkIn}</td>
                  <td className="p-4 text-muted-foreground">{booking.checkOut}</td>
                  <td className="p-4 text-center text-foreground">{booking.nights}</td>
                  <td className="p-4 text-right font-medium text-foreground">€{booking.revenue}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-secondary text-foreground">
                      {booking.source}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusLabels[booking.status].className}`}>
                      {statusLabels[booking.status].label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
