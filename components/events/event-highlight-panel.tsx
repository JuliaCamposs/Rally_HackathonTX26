"use client";

import { RallyBuddy } from "@/components/rally-buddy";
import { EventHighlightCard } from "@/components/events/event-highlight-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventSummaryDto } from "@/lib/types";

type EventHighlightPanelProps = {
  events: EventSummaryDto[];
  total: number;
  loading: boolean;
  refreshing?: boolean;
  error: Error | undefined;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleJoin: (event: EventSummaryDto) => Promise<void> | void;
  onClearFilters: () => void;
  onRetry: () => void;
};

function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-3 overflow-hidden p-4"><div role="status" className="flex items-center gap-3 text-sm text-mute"><RallyBuddy animated className="h-14 w-11" />Finding campus events…</div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="overflow-hidden rounded-[14px] border border-line bg-white">
          <Skeleton className="aspect-[16/8] w-full rounded-none bg-line-soft" />
          <div className="flex flex-col gap-2 p-3.5">
            <Skeleton className="h-4 w-24 bg-line-soft" />
            <Skeleton className="h-5 w-3/4 bg-line-soft" />
            <Skeleton className="h-3.5 w-full bg-line-soft" />
            <Skeleton className="h-3.5 w-2/3 bg-line-soft" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EventHighlightPanel({
  events,
  total,
  loading,
  refreshing,
  error,
  selectedId,
  onSelect,
  onToggleJoin,
  onClearFilters,
  onRetry,
}: EventHighlightPanelProps) {
  const live = events.filter((e) => e.live);
  const upcoming = events.filter((e) => !e.live);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line-soft px-5 py-5">
        <h2 className="m-0 text-lg font-bold tracking-[-0.01em]">
          Event highlights
        </h2>
        <span className="ml-auto rounded-md bg-line-soft px-2 py-1 text-xs font-semibold text-mute tabular-nums">
          {events.length} of {total}
        </span>
      </div>

      <div className="sr-only" role="status">{refreshing ? "Updating events…" : `${events.length} events found`}</div>
      {loading ? (
        <PanelSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center gap-2.5 px-5 py-[34px] text-center text-[13.5px] text-mute">
          <span role="alert">Could not load events right now.</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border-[1.5px] border-line bg-white px-4 py-2 text-[13px] font-semibold text-eucalyptus transition-colors hover:border-eucalyptus"
          >
            Try again
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 px-5 py-[34px] text-center text-[13.5px] text-mute">
          <RallyBuddy /><h3 className="text-base font-bold text-ink">Your next plan is out there.</h3><span>No events match these filters. Try a different category or see everything on campus.</span>
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-full border-[1.5px] border-line bg-white px-4 py-2 text-[13px] font-semibold text-eucalyptus transition-colors hover:border-eucalyptus"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-5 p-4">
            {live.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <h3 className="flex items-center gap-1.5 px-1 text-[11px] font-bold tracking-[0.07em] uppercase text-mute">
                  <span className="size-[7px] rounded-full bg-jade" />
                  Happening now
                </h3>
                {live.map((e) => (
                  <EventHighlightCard
                    key={e.id}
                    event={e}
                    selected={selectedId === e.id}
                    onSelect={() => onSelect(e.id)}
                    onToggleJoin={() => onToggleJoin(e)}
                  />
                ))}
              </section>
            )}
            {upcoming.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <h3 className="px-1 text-[11px] font-bold tracking-[0.07em] uppercase text-mute">
                  Upcoming
                </h3>
                {upcoming.map((e) => (
                  <EventHighlightCard
                    key={e.id}
                    event={e}
                    selected={selectedId === e.id}
                    onSelect={() => onSelect(e.id)}
                    onToggleJoin={() => onToggleJoin(e)}
                  />
                ))}
              </section>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
