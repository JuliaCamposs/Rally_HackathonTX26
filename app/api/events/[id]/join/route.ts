import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";

async function joinState(eventId: string, userId: string) {
  const attendeeCount = await prisma.rsvp.count({ where: { eventId } });
  return { joined: true as const, attendeeCount, userId };
}

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

  await prisma.rsvp.upsert({
    where: { eventId_userId: { eventId: id, userId } },
    create: { eventId: id, userId },
    update: {},
  });

  return NextResponse.json(await joinState(id, userId));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  await prisma.rsvp.deleteMany({ where: { eventId: id, userId } });

  const attendeeCount = await prisma.rsvp.count({ where: { eventId: id } });
  return NextResponse.json({ joined: false, attendeeCount });
}
