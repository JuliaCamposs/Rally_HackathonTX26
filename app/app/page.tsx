import Link from "next/link";
import { RallyApp } from "@/components/rally-app";
import { getCurrentUserId } from "@/lib/current-user";
import { getUserPoints, listEvents } from "@/lib/queries";
import type { PointsDto } from "@/lib/points";
import type { EventListResponse } from "@/lib/types";

async function loadCampus(currentUserId: string): Promise<
  | { ok: true; data: EventListResponse; points: PointsDto }
  | { ok: false }
> {
  try {
    const [data, points] = await Promise.all([
      listEvents({ time: "all", source: "all", categories: [] }, currentUserId),
      getUserPoints(currentUserId),
    ]);
    return { ok: true, data, points };
  } catch (error) {
    console.error("Failed to load campus map", error);
    return { ok: false };
  }
}

function MapLoadError() {
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Couldn’t load the campus map
      </h1>
      <p className="text-[15px] leading-relaxed text-mute">
        Rally couldn’t reach the event database. Try again in a moment, or head
        back to the home page.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <form action="/app">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-eucalyptus px-5 text-[14px] font-bold text-white hover:bg-eucalyptus/90"
          >
            Try again
          </button>
        </form>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-line px-5 text-[14px] font-bold text-ink hover:bg-line-soft"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default async function CampusAppPage() {
  const currentUserId = await getCurrentUserId();
  const result = await loadCampus(currentUserId);
  if (!result.ok) {
    return <MapLoadError />;
  }
  return <RallyApp initialData={result.data} initialPoints={result.points} />;
}
