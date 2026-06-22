// Slot generation + timezone helpers shared by the booking endpoints.
// Mirrors the 30-minute, 8:00–18:00 schedule used in gioquote.

export const SLOT_START_HOUR = 8;   // first slot starts at 08:00
export const SLOT_END_HOUR = 18;    // last slot ends at 18:00
export const SLOT_MINUTES = 30;     // slot length

export interface Slot {
  start: string; // "9:00 AM"
  end: string;   // "9:30 AM"
  key: string;   // "9:0" / "9:30"
}

function fmt(h: number, m: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function generateSlots(): Slot[] {
  const slots: Slot[] = [];
  for (let hour = SLOT_START_HOUR; hour < SLOT_END_HOUR; hour++) {
    for (let min = 0; min < 60; min += SLOT_MINUTES) {
      const endMin = (min + SLOT_MINUTES) % 60;
      const endHour = min + SLOT_MINUTES >= 60 ? hour + 1 : hour;
      slots.push({ start: fmt(hour, min), end: fmt(endHour, endMin), key: `${hour}:${min}` });
    }
  }
  return slots;
}

/** Minutes that `tz` is offset from UTC at the given instant (e.g. -300 for Bogotá). */
function offsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = dtf.formatToParts(date).reduce<Record<string, string>>((a, x) => {
    a[x.type] = x.value;
    return a;
  }, {});
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return (asUTC - date.getTime()) / 60000;
}

/**
 * Build the exact UTC instant for a wall-clock time (dateStr + hour:min) in `tz`.
 * Returns a Date. Handles DST correctly via Intl offset lookup.
 */
export function instantFor(dateStr: string, hour: number, min: number, tz: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const naiveUTC = Date.UTC(y, m - 1, d, hour, min, 0);
  const off = offsetMinutes(new Date(naiveUTC), tz);
  return new Date(naiveUTC - off * 60000);
}

/** Parse a slot key ("9:30") into { hour, min }. */
export function parseSlotKey(key: string): { hour: number; min: number } {
  const [hour, min] = key.split(':').map(Number);
  return { hour, min };
}
