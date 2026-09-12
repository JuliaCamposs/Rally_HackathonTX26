import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";
import { toMessageDto } from "@/lib/serialize";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const url = new URL(request.url);
  const sinceRaw = url.searchParams.get("since");
  const since = sinceRaw ? new Date(sinceRaw) : null;

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const membership = await prisma.rsvp.findUnique({
    where: { eventId_userId: { eventId: id, userId: currentUserId } },
    select: { id: true },
  });
  if (!membership) {
    return NextResponse.json({ error: "Join the event to view its chat" }, { status: 403 });
  }
  const messages = await prisma.message.findMany({
    where: {
      eventId: id,
      ...(since && !Number.isNaN(since.getTime()) ? { createdAt: { gt: since } } : {}),
    },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    messages: messages.map((m) => toMessageDto(m, currentUserId)),
  });
}

const postSchema = z.object({
  body: z.string().trim().min(1, "Message is empty").max(500, "Message is too long"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid message" },
      { status: 400 },
    );
  }

  // Chat is members-only, mirroring the locked state in the UI.
  const rsvp = await prisma.rsvp.findUnique({
    where: { eventId_userId: { eventId: id, userId: currentUserId } },
  });
  if (!rsvp) {
    return NextResponse.json({ error: "Join the event to chat" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: { eventId: id, userId: currentUserId, body: parsed.data.body },
    include: { author: true },
  });

  return NextResponse.json(
    { message: toMessageDto(message, currentUserId) },
    { status: 201 },
  );
}
