import { google } from 'googleapis';
import {
  generateSlots,
  instantFor,
  parseSlotKey,
  SLOT_START_HOUR,
  SLOT_END_HOUR,
  SLOT_MINUTES,
} from './slots.js';

const TIMEZONE = process.env.BOOKING_TIMEZONE || 'America/Bogota';

function getOAuth2Client() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:3000'
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

export function isGoogleCalendarConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  );
}

/**
 * Returns the slot keys that are unavailable for `date` (YYYY-MM-DD):
 * any slot that overlaps a busy interval on the primary calendar, plus
 * slots in the past for today.
 */
export async function getTakenSlots(date: string): Promise<string[]> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth });

  const dayStart = instantFor(date, SLOT_START_HOUR, 0, TIMEZONE);
  const dayEnd = instantFor(date, SLOT_END_HOUR, 0, TIMEZONE);

  const fb = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: 'primary' }],
    },
  });

  const busy = fb.data.calendars?.primary?.busy ?? [];
  const now = Date.now();

  return generateSlots()
    .filter((slot) => {
      const { hour, min } = parseSlotKey(slot.key);
      const slotStart = instantFor(date, hour, min, TIMEZONE).getTime();
      const slotEnd = slotStart + SLOT_MINUTES * 60000;

      if (slotStart < now) return true; // already in the past

      return busy.some((b) => {
        const bStart = new Date(b.start!).getTime();
        const bEnd = new Date(b.end!).getTime();
        return slotStart < bEnd && slotEnd > bStart; // overlap
      });
    })
    .map((s) => s.key);
}

export interface CreateEventParams {
  date: string;
  slotKey: string;
  name: string;
  email: string;
  company?: string;
  requestId: string;
}

/** Creates the calendar event with a Google Meet link and invites both parties. */
export async function createCalendarEvent(params: CreateEventParams) {
  const { date, slotKey, name, email, company, requestId } = params;
  const { hour, min } = parseSlotKey(slotKey);

  const startDT = instantFor(date, hour, min, TIMEZONE);
  const endDT = new Date(startDT.getTime() + SLOT_MINUTES * 60000);

  const ownerEmail = process.env.OWNER_EMAIL || 'jukopila.giovanny@hotmail.com';

  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth });

  const result = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    sendUpdates: 'all',
    requestBody: {
      summary: `Intro call with ${name}${company ? ` (${company})` : ''}`,
      description:
        `Intro call booked from giovanny's portfolio.\n\n` +
        `Name: ${name}\nEmail: ${email}\nCompany: ${company || '-'}`,
      start: { dateTime: startDT.toISOString(), timeZone: TIMEZONE },
      end: { dateTime: endDT.toISOString(), timeZone: TIMEZONE },
      attendees: [
        { email: ownerEmail, displayName: 'Giovanny Jukopila' },
        { email, displayName: name },
      ],
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  });

  const meetLink =
    result.data.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri ?? null;

  return { eventId: result.data.id ?? null, meetLink };
}
