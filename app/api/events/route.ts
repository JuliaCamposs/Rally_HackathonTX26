import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/current-user";
import { listEvents } from "@/lib/queries";
import { ALL_CATEGORIES } from "@/lib/types";

const querySchema = z.object({
  time: z.enum(["now", "later", "all"]).default("all"),
  source: z.enum(["all", "official", "community"]).default("all"),
  category: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(",").filter(Boolean) : []))
    .pipe(z.array(z.enum(ALL_CATEGORIES as [string, ...string[]]))),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    time: url.searchParams.get("time") ?? undefined,
    source: url.searchParams.get("source") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }
  const { time, source, category } = parsed.data;

  const currentUserId = await getCurrentUserId();
  if (!currentUserId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const body = await listEvents(
    { time, source, categories: category },
    currentUserId,
  );
  return NextResponse.json(body);
}
