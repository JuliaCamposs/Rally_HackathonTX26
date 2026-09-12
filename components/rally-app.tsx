"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { EventDetail } from "@/components/events/event-detail";
import { EventHighlightPanel } from "@/components/events/event-highlight-panel";
import { FilterBar } from "@/components/filter-bar";
import { RallyBuddy } from "@/components/rally-buddy";
import { SiteHeader } from "@/components/site-header";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useEventActions, useEventDetail, useEvents, usePoints, type EventFilters } from "@/lib/api";
import type { PointsDto } from "@/lib/points";
import type { EventListResponse, EventSummaryDto } from "@/lib/types";

const CampusMap = dynamic(() => import("@/components/map/campus-map"), {
  ssr: false,
  loading: () => (
    <div className="rally-map-loading" role="status"><RallyBuddy animated /><span>Getting campus ready…</span></div>
  ),
});

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 899px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

const DEFAULT_FILTERS: EventFilters = { time: "all", source: "all", categories: [] };

export function RallyApp({
  initialData,
  initialPoints,
}: {
  initialData: EventListResponse;
  initialPoints: PointsDto;
}) {
  const [filters, setFilters] = useState<EventFilters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { data, error, isLoading, isValidating, mutate: mutateList } = useEvents(filters, initialData);
  const events = data?.events ?? [];
  const total = data?.total ?? 0;

  // Prototype behavior: a selection that gets filtered out is cleared.
  // (Render-phase state adjustment — React re-renders before commit.)
  if (selectedId && data && !data.events.some((e) => e.id === selectedId)) {
    setSelectedId(null);
  }

  const selectedSummary = events.find((e) => e.id === selectedId) ?? null;
  const { data: detailData } = useEventDetail(selectedId, selectedSummary?.joined ?? false);
  const detail = detailData?.event ?? null;

  const { data: points } = usePoints(initialPoints);
  const { setJoined, sendMessage, confirmPresence } = useEventActions();

  const toggleJoin = async (event: EventSummaryDto) => {
    await setJoined(event, !event.joined);
  };

  const detailView = detail ? (
    <EventDetail
      event={detail}
      onBack={() => setSelectedId(null)}
      onToggleJoin={() => toggleJoin(detail)}
      onConfirmPresence={async () => {
        await confirmPresence(detail.id);
      }}
      onSendMessage={async (body) => {
        await sendMessage(detail.id, body);
      }}
    />
  ) : (
    <div className="flex flex-col gap-3 p-5" role="status"><div className="flex items-center gap-3 text-sm text-mute"><RallyBuddy animated className="h-14 w-11" />Loading event details…</div>
      <Skeleton className="h-4 w-28 bg-line-soft" />
      <Skeleton className="h-7 w-3/4 bg-line-soft" />
      <Skeleton className="h-24 w-full bg-line-soft" />
      <Skeleton className="h-12 w-full rounded-full bg-line-soft" />
    </div>
  );

  const panel = (
    <EventHighlightPanel
      events={events}
      total={total}
      loading={isLoading && !data}
      refreshing={isValidating && !!data}
      error={error}
      selectedId={selectedId}
      onSelect={(id) => setSelectedId(id)}
      onToggleJoin={toggleJoin}
      onClearFilters={() => setFilters(DEFAULT_FILTERS)}
      onRetry={() => mutateList()}
    />
  );

  return (
    <div className="rally-shell">
      <a className="skip-link" href="#event-results">Skip to events</a>
      <SiteHeader points={points ?? initialPoints} />
      <FilterBar filters={filters} onChange={setFilters} />

      <main className="rally-workspace">
        <CampusMap events={events} selectedId={selectedId} onSelect={setSelectedId} />

        {/* Desktop rail: detail view when a pin/card is selected, else highlights */}
        <aside id={!isMobile ? "event-results" : undefined} tabIndex={-1} aria-label="Campus events" className="rally-desktop-panel">
          {selectedId ? detailView : panel}
        </aside>

        {/* Mobile: highlights stack below the map; detail opens in a sheet */}
        <div id={isMobile ? "event-results" : undefined} tabIndex={-1} className="rally-mobile-panel">
          {panel}
        </div>
      </main>

      <Sheet
        open={isMobile && selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <SheetContent
          side="bottom"
          className="h-[88vh] gap-0 rounded-t-[20px] border-line p-0"
        >
          <SheetTitle className="sr-only">{detail?.title ?? "Event details"}</SheetTitle>
          {detailView}
        </SheetContent>
      </Sheet>
    </div>
  );
}
