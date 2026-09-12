import type { Event, Message, Rsvp, User } from "@prisma/client";
import type {
  AttendeeDto,
  EventCategory,
  EventDetailDto,
  EventSource,
  EventSummaryDto,
  MessageDto,
} from "@/lib/types";
import { formatClock, formatDay, formatTimeRange, formatWhen, isLive } from "@/lib/time";

export type EventWithRsvps = Event & { rsvps: (Rsvp & { user: User })[] };
export type EventWithRelations = EventWithRsvps & {
  messages: (Message & { author: User })[];
};

const MAX_STACK = 10;

function toAttendee(user: User, currentUserId: string): AttendeeDto {
  return {
    name: user.id === currentUserId ? "You" : user.name,
    color: user.avatarColor,
    you: user.id === currentUserId,
  };
}

export function toEventSummary(
  event: EventWithRsvps,
  currentUserId: string,
  now: Date,
  presentIds: Set<string> = new Set(),
): EventSummaryDto {
  const joined = event.rsvps.some((r) => r.userId === currentUserId);
  // Current user first in the stack, then everyone else in join order.
  const ordered = [...event.rsvps].sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    category: event.category as EventCategory,
    source: event.source as EventSource,
    live: isLive(event.startsAt, event.endsAt, now),
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt.toISOString(),
    timeLabel: formatTimeRange(event.startsAt, event.endsAt),
    whenLabel: formatWhen(event.startsAt, event.endsAt, now),
    dayLabel: formatDay(event.startsAt, now),
    venueName: event.venueName,
    lat: event.lat,
    lng: event.lng,
    photoPath: event.photoPath,
    attendeeCount: event.rsvps.length,
    attendees: ordered.slice(0, MAX_STACK).map((r) => toAttendee(r.user, currentUserId)),
    joined,
    present: presentIds.has(event.id),
  };
}

export function toMessageDto(
  message: Message & { author: User },
  currentUserId: string,
): MessageDto {
  const mine = message.userId === currentUserId;
  return {
    id: message.id,
    authorName: mine ? "You" : message.author.name,
    authorColor: message.author.avatarColor,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
    timeLabel: formatClock(message.createdAt),
    mine,
  };
}

export function toEventDetail(
  event: EventWithRelations,
  currentUserId: string,
  now: Date,
  presentIds: Set<string> = new Set(),
): EventDetailDto {
  return {
    ...toEventSummary(event, currentUserId, now, presentIds),
    organizerName: event.organizerName,
    organizerRole: event.organizerRole,
    messages: event.messages.map((m) => toMessageDto(m, currentUserId)),
  };
}
