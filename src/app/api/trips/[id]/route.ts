import { NextResponse } from "next/server";
import { sql, ensureDb } from "@/lib/db";
import type { Trip } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  await ensureDb();
  const { rows } = await sql<Trip>`SELECT * FROM trips WHERE id = ${id}`;
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { name, destination, start_date, end_date } = body;

  await ensureDb();
  const { rows: existing } = await sql<Trip>`SELECT * FROM trips WHERE id = ${id}`;
  if (!existing[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { rows } = await sql<Trip>`
    UPDATE trips
    SET name        = ${name ?? existing[0].name},
        destination = ${destination ?? existing[0].destination},
        start_date  = ${start_date ?? existing[0].start_date},
        end_date    = ${end_date ?? existing[0].end_date}
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  await ensureDb();
  const { rows } = await sql`SELECT id FROM trips WHERE id = ${id}`;
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await sql`DELETE FROM trips WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
