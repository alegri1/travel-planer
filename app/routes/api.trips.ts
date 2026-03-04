import type { Route } from "./+types/api.trips";
import { prisma } from "@/lib/db";

export async function loader() {
  const trips = await prisma.trip.findMany({
    orderBy: { start_date: "asc" },
  });
  return Response.json(trips);
}

export async function action({ request }: Route.ActionArgs) {
  const body = await request.json();
  const { name, destination, start_date, end_date } = body;

  if (!name || !destination || !start_date || !end_date) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const trip = await prisma.trip.create({
    data: { name, destination, start_date, end_date },
  });
  return Response.json(trip, { status: 201 });
}
