"use client";

import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { AttendeeStack } from "@/components/events/attendee-stack";
import { EventChat } from "@/components/events/event-chat";
import { ConfirmPresenceButton } from "@/components/events/confirm-presence-button";
import { JoinButton } from "@/components/events/join-button";
import type { EventDetailDto } from "@/lib/types";

type EventDetailProps = {
  event: EventDetailDto;
  onBack: () => void;
  onToggleJoin: () => Promise<void> | void;
  onConfirmPresence: (proof: File) => Promise<void> | void;
  onSendMessage: (body: string) => Promise<void>;
};

function SourceBadges({ event }: { event: EventDetailDto }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge
        variant="outline"
        className="rounded-full border-[#d2e3d8] bg-[#e7f0ea] px-2 py-[3px] text-[10.5px] font-bold tracking-[0.05em] uppercase text-deep"
      >
        {event.source === "official" ? "Texas Tech Events" : "Community Event"}
      </Badge>
      {event.live && (
        <Badge className="gap-[5px] rounded-full border-transparent bg-pistachio px-2 py-[3px] text-[10.5px] font-bold tracking-[0.05em] uppercase text-ink before:size-[6px] before:rounded-full before:bg-deep">
          Now
        </Badge>
      )}
    </div>
  );
}

export function EventDetail({
  event,
  onBack,
  onToggleJoin,
  onConfirmPresence,
  onSendMessage,
}: EventDetailProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-[7px] border-b border-line-soft px-[15px] py-[13px] text-[13px] font-semibold text-mute transition-colors hover:text-eucalyptus"
      >
        <Icon name="back" className="size-[15px]" strokeWidth={2} />
        All events
      </button>

      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-[17px] pt-[15px] pb-[17px]">
        <SourceBadges event={event} />
        <h2 className="font-heading m-0 text-[21px] leading-[1.2] font-bold tracking-[-0.02em] text-balance">
          {event.title}
        </h2>
        <p className="m-0 text-sm leading-[1.6] text-[#33453d]">{event.description}</p>

        <div className="flex flex-col gap-px overflow-hidden rounded-[14px] border border-line-soft bg-line-soft">
          <div className="flex items-start gap-2.5 bg-white px-3 py-2.5">
            <Icon name="pin" className="mt-px size-4 flex-none text-jade" />
            <span>
              <span className="mb-px block text-[11px] font-bold tracking-[0.06em] uppercase text-faint">
                Where
              </span>
              <span className="text-[13.5px] font-semibold text-ink">{event.venueName}</span>
            </span>
          </div>
          <div className="flex items-start gap-2.5 bg-white px-3 py-2.5">
            <Icon name="clock" className="mt-px size-4 flex-none text-jade" />
            <span>
              <span className="mb-px block text-[11px] font-bold tracking-[0.06em] uppercase text-faint">
                When
              </span>
              <span className="text-[13.5px] font-semibold text-ink">
                {event.dayLabel}, {event.timeLabel}
                <small className="block text-[12.5px] font-medium text-mute">{event.whenLabel}</small>
              </span>
            </span>
          </div>
          <div className="flex items-start gap-2.5 bg-white px-3 py-2.5">
            <Icon
              name={event.source === "official" ? "shield" : "person"}
              className="mt-px size-4 flex-none text-jade"
            />
            <span>
              <span className="mb-px block text-[11px] font-bold tracking-[0.06em] uppercase text-faint">
                Organized by
              </span>
              <span className="text-[13.5px] font-semibold text-ink">
                {event.organizerName}
                <small className="block text-[12.5px] font-medium text-mute">{event.organizerRole}</small>
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <AttendeeStack attendees={event.attendees} count={event.attendeeCount} max={8} />
          <JoinButton joined={event.joined} onToggle={onToggleJoin} />
          <ConfirmPresenceButton
            joined={event.joined}
            live={event.live}
            present={event.present}
            onConfirm={onConfirmPresence}
          />
        </div>

        <EventChat
          eventId={event.id}
          joined={event.joined}
          attendeeCount={event.attendeeCount}
          messages={event.messages}
          onSend={onSendMessage}
        />
      </div>
    </div>
  );
}
