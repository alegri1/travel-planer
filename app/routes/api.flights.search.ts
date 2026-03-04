import type { Route } from "./+types/api.flights.search";
import { searchFlights } from "@/lib/amadeus";

export async function action({ request }: Route.ActionArgs) {
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    return Response.json(
      { error: "Amadeus API keys are not configured. Add AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET to .env.local." },
      { status: 503 },
    );
  }

  const body = await request.json();
  const { origin, destination, date, adults } = body;

  if (!origin || !destination || !date) {
    return Response.json(
      { error: "origin, destination, and date are required" },
      { status: 400 },
    );
  }

  try {
    const flights = await searchFlights(origin, destination, date, adults ?? 1);
    return Response.json(flights);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
