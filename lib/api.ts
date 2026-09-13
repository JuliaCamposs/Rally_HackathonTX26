"use client";

import useSWR, { useSWRConfig } from "swr";
import type { PointsDto } from "@/lib/points";
import type {
  EventDetailDto,
  EventListResponse,
  EventSummaryDto,
  MessageDto,
  SourceFilter,
  TimeFilter,
} from "@/lib/types";

export type EventFilters = {
  time: TimeFilter;
  source: SourceFilter;
  categories: string[];
};

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export function eventsKey(filters: EventFilters): string {
  const params = new URLSearchParams({ time: filters.time, source: filters.source });
  if (filters.categories.length > 0) {
    params.set("category", filters.categories.join(","));
  }
  return `/api/events?${params.toString()}`;
}

export function useEvents(filters: EventFilters, fallback?: EventListResponse) {
  return useSWR<EventListResponse>(eventsKey(filters), fetcher, {
    fallbackData: fallback,
    refreshInterval: 30_000,
    revalidateOnMount: true,
    keepPreviousData: true,
  });
}

export function useEventDetail(id: string | null, joined: boolean) {
  return useSWR<{ event: EventDetailDto }>(id ? `/api/events/${id}` : null, fetcher, {
    // Chat updates: poll while the detail view is open and joined.
    refreshInterval: joined ? 5_000 : 15_000,
  });
}

export function usePoints(fallback?: PointsDto) {
  return useSWR<PointsDto>("/api/me/points", fetcher, {
    fallbackData: fallback,
    revalidateOnMount: true,
  });
}

export function useEventActions() {
  const { mutate } = useSWRConfig();

  async function setJoined(event: EventSummaryDto, join: boolean) {
    const res = await fetch(`/api/events/${event.id}/join`, { method: join ? "POST" : "DELETE" });
    if (!res.ok) throw new Error("Could not update RSVP");
    const data = (await res.json()) as { joined: boolean; attendeeCount: number };

    // Revalidate list + detail so counts, stacks and chat lock stay in sync.
    await Promise.all([
      mutate((key) => typeof key === "string" && key.startsWith("/api/events?")),
      mutate(`/api/events/${event.id}`),
    ]);
    return data;
  }

  async function confirmPresence(eventId: string, proof: File) {
    const formData = new FormData();
    formData.set("proof", proof);
    const res = await fetch(`/api/events/${eventId}/presence`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? "Could not confirm presence");
    }
    const data = (await res.json()) as PointsDto & { present: boolean; awarded: number };
    await Promise.all([
      mutate("/api/me/points"),
      mutate((key) => typeof key === "string" && key.startsWith("/api/events?")),
      mutate(`/api/events/${eventId}`),
    ]);
    return data;
  }

  async function sendMessage(eventId: string, body: string): Promise<MessageDto> {
    const res = await fetch(`/api/events/${eventId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error ?? "Could not send message");
    }
    const data = (await res.json()) as { message: MessageDto };
    await mutate(`/api/events/${eventId}`);
    return data.message;
  }

  return { setJoined, sendMessage, confirmPresence };
}
