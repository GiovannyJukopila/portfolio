import nodemailer from 'nodemailer';

const ACCENT = '#06fba9';
const BG = '#0a0a16';

export function getTransporter() {
  if (!process.env.SMTP_FROM_EMAIL || !process.env.SMTP_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_FROM_EMAIL,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

export function buildProspectEmail(
  name: string,
  dateStr: string,
  slotStart: string,
  slotEnd: string,
  meetLink: string | null
): string {
  const meetSection = meetLink
    ? `<div style="text-align:center;margin:28px 0">
         <a href="${meetLink}" style="display:inline-block;background:${ACCENT};color:#04110c;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px">Join Google Meet</a>
         <p style="color:#777;font-size:11px;margin-top:8px">${meetLink}</p>
       </div>`
    : `<p style="color:#888;font-size:13px;margin:20px 0">You'll receive the video call link by email shortly.</p>`;

  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#050509;padding:32px;margin:0">
    <div style="max-width:520px;margin:0 auto;background:${BG};border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
      <div style="padding:32px">
        <p style="color:${ACCENT};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px">Call confirmed</p>
        <h1 style="color:#f5f7fa;font-size:24px;font-weight:600;margin:0 0 20px;line-height:1.2">You're all set, ${name}!</h1>
        <div style="background:rgba(6,251,169,0.06);border:1px solid rgba(6,251,169,0.25);border-radius:14px;padding:20px 24px;margin-bottom:24px">
          <p style="color:${ACCENT};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 10px">📅 Your call</p>
          <p style="color:#f5f7fa;font-size:16px;font-weight:500;margin:0 0 4px">${dateStr}</p>
          <p style="color:#999;font-size:13px;margin:0">${slotStart} - ${slotEnd} · 30 min · Video call</p>
        </div>
        ${meetSection}
        <p style="color:#888;font-size:13px;line-height:1.6;border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;margin-top:8px">
          Looking forward to talking about your project. If you need to reschedule, just reply to this email.
        </p>
      </div>
      <div style="padding:16px 32px;background:#060610;border-top:1px solid rgba(255,255,255,0.04)">
        <p style="color:#555;font-size:11px;margin:0;text-align:center">Giovanny Jukopila · Full-Stack Developer</p>
      </div>
    </div></body></html>`;
}

export function buildOwnerEmail(
  name: string,
  email: string,
  company: string | undefined,
  dateStr: string,
  slotStart: string,
  slotEnd: string,
  meetLink: string | null
): string {
  const meetRow = meetLink
    ? `<tr><td style="color:#888;font-size:13px;padding:5px 0;width:90px">Meet</td><td><a href="${meetLink}" style="color:${ACCENT};font-size:13px">${meetLink}</a></td></tr>`
    : '';

  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#050509;color:#f5f7fa;padding:32px;max-width:520px;margin:0 auto">
    <div style="background:${BG};border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px">
      <h2 style="color:${ACCENT};font-size:18px;font-weight:600;margin:0 0 4px">New call booked</h2>
      <p style="color:#666;font-size:13px;margin:0 0 24px">Someone just scheduled an intro call from your portfolio.</p>
      <div style="background:rgba(6,251,169,0.06);border:1px solid rgba(6,251,169,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="color:#f5f7fa;font-size:16px;font-weight:500;margin:0 0 4px">${dateStr}</p>
        <p style="color:#999;font-size:13px;margin:0">${slotStart} - ${slotEnd} · 30 min · Video call</p>
      </div>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="color:#888;font-size:13px;padding:5px 0;width:90px">Name</td><td style="color:#f5f7fa;font-size:13px;font-weight:500">${name}</td></tr>
        <tr><td style="color:#888;font-size:13px;padding:5px 0">Email</td><td><a href="mailto:${email}" style="color:${ACCENT};font-size:13px;text-decoration:none">${email}</a></td></tr>
        <tr><td style="color:#888;font-size:13px;padding:5px 0">Company</td><td style="color:#f5f7fa;font-size:13px">${company || '-'}</td></tr>
        ${meetRow}
      </table>
    </div></body></html>`;
}
