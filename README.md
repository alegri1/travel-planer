# Travel Planner

A personal travel planning app for managing trips and day-by-day itineraries, with live flight search powered by the Amadeus API.

> Bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Trip dashboard** — create and delete trips with a name, destination, and date range
- **Day-by-day itinerary** — activities are organised per day across the full trip duration
- **Manual activities** — add any activity with a title, time, and notes
- **Flight search** — search live flights via Amadeus and add them directly to a day; saved flights render as rich cards showing flight number, route, departure/arrival times, cabin class, stops, duration, and price
- **Persistent storage** — SQLite database via better-sqlite3

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — local SQLite database
- [Amadeus Self-Service APIs](https://developers.amadeus.com/) — flight offers search

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy `env.example` to `.env.local` and fill in your Amadeus credentials:

```bash
cp env.example .env.local
```

Sign up for free at [developers.amadeus.com](https://developers.amadeus.com/) and create an app under the **test** environment to get your `AMADEUS_CLIENT_ID` and `AMADEUS_CLIENT_SECRET`.

### 3. Run the dev server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

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
    db.ts                           # SQLite singleton
    amadeus.ts                      # Amadeus OAuth2 client + searchFlights()
  types/
    index.ts                        # Trip, Activity, DayPlan, FlightMetadata
data/
  travel.db                         # SQLite database (git-ignored)
```
