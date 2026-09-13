import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUserId } from "@/lib/current-user";
import { POINTS_PER_PRESENCE } from "@/lib/points";
import { getUserPoints } from "@/lib/queries";

export const runtime = "nodejs";

const MAX_PROOF_BYTES = 5 * 1024 * 1024;
function detectImageMimeType(bytes: Uint8Array): string | null {
  const isJpeg = bytes.length >= 3
    && bytes[0] === 0xff
    && bytes[1] === 0xd8
    && bytes[2] === 0xff;
  const isPng = bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a;
  const isWebp = bytes.length >= 12
    && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (isJpeg) return "image/jpeg";
  if (isPng) return "image/png";
  if (isWebp) return "image/webp";

  const isoBrand = bytes.length >= 12 ? String.fromCharCode(...bytes.slice(4, 12)) : "";
  if (isoBrand === "ftypavif") return "image/avif";
  if (["ftypheic", "ftypheix", "ftyphevc", "ftyphevx"].includes(isoBrand)) {
    return "image/heic";
  }
  if (isoBrand === "ftypmif1") return "image/heif";
  return null;
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
  if (proof.size > MAX_PROOF_BYTES) {
    return NextResponse.json(
      { error: "Keep the event photo under 5 MB" },
      { status: 413 },
    );
  }

  const proofImage = new Uint8Array(await proof.arrayBuffer());
  const proofMimeType = detectImageMimeType(proofImage);
  if (!proofMimeType) {
    return NextResponse.json(
      { error: "That file doesn’t appear to be a valid photo" },
      { status: 415 },
    );
  }

  await prisma.presence.create({
    data: {
      eventId: id,
      userId,
      pointsAwarded: POINTS_PER_PRESENCE,
      proofImage,
      proofMimeType,
    },
  });

  const points = await getUserPoints(userId);
  return NextResponse.json(
    { present: true, awarded: POINTS_PER_PRESENCE, ...points },
    { status: 201 },
  );
}
