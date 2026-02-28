import { sql } from "@vercel/postgres";

let ready: Promise<void> | null = null;

async function migrate(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS trips (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      destination TEXT NOT NULL,
      start_date  TEXT NOT NULL,
      end_date    TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id         SERIAL PRIMARY KEY,
      trip_id    INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
      day_index  INTEGER NOT NULL,
      position   INTEGER NOT NULL,
      title      TEXT NOT NULL,
      time       TEXT,
      notes      TEXT,
      metadata   TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export function ensureDb(): Promise<void> {
  if (!ready) ready = migrate();
  return ready;
}

export { sql };
