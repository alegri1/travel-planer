import { NextResponse } from "next/server";
import { sql, ensureDb } from "@/lib/db";
import type { Activity } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  await ensureDb();
  const { rows } = await sql<Activity>`
    SELECT * FROM activities WHERE trip_id = ${id} ORDER BY day_index ASC, position ASC
  `;
  return NextResponse.json(rows);
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { day_index, title, time, notes, metadata } = body;

  if (day_index === undefined || !title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await ensureDb();
  const { rows: tripRows } = await sql`SELECT id FROM trips WHERE id = ${id}`;
  if (!tripRows[0]) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  const { rows: maxRows } = await sql<{ maxpos: number | null }>`
    SELECT MAX(position) as maxpos FROM activities WHERE trip_id = ${id} AND day_index = ${day_index}
  `;
  const position = (maxRows[0]?.maxpos ?? -1) + 1;

  const { rows } = await sql<Activity>`
    INSERT INTO activities (trip_id, day_index, position, title, time, notes, metadata)
    VALUES (${id}, ${day_index}, ${position}, ${title}, ${time ?? null}, ${notes ?? null}, ${metadata ?? null})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
