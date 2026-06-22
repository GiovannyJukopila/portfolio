// Lightweight email validation shared with the frontend.
const DISPOSABLE = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com'];

export function validateEmail(email: string): string | null {
  const value = (email || '').trim();
  if (!value) return 'Email is required';
  // RFC-5322-lite: one @, a dot in the domain, no spaces.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
  const domain = value.split('@')[1].toLowerCase();
  if (DISPOSABLE.includes(domain)) return 'Please use a permanent email address';
  return null;
}
