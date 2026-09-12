"use client";

import { CategoryIcon } from "@/components/icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { EventFilters } from "@/lib/api";
import { ALL_CATEGORIES, CATEGORY_LABEL, type EventCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
};

const segClass =
  "rally-segment rounded-xl border border-line bg-white p-1 gap-1";
const segItemClass = cn(
  "rounded-lg px-4 py-2 text-[13.5px] font-semibold text-mute h-auto",
  "hover:text-eucalyptus hover:bg-transparent",
  "data-pressed:bg-eucalyptus data-pressed:text-white data-pressed:hover:bg-eucalyptus",
);

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="rally-filters flex flex-wrap items-center gap-3">
      <ToggleGroup
        aria-label="Filter by time"
        value={[filters.time]}
        onValueChange={(value) => {
          const next = value[0] as EventFilters["time"] | undefined;
          if (next) onChange({ ...filters, time: next });
        }}
        className={segClass}
        spacing={2}
      >
        <ToggleGroupItem value="now" aria-label="Happening now" className={segItemClass}>
          <span className="size-[7px] flex-none rounded-full bg-jade group-data-pressed/toggle:bg-lime" />
          Now
        </ToggleGroupItem>
        <ToggleGroupItem value="later" aria-label="Starting later" className={segItemClass}>
          Later
        </ToggleGroupItem>
        <ToggleGroupItem value="all" aria-label="All times" className={segItemClass}>
          All times
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        aria-label="Filter by event type"
        value={[filters.source]}
        onValueChange={(value) => {
          const next = value[0] as EventFilters["source"] | undefined;
          if (next) onChange({ ...filters, source: next });
        }}
        className={segClass}
        spacing={2}
      >
        <ToggleGroupItem value="all" className={segItemClass}>
          All events
        </ToggleGroupItem>
        <ToggleGroupItem value="official" className={segItemClass}>
          Texas Tech
        </ToggleGroupItem>
        <ToggleGroupItem value="community" className={segItemClass}>
          Community
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        aria-label="Filter by category"
        multiple
        value={filters.categories}
        onValueChange={(value) =>
          onChange({ ...filters, categories: value as EventCategory[] })
        }
        className="rally-categories flex-wrap gap-2"
      >
        {ALL_CATEGORIES.map((cat) => (
          <ToggleGroupItem
            key={cat}
            value={cat}
            className={cn(
              "min-h-10 h-auto gap-2 rounded-xl border border-line bg-white py-2 px-3.5 text-[13px] font-semibold text-mute",
              "hover:text-eucalyptus hover:border-pistachio hover:bg-white",
              "data-pressed:border-pistachio data-pressed:bg-pistachio data-pressed:text-ink data-pressed:hover:bg-pistachio",
            )}
          >
            <CategoryIcon category={cat} className="size-3.5" strokeWidth={1.6} />
            {CATEGORY_LABEL[cat]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
