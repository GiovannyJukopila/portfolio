# Portfolio Booking API

Tiny serverless backend that powers the "Schedule a call" modal on the portfolio.
Same flow as gioquote: pick a date → pick a 30-min slot (taken ones are blocked) →
confirm → a Google Calendar event with a **Google Meet** link is created and both
parties get an email.

No database: Google Calendar itself is the source of truth for taken slots
(via the free/busy API).

## Endpoints

| Method | Path           | Purpose                                            |
| ------ | -------------- | -------------------------------------------------- |
| GET    | `/api/slots`   | `?date=YYYY-MM-DD` → `{ takenSlots: string[] }`    |
| POST   | `/api/booking` | `{ date, slot, name, email, company? }` → `{ meetLink }` |

## Deploy to Vercel (free Hobby plan — $0)

1. Push this repo to GitHub (the `booking-api/` folder can be its own Vercel project).
2. On https://vercel.com → **Add New Project** → import the repo.
3. Set **Root Directory** to `booking-api`.
4. Add the environment variables from `.env.example` (copy the Google +
   SMTP values straight from `gioquote-sprint1/apps/web/.env.local`).
5. Deploy. You'll get a URL like `https://portfolio-booking-api.vercel.app`.
6. Put that URL in the portfolio: `src/app/core/profile.ts` → `BOOKING_API_URL`.
7. (Recommended) Set `ALLOWED_ORIGIN` to your live site origin instead of `*`.

## Local dev

```bash
cd booking-api
npm install
cp .env.example .env        # fill in the real values
npx vercel dev              # serves http://localhost:3000/api/*
```

## Notes

- Slots: Mon–Fri, 08:00–18:00, 30-min each (edit `lib/slots.ts`).
- If Google env vars are missing, booking still records & emails but without a Meet link.
- If SMTP vars are missing, the event/Meet is still created; emails are skipped.
