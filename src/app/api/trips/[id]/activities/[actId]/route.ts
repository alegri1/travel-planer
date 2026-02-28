import { NextResponse } from "next/server";
import { sql, ensureDb } from "@/lib/db";
import type { Activity } from "@/types";

type Params = { params: Promise<{ id: string; actId: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { actId } = await params;
  const body = await request.json();
  const { day_index, position, title, time, notes } = body;

  await ensureDb();
  const { rows: existing } = await sql<Activity>`SELECT * FROM activities WHERE id = ${actId}`;
  if (!existing[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { rows } = await sql<Activity>`
    UPDATE activities
    SET day_index = ${day_index ?? existing[0].day_index},
        position  = ${position ?? existing[0].position},
        title     = ${title ?? existing[0].title},
        time      = ${time !== undefined ? time : existing[0].time},
        notes     = ${notes !== undefined ? notes : existing[0].notes}
    WHERE id = ${actId}
    RETURNING *
  `;
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { actId } = await params;
  await ensureDb();
  const { rows } = await sql`SELECT id FROM activities WHERE id = ${actId}`;
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await sql`DELETE FROM activities WHERE id = ${actId}`;
  return new NextResponse(null, { status: 204 });
}
