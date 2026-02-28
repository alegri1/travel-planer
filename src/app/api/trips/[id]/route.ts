import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id: Number(id) } });
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(trip);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const { name, destination, start_date, end_date } = body;

  const existing = await prisma.trip.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const trip = await prisma.trip.update({
    where: { id: Number(id) },
    data: {
      name: name ?? existing.name,
      destination: destination ?? existing.destination,
      start_date: start_date ?? existing.start_date,
      end_date: end_date ?? existing.end_date,
    },
  });
  return NextResponse.json(trip);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const existing = await prisma.trip.findUnique({ where: { id: Number(id) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.trip.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}
