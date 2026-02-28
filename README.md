# Travel Planner

A personal travel planning app for managing trips and day-by-day itineraries, with live flight search powered by the Amadeus API.

> Bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Trip dashboard** — create and delete trips with a name, destination, and date range
- **Day-by-day itinerary** — activities are organised per day across the full trip duration
- **Manual activities** — add any activity with a title, time, and notes
- **Flight search** — search live flights via Amadeus and add them directly to a day; saved flights render as rich cards showing flight number, route, departure/arrival times, cabin class, stops, duration, and price
- **Persistent storage** — Vercel Postgres (Prisma Postgres)

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vercel Postgres](https://vercel.com/storage/postgres) — managed Postgres database
- [Amadeus Self-Service APIs](https://developers.amadeus.com/) — flight offers search

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy `env.example` to `.env.local` and fill in your credentials:

```bash
cp env.example .env.local
```

- **Postgres** — create a Postgres database in your [Vercel dashboard](https://vercel.com/dashboard) and run `vercel env pull .env.local` to populate the connection vars automatically.
- **Amadeus** — sign up at [developers.amadeus.com](https://developers.amadeus.com/) and create an app under the **test** environment to get `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET`.

### 3. Run the dev server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

The app is deployed on Vercel. To deploy a preview:

```bash
vercel
```

To promote to production:

```bash
vercel --prod
```

## Upgrading Amadeus to Production

The default setup uses the Amadeus **test** environment, which returns sandbox data and has no rate limits for development. To switch to live data for production:

1. **Apply for production access** at [developers.amadeus.com](https://developers.amadeus.com/) — go to your app and request a move to production (requires a brief review by Amadeus).

2. **Create a production app** in the Amadeus portal and copy the new `Client ID` and `Client Secret`.

3. **Update the API base URL** in `src/lib/amadeus.ts`:
   ```diff
   - const BASE = "https://test.api.amadeus.com";
   + const BASE = "https://api.amadeus.com";
   ```

4. **Update Vercel environment variables** — in the Vercel dashboard go to **Settings → Environment Variables**, update `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET` for the **Production** environment with the new credentials.

5. Redeploy: `vercel --prod`.

## Project Structure

```
src/
  app/
    page.tsx                        # Trip dashboard
    trips/[id]/page.tsx             # Itinerary view
    api/
      trips/                        # CRUD for trips and activities
      flights/search/               # Amadeus flight search proxy
  components/
    ui/                             # Button, Card, Modal, Badge
    trips/                          # TripCard, TripForm, TripGrid
    itinerary/                      # DayTabs, DayColumn, ActivityItem,
                                    # ActivityForm, FlightSearch
  lib/
    db.ts                           # Vercel Postgres client + schema init
    amadeus.ts                      # Amadeus OAuth2 client + searchFlights()
  types/
    index.ts                        # Trip, Activity, DayPlan, FlightMetadata
```
