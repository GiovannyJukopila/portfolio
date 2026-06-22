import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'node:crypto';
import { applyCors } from '../lib/cors.js';
import { validateEmail } from '../lib/validateEmail.js';
import {
  createCalendarEvent,
  getTakenSlots,
  isGoogleCalendarConfigured,
} from '../lib/google.js';
import {
  buildOwnerEmail,
  buildProspectEmail,
  getTransporter,
} from '../lib/email.js';

interface Slot {
  start: string;
  end: string;
  key: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date, slot, name, email, company } = (req.body || {}) as {
      date?: string;
      slot?: Slot;
      name?: string;
      email?: string;
      company?: string;
    };

    if (!date || !slot?.key || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      return res.status(422).json({ error: emailErr });
    }

    // ── Race-condition guard: re-check availability against the calendar ──
    if (isGoogleCalendarConfigured()) {
      try {
        const taken = await getTakenSlots(date);
        if (taken.includes(slot.key)) {
          return res.status(409).json({
            error: 'slot_taken',
            message: 'This slot was just taken by someone else.',
          });
        }
      } catch (err) {
        console.error('[booking] availability re-check failed:', err);
      }
    }

    // ── Create calendar event + Google Meet link ──────────────────────────
    let meetLink: string | null = null;
    if (isGoogleCalendarConfigured()) {
      try {
        const result = await createCalendarEvent({
          date,
          slotKey: slot.key,
          name,
          email,
          company,
          requestId: crypto.randomUUID(),
        });
        meetLink = result.meetLink;
      } catch (calErr) {
        console.error('[booking] Google Calendar error:', calErr);
      }
    }

    // ── Confirmation emails ───────────────────────────────────────────────
    const transporter = getTransporter();
    const dateStr = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (transporter) {
      const from = `"Giovanny Jukopila" <${process.env.SMTP_FROM_EMAIL}>`;
      const ownerEmail = process.env.OWNER_EMAIL || 'jukopila.giovanny@hotmail.com';
      await Promise.all([
        transporter.sendMail({
          from,
          to: email,
          subject: `Your call is confirmed for ${dateStr} at ${slot.start}`,
          html: buildProspectEmail(name, dateStr, slot.start, slot.end, meetLink),
          text: `Hi ${name}, your call is confirmed for ${dateStr} at ${slot.start}-${slot.end}.${meetLink ? ` Join here: ${meetLink}` : ''}`,
        }),
        transporter.sendMail({
          from,
          to: ownerEmail,
          subject: `New call: ${name} · ${dateStr} ${slot.start}`,
          html: buildOwnerEmail(name, email, company, dateStr, slot.start, slot.end, meetLink),
          text: `New call: ${name} (${email}) on ${dateStr} at ${slot.start}.`,
        }),
      ]);
    } else {
      console.log('[booking] SMTP not configured, would notify:', { name, email, date, slot, meetLink });
    }

    return res.status(200).json({ success: true, meetLink });
  } catch (err) {
    console.error('[booking] unexpected error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
