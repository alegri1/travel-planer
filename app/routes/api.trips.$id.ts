import type { Route } from "./+types/api.trips.$id";
import { prisma } from "@/lib/db";

export async function loader({ params }: Route.LoaderArgs) {
  const trip = await prisma.trip.findUnique({ where: { id: Number(params.id) } });
  if (!trip) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(trip);
}

export async function action({ request, params }: Route.ActionArgs) {
  const id = Number(params.id);

  if (request.method === "DELETE") {
    const existing = await prisma.trip.findUnique({ where: { id } });
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

    await prisma.trip.delete({ where: { id } });
    return new Response(null, { status: 204 });
  }

  // PUT
  const body = await request.json();
  const { name, destination, start_date, end_date } = body;

  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const trip = await prisma.trip.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      destination: destination ?? existing.destination,
      start_date: start_date ?? existing.start_date,
      end_date: end_date ?? existing.end_date,
    },
  });
  return Response.json(trip);
}
