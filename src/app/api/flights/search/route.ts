import { NextResponse } from "next/server";
import { searchFlights } from "@/lib/amadeus";

export async function POST(request: Request) {
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Amadeus API keys are not configured. Add AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET to .env.local." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { origin, destination, date, adults } = body;

  if (!origin || !destination || !date) {
    return NextResponse.json(
      { error: "origin, destination, and date are required" },
      { status: 400 }
    );
  }

  try {
    const flights = await searchFlights(origin, destination, date, adults ?? 1);
    return NextResponse.json(flights);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
