import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Activity } from "@/types";

type Params = { params: Promise<{ id: string; actId: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { actId } = await params;
  const body = await request.json();
  const { day_index, position, title, time, notes } = body;

  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM activities WHERE id = ?")
    .get(actId) as Activity | undefined;
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.prepare(
    "UPDATE activities SET day_index = ?, position = ?, title = ?, time = ?, notes = ? WHERE id = ?"
  ).run(
    day_index ?? existing.day_index,
    position ?? existing.position,
    title ?? existing.title,
    time !== undefined ? time : existing.time,
    notes !== undefined ? notes : existing.notes,
    actId
  );

  const updated = db
    .prepare("SELECT * FROM activities WHERE id = ?")
    .get(actId) as Activity;
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { actId } = await params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM activities WHERE id = ?").get(actId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.prepare("DELETE FROM activities WHERE id = ?").run(actId);
  return new NextResponse(null, { status: 204 });
}
