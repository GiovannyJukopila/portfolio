import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../lib/cors.js';
import { getTakenSlots, isGoogleCalendarConfigured } from '../lib/google.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const date = (req.query.date as string) || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid or missing date (YYYY-MM-DD)' });
  }

  if (!isGoogleCalendarConfigured()) {
    // No calendar configured → nothing is taken (booking still works, no Meet link).
    return res.status(200).json({ takenSlots: [] });
  }

  try {
    const takenSlots = await getTakenSlots(date);
    return res.status(200).json({ takenSlots });
  } catch (err) {
    console.error('[slots] error:', err);
    // Fail open: let the user pick a slot; the POST re-checks availability.
    return res.status(200).json({ takenSlots: [] });
  }
}
