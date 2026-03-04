import type { Route } from "./+types/api.trips.$id.activities";
import { prisma } from "@/lib/db";

export async function loader({ params }: Route.LoaderArgs) {
  const activities = await prisma.activity.findMany({
    where: { trip_id: Number(params.id) },
    orderBy: [{ day_index: "asc" }, { position: "asc" }],
  });
  return Response.json(activities);
}

export async function action({ request, params }: Route.ActionArgs) {
  const id = Number(params.id);
  const body = await request.json();
  const { day_index, title, time, notes, metadata } = body;

  if (day_index === undefined || !title) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) return Response.json({ error: "Trip not found" }, { status: 404 });

  const maxResult = await prisma.activity.aggregate({
    where: { trip_id: id, day_index },
    _max: { position: true },
  });
  const position = (maxResult._max.position ?? -1) + 1;

  const activity = await prisma.activity.create({
    data: {
      trip_id: id,
      day_index,
      position,
      title,
      time: time ?? null,
      notes: notes ?? null,
      metadata: metadata ?? null,
    },
  });
  return Response.json(activity, { status: 201 });
}
