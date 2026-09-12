"use client";

import { Progress } from "@/components/ui/progress";
import type { PointsDto } from "@/lib/points";
import { cn } from "@/lib/utils";

type PointsBarProps = {
  points: PointsDto;
  flash?: boolean;
  className?: string;
};

export function PointsBar({ points, flash = false, className }: PointsBarProps) {
  return (
    <div
      className={cn("rally-points", flash && "rally-points-flash", className)}
      aria-label={`${points.points} points, level ${points.level}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[12px] font-bold tabular-nums text-eucalyptus">
          {points.points} pts
        </span>
        <span className="text-[10px] font-bold tracking-[0.06em] uppercase text-mute">
          Lvl {points.level}
        </span>
      </div>
      <Progress
        value={points.progress}
        className="rally-points-meter gap-0"
        aria-label={`${points.intoLevel} of ${points.nextLevelAt} points to the next level`}
      />
    </div>
  );
}
