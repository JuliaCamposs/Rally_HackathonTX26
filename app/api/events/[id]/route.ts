import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getEventDetail } from "@/lib/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const currentUserId = await getCurrentUserId();
  const event = await getEventDetail(id, currentUserId);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ event });
}
