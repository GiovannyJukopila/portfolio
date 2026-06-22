import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Applies CORS headers. Set ALLOWED_ORIGIN to your site origin
 * (e.g. https://giovannyjukopila.github.io) or leave unset for "*".
 * Returns true if the request was a preflight (already handled).
 */
export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const allowed = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
