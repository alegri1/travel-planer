import { NextResponse } from "next/server";
import { sql, ensureDb } from "@/lib/db";
import type { Trip } from "@/types";

export async function GET() {
  await ensureDb();
  const { rows } = await sql<Trip>`SELECT * FROM trips ORDER BY start_date ASC`;
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, destination, start_date, end_date } = body;

  if (!name || !destination || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await ensureDb();
  const { rows } = await sql<Trip>`
    INSERT INTO trips (name, destination, start_date, end_date)
    VALUES (${name}, ${destination}, ${start_date}, ${end_date})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
