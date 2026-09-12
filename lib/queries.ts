import { prisma } from "@/lib/db";
import { toPointsDto, type PointsDto } from "@/lib/points";
import { toEventDetail, toEventSummary } from "@/lib/serialize";
import { isLive } from "@/lib/time";
import type {
  EventDetailDto,
  EventListResponse,
  SourceFilter,
  TimeFilter,
} from "@/lib/types";

async function presenceIdsFor(userId: string): Promise<Set<string>> {
  const rows = await prisma.presence.findMany({
    where: { userId },
    select: { eventId: true },
  });
  return new Set(rows.map((r) => r.eventId));
}

export async function getUserPoints(userId: string): Promise<PointsDto> {
  const rows = await prisma.presence.findMany({
    where: { userId },
    select: { pointsAwarded: true },
  });
  const total = rows.reduce((sum, r) => sum + r.pointsAwarded, 0);
  return toPointsDto(total, rows.length);
}

export type ListParams = {
  time: TimeFilter;
  source: SourceFilter;
  categories: string[];
};

export async function listEvents(
  params: ListParams,
  currentUserId: string,
): Promise<EventListResponse> {
  const [events, presentIds] = await Promise.all([
    prisma.event.findMany({
      where: params.source === "all" ? {} : { source: params.source },
      include: { rsvps: { include: { user: true } } },
      orderBy: { startsAt: "asc" },
    }),
    presenceIdsFor(currentUserId),
  ]);

  const now = new Date();
  const visible = events
    .filter((e) => e.endsAt > now) // past events drop off the map
    .filter((e) => {
      if (params.time === "now") return isLive(e.startsAt, e.endsAt, now);
      if (params.time === "later") return e.startsAt > now;
      return true;
    })
    .filter(
      (e) => params.categories.length === 0 || params.categories.includes(e.category),
    )
    // Live events first, then by start time.
    .sort((a, b) => {
      const liveDiff =
        Number(isLive(b.startsAt, b.endsAt, now)) -
        Number(isLive(a.startsAt, a.endsAt, now));
      return liveDiff !== 0 ? liveDiff : a.startsAt.getTime() - b.startsAt.getTime();
    });

  return {
    events: visible.map((e) => toEventSummary(e, currentUserId, now, presentIds)),
    total: events.length,
  };
}

export async function getEventDetail(
  id: string,
  currentUserId: string,
): Promise<EventDetailDto | null> {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      rsvps: { include: { user: true } },
      messages: { include: { author: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!event) return null;
  if (!event.rsvps.some((r) => r.userId === currentUserId)) {
    event.messages = [];
  }
  const presentIds = await presenceIdsFor(currentUserId);
  return toEventDetail(event, currentUserId, new Date(), presentIds);
}
