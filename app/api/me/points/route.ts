import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getUserPoints } from "@/lib/queries";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return NextResponse.json(await getUserPoints(userId));
}
