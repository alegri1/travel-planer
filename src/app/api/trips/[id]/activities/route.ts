import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const activities = await prisma.activity.findMany({
    where: { trip_id: Number(id) },
    orderBy: [{ day_index: "asc" }, { position: "asc" }],
  });
  return NextResponse.json(activities);
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { day_index, title, time, notes, metadata } = body;

  if (day_index === undefined || !title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const trip = await prisma.trip.findUnique({ where: { id: Number(id) } });
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  const maxResult = await prisma.activity.aggregate({
    where: { trip_id: Number(id), day_index },
    _max: { position: true },
  });
  const position = (maxResult._max.position ?? -1) + 1;

  const activity = await prisma.activity.create({
    data: {
      trip_id: Number(id),
      day_index,
      position,
      title,
      time: time ?? null,
      notes: notes ?? null,
      metadata: metadata ?? null,
    },
  });
  return NextResponse.json(activity, { status: 201 });
}
