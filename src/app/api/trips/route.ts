import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const trips = await prisma.trip.findMany({
    orderBy: { start_date: "asc" },
  });
  return NextResponse.json(trips);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, destination, start_date, end_date } = body;

  if (!name || !destination || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const trip = await prisma.trip.create({
    data: { name, destination, start_date, end_date },
  });
  return NextResponse.json(trip, { status: 201 });
}
