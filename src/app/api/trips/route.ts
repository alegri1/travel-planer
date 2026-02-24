import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Trip } from "@/types";

export async function GET() {
  const db = getDb();
  const trips = db.prepare("SELECT * FROM trips ORDER BY start_date ASC").all() as Trip[];
  return NextResponse.json(trips);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, destination, start_date, end_date } = body;

  if (!name || !destination || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare("INSERT INTO trips (name, destination, start_date, end_date) VALUES (?, ?, ?, ?)")
    .run(name, destination, start_date, end_date);

  const trip = db.prepare("SELECT * FROM trips WHERE id = ?").get(result.lastInsertRowid) as Trip;
  return NextResponse.json(trip, { status: 201 });
}
