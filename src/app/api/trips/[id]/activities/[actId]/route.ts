import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string; actId: string }> };

export async function PUT(request: Request, { params }: Params) {
  const { actId } = await params;
  const body = await request.json();
  const { day_index, position, title, time, notes } = body;

  const existing = await prisma.activity.findUnique({ where: { id: Number(actId) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const activity = await prisma.activity.update({
    where: { id: Number(actId) },
    data: {
      day_index: day_index ?? existing.day_index,
      position: position ?? existing.position,
      title: title ?? existing.title,
      time: time !== undefined ? time : existing.time,
      notes: notes !== undefined ? notes : existing.notes,
    },
  });
  return NextResponse.json(activity);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { actId } = await params;
  const existing = await prisma.activity.findUnique({ where: { id: Number(actId) } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.activity.delete({ where: { id: Number(actId) } });
  return new NextResponse(null, { status: 204 });
}
