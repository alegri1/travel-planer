import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Trip } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  const trip = db.prepare("SELECT * FROM trips WHERE id = ?").get(id) as Trip | undefined;
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(trip);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { name, destination, start_date, end_date } = body;

  const db = getDb();
  const existing = db.prepare("SELECT * FROM trips WHERE id = ?").get(id) as Trip | undefined;
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.prepare(
    "UPDATE trips SET name = ?, destination = ?, start_date = ?, end_date = ? WHERE id = ?"
  ).run(
    name ?? existing.name,
    destination ?? existing.destination,
    start_date ?? existing.start_date,
    end_date ?? existing.end_date,
    id
  );

  const updated = db.prepare("SELECT * FROM trips WHERE id = ?").get(id) as Trip;
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const db = getDb();
  const existing = db.prepare("SELECT * FROM trips WHERE id = ?").get(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.prepare("DELETE FROM trips WHERE id = ?").run(id);
  return new NextResponse(null, { status: 204 });
}
