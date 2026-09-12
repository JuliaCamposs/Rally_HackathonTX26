import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { AttendeeDto } from "@/lib/types";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  if (name === "You") return "You";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

type AttendeeStackProps = {
  attendees: AttendeeDto[];
  count: number;
  max?: number;
  className?: string;
};

export function AttendeeStack({ attendees, count, max = 5, className }: AttendeeStackProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex">
        {attendees.slice(0, max).map((a) => (
          <Avatar
            key={a.name}
            title={a.name}
            className="-ml-2 size-[25px] border-2 border-white first:ml-0"
          >
            <AvatarFallback
              className={cn(
                "text-[10px] font-bold text-white",
                a.you && "bg-ink",
              )}
              style={a.you ? undefined : { backgroundColor: a.color }}
            >
              {initials(a.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </span>
      <span className="text-[12.5px] text-mute tabular-nums">{count} joined</span>
    </span>
  );
}
