import type { Route } from "./+types/api.trips.$id.activities.$actId";
import { prisma } from "@/lib/db";

export async function action({ request, params }: Route.ActionArgs) {
  const actId = Number(params.actId);

  if (request.method === "DELETE") {
    const existing = await prisma.activity.findUnique({ where: { id: actId } });
    if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

    await prisma.activity.delete({ where: { id: actId } });
    return new Response(null, { status: 204 });
  }

  // PUT
  const body = await request.json();
  const { day_index, position, title, time, notes } = body;

  const existing = await prisma.activity.findUnique({ where: { id: actId } });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const activity = await prisma.activity.update({
    where: { id: actId },
    data: {
      day_index: day_index ?? existing.day_index,
      position: position ?? existing.position,
      title: title ?? existing.title,
      time: time !== undefined ? time : existing.time,
      notes: notes !== undefined ? notes : existing.notes,
    },
  });
  return Response.json(activity);
}
