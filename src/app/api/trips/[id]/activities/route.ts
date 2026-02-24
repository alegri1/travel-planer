import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Activity } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  const activities = db
    .prepare(
      "SELECT * FROM activities WHERE trip_id = ? ORDER BY day_index ASC, position ASC"
    )
    .all(id) as Activity[];
  return NextResponse.json(activities);
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { day_index, title, time, notes } = body;

  if (day_index === undefined || !title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = getDb();
  const trip = db.prepare("SELECT * FROM trips WHERE id = ?").get(id);
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  const maxRow = db
    .prepare(
      "SELECT MAX(position) as maxPos FROM activities WHERE trip_id = ? AND day_index = ?"
    )
    .get(id, day_index) as { maxPos: number | null };
  const position = (maxRow.maxPos ?? -1) + 1;

  const result = db
    .prepare(
      "INSERT INTO activities (trip_id, day_index, position, title, time, notes) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(id, day_index, position, title, time ?? null, notes ?? null);

  const activity = db
    .prepare("SELECT * FROM activities WHERE id = ?")
    .get(result.lastInsertRowid) as Activity;
  return NextResponse.json(activity, { status: 201 });
}
