import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";
import { POINTS_PER_PRESENCE } from "@/lib/points";
import { getUserPoints } from "@/lib/queries";

export const runtime = "nodejs";

const MAX_PROOF_BYTES = 4 * 1024 * 1024;
const IMAGE_FILE_EXTENSION = /\.(?:avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || IMAGE_FILE_EXTENSION.test(file.name);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const event = await prisma.event.findUnique({
    where: { id },
    select: { id: true, startsAt: true, endsAt: true },
  });
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

  const now = new Date();
  if (event.startsAt > now) {
    return NextResponse.json(
      { error: "Photo check-in opens when the event starts" },
      { status: 409 },
    );
  }
  if (event.endsAt <= now) {
    return NextResponse.json(
      { error: "Photo check-in has closed for this event" },
      { status: 409 },
    );
  }

  const formData = await request.formData().catch(() => null);
  const proof = formData?.get("proof");
  if (!(proof instanceof File) || proof.size === 0) {
    return NextResponse.json(
      { error: "Take or choose an event photo to earn points" },
      { status: 400 },
    );
  }
  if (!isImageFile(proof)) {
    return NextResponse.json(
      { error: "Choose an image file for your event photo" },
      { status: 415 },
    );
  }
  if (proof.size > MAX_PROOF_BYTES) {
    return NextResponse.json(
      { error: "The event photo could not be prepared for upload" },
      { status: 413 },
    );
  }

  const proofImage = new Uint8Array(await proof.arrayBuffer());

  await prisma.presence.create({
    data: {
      eventId: id,
      userId,
      pointsAwarded: POINTS_PER_PRESENCE,
      proofImage,
      proofMimeType: proof.type || "image/unknown",
    },
  });

  const points = await getUserPoints(userId);
  return NextResponse.json(
    { present: true, awarded: POINTS_PER_PRESENCE, ...points },
    { status: 201 },
  );
}
