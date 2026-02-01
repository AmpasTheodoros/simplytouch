/**
 * Simple iCal parser for Airbnb/Booking.com/VRBO calendar exports
 * Parses VEVENT components from iCal format
 */

export interface ParsedEvent {
  uid: string;
  summary: string;
  dtstart: Date;
  dtend: Date;
  description?: string;
}

/**
 * Parse an iCal date string to a Date object
 * Handles both DATE (20250115) and DATETIME (20250115T140000Z) formats
 */
function parseIcalDate(dateStr: string): Date {
  // Remove any TZID prefix
  const cleanDate = dateStr.replace(/^TZID=[^:]+:/, "");
  
  // DATE format: YYYYMMDD
  if (cleanDate.length === 8) {
    const year = parseInt(cleanDate.slice(0, 4));
    const month = parseInt(cleanDate.slice(4, 6)) - 1;
    const day = parseInt(cleanDate.slice(6, 8));
    return new Date(Date.UTC(year, month, day, 14, 0, 0)); // Default to 2pm check-in
  }
  
  // DATETIME format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
  if (cleanDate.includes("T")) {
    const year = parseInt(cleanDate.slice(0, 4));
    const month = parseInt(cleanDate.slice(4, 6)) - 1;
    const day = parseInt(cleanDate.slice(6, 8));
    const hour = parseInt(cleanDate.slice(9, 11));
    const minute = parseInt(cleanDate.slice(11, 13));
    const second = parseInt(cleanDate.slice(13, 15)) || 0;
    
    // Z suffix means UTC
    if (cleanDate.endsWith("Z")) {
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    
    return new Date(year, month, day, hour, minute, second);
  }
  
  throw new Error(`Invalid iCal date format: ${dateStr}`);
}

/**
 * Unfold iCal lines (lines can be continued with leading whitespace)
 */
function unfoldLines(ical: string): string[] {
  // Normalize line endings
  const normalized = ical.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  
  // Unfold continuation lines (lines starting with space or tab)
  const unfolded = normalized.replace(/\n[ \t]/g, "");
  
  return unfolded.split("\n").filter(line => line.trim());
}

/**
 * Extract events from iCal content
 */
export function parseIcal(icalContent: string): ParsedEvent[] {
  const lines = unfoldLines(icalContent);
  const events: ParsedEvent[] = [];
  
  let currentEvent: Partial<ParsedEvent> | null = null;
  
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
      continue;
    }
    
    if (line === "END:VEVENT" && currentEvent) {
      // Validate required fields
      if (currentEvent.uid && currentEvent.dtstart && currentEvent.dtend) {
        events.push({
          uid: currentEvent.uid,
          summary: currentEvent.summary || "Booking",
          dtstart: currentEvent.dtstart,
          dtend: currentEvent.dtend,
          description: currentEvent.description,
        });
      }
      currentEvent = null;
      continue;
    }
    
    if (!currentEvent) continue;
    
    // Parse line into property:value
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    
    const propertyPart = line.slice(0, colonIndex);
    const value = line.slice(colonIndex + 1);
    
    // Property may have parameters (e.g., DTSTART;VALUE=DATE:20250115)
    const property = propertyPart.split(";")[0].toUpperCase();
    
    switch (property) {
      case "UID":
        currentEvent.uid = value;
        break;
      case "SUMMARY":
        currentEvent.summary = value;
        break;
      case "DTSTART":
        try {
          currentEvent.dtstart = parseIcalDate(value);
        } catch {
          console.warn(`Failed to parse DTSTART: ${value}`);
        }
        break;
      case "DTEND":
        try {
          currentEvent.dtend = parseIcalDate(value);
        } catch {
          console.warn(`Failed to parse DTEND: ${value}`);
        }
        break;
      case "DESCRIPTION":
        currentEvent.description = value.replace(/\\n/g, "\n").replace(/\\,/g, ",");
        break;
    }
  }
  
  return events;
}

/**
 * Detect booking source from iCal URL or content
 */
export function detectSource(url: string, summary?: string): string {
  const urlLower = url.toLowerCase();
  const summaryLower = summary?.toLowerCase() || "";
  
  if (urlLower.includes("airbnb")) return "airbnb";
  if (urlLower.includes("booking.com")) return "booking";
  if (urlLower.includes("vrbo") || urlLower.includes("homeaway")) return "vrbo";
  
  if (summaryLower.includes("airbnb")) return "airbnb";
  if (summaryLower.includes("booking.com")) return "booking";
  if (summaryLower.includes("vrbo")) return "vrbo";
  
  return "direct";
}

/**
 * Extract guest name from summary/description
 * Airbnb format: "Guest Name - Reserved"
 * Booking.com format varies
 */
export function extractGuestName(summary: string, description?: string): string | undefined {
  // Airbnb: "John Doe - Reserved" or "Reserved"
  if (summary.includes(" - ")) {
    const parts = summary.split(" - ");
    if (parts[0] && !parts[0].toLowerCase().includes("reserved") && !parts[0].toLowerCase().includes("blocked")) {
      return parts[0].trim();
    }
  }
  
  // Look in description for guest name patterns
  if (description) {
    const guestMatch = description.match(/guest:\s*([^\n]+)/i);
    if (guestMatch) return guestMatch[1].trim();
  }
  
  // If summary is just a name (no special keywords)
  const reserved = ["reserved", "blocked", "not available", "closed"];
  if (!reserved.some(r => summary.toLowerCase().includes(r))) {
    return summary.trim();
  }
  
  return undefined;
}
