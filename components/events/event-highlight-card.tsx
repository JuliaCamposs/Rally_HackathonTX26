"use client";

import Image from "next/image";
import { useState } from "react";
import { CategoryIcon, Icon } from "@/components/icons";
import { AttendeeStack } from "@/components/events/attendee-stack";
import { JoinButton } from "@/components/events/join-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CATEGORY_LABEL, type EventSummaryDto } from "@/lib/types";
import { cn } from "@/lib/utils";

type EventHighlightCardProps = {
  event: EventSummaryDto;
  selected: boolean;
  onSelect: () => void;
  onToggleJoin: () => Promise<void> | void;
};

export function EventHighlightCard({
  event,
  selected,
  onSelect,
  onToggleJoin,
}: EventHighlightCardProps) {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <Card
      data-selected={selected || undefined}
      className={cn(
        "rally-event-card group gap-0 overflow-hidden rounded-[14px] border-line py-0 shadow-none transition-[border-color,box-shadow,transform]",
        "hover:-translate-y-px hover:border-pistachio hover:shadow-md",
        selected && "border-jade shadow-[0_0_0_2px_rgba(46,139,111,0.16)]",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${event.title}, ${event.venueName}, ${event.whenLabel}`}
        className="block w-full cursor-pointer text-left"
      >
        <span className="relative block aspect-[16/8] w-full overflow-hidden bg-line-soft">
          {photoFailed ? (
            <span className="absolute inset-0 bg-brand" aria-hidden="true" />
          ) : (
            <Image
              src={event.photoPath}
              alt=""
              fill
              sizes="(max-width: 899px) 100vw, 440px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              onError={() => setPhotoFailed(true)}
            />
          )}
          {event.live && (
            <Badge className="absolute top-2.5 left-2.5 gap-[5px] rounded-full border-transparent bg-pistachio px-2 py-[3px] text-[10.5px] font-bold tracking-[0.05em] uppercase text-ink shadow-sm before:size-[6px] before:rounded-full before:bg-deep">
              Now
            </Badge>
          )}
        </span>

        <span className="flex flex-col gap-3 px-4 pt-4 pb-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className={cn(
                "rounded-full px-2 py-[3px] text-[10.5px] font-bold tracking-[0.05em] uppercase",
                event.source === "official"
                  ? "border-[#d2e3d8] bg-[#e7f0ea] text-deep"
                  : "border-[#e3edd8] bg-[#f2f7ec] text-[#5c7444]",
              )}
            >
              {event.source === "official" ? "Texas Tech Events" : "Community Event"}
            </Badge>
            <Badge
              variant="outline"
              className="gap-1 rounded-full border-line bg-white px-2 py-[3px] text-[10.5px] font-bold tracking-[0.05em] uppercase text-mute"
            >
              <CategoryIcon category={event.category} className="size-3" strokeWidth={1.8} />
              {CATEGORY_LABEL[event.category]}
            </Badge>
          </span>

          <span className="text-[18px] leading-[1.35] font-bold tracking-[-0.01em] text-ink">
            {event.title}
          </span>

          <span className="flex flex-col gap-2 text-[12.5px] text-mute">
            <span className="flex flex-wrap items-center gap-1.5">
              <Icon name="clock" className="size-3.5 flex-none text-jade" />
              <b className="font-semibold text-eucalyptus">{event.dayLabel}</b>
              <span className="text-line">·</span>
              {event.timeLabel}
              <span className="text-line">·</span>
              <span className="font-medium">{event.whenLabel}</span>
            </span>
            <span className="flex flex-wrap items-center gap-1.5">
              <Icon name="pin" className="size-3.5 flex-none text-jade" />
              {event.venueName}
            </span>
          </span>

          <span className="line-clamp-2 text-[12.5px] leading-[1.5] text-mute">
            {event.description}
          </span>
        </span>
      </button>

      <div className="flex flex-col gap-3 mx-4 mt-3 border-t border-line-soft pt-3 pb-4">
        <AttendeeStack attendees={event.attendees} count={event.attendeeCount} max={5} />
        <div className="flex gap-2">
          <JoinButton joined={event.joined} onToggle={onToggleJoin} size="sm" className="flex-1" />
          <Button
            type="button"
            variant="outline"
            onClick={onSelect}
            className="h-10 rounded-xl border-[1.5px] border-line px-4 text-[13px] font-bold text-eucalyptus shadow-none hover:border-eucalyptus hover:bg-white hover:text-eucalyptus"
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
