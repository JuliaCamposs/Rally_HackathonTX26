import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";
import { POINTS_PER_PRESENCE } from "@/lib/points";
import { getUserPoints } from "@/lib/queries";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  const event = await prisma.event.findUnique({ where: { id }, select: { id: true } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const rsvp = await prisma.rsvp.findUnique({
    where: { eventId_userId: { eventId: id, userId } },
  });
  if (!rsvp) {
    return NextResponse.json({ error: "Join the event to confirm you're here" }, { status: 403 });
  }

  const existing = await prisma.presence.findUnique({
    where: { eventId_userId: { eventId: id, userId } },
  });
  if (existing) {
    const points = await getUserPoints(userId);
    return NextResponse.json({ present: true, awarded: 0, ...points });
  }

  await prisma.presence.create({
    data: { eventId: id, userId, pointsAwarded: POINTS_PER_PRESENCE },
  });

  const points = await getUserPoints(userId);
  return NextResponse.json(
    { present: true, awarded: POINTS_PER_PRESENCE, ...points },
    { status: 201 },
  );
}
