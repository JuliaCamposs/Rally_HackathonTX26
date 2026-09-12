export type EventCategory = "sports" | "study" | "social" | "workshops" | "clubs";
export type EventSource = "official" | "community";
export type TimeFilter = "now" | "later" | "all";
export type SourceFilter = "all" | EventSource;

export type AttendeeDto = {
  name: string;
  color: string;
  you: boolean;
};

export type EventSummaryDto = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: EventCategory;
  source: EventSource;
  live: boolean;
  startsAt: string;
  endsAt: string;
  timeLabel: string;
  whenLabel: string;
  dayLabel: string;
  venueName: string;
  lat: number;
  lng: number;
  photoPath: string;
  attendeeCount: number;
  attendees: AttendeeDto[];
  joined: boolean;
  present: boolean;
};

export type MessageDto = {
  id: string;
  authorName: string;
  authorColor: string;
  body: string;
  createdAt: string;
  timeLabel: string;
  mine: boolean;
};

export type EventDetailDto = EventSummaryDto & {
  organizerName: string;
  organizerRole: string;
  messages: MessageDto[];
};

export type EventListResponse = {
  events: EventSummaryDto[];
  total: number;
};

export type BuddyRecommendation = {
  event: EventSummaryDto;
  reason: string;
};

export type BuddyResponse = {
  reply: string;
  recommendations: BuddyRecommendation[];
  remaining: number;
};

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  sports: "Sports",
  study: "Study",
  social: "Social",
  workshops: "Workshops",
  clubs: "Clubs",
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as EventCategory[];
