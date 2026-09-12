import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getUserPoints } from "@/lib/queries";

export async function GET() {
  const userId = await getCurrentUserId();
  return NextResponse.json(await getUserPoints(userId));
}
