import { PIN_GRADIENT_ID, pinSvgMarkup } from "@/components/map/pin-icon";
import type { EventCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Shared gradient defs — render once per page so every pin SVG can reference
 * the brand gradient by id without duplicating it.
 */
export function PinGradientDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        <linearGradient
          id={PIN_GRADIENT_ID}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#a8dc6f" />
          <stop offset="52%" stopColor="#2e8b6f" />
          <stop offset="100%" stopColor="#0f5c4c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

type EventPinProps = {
  live: boolean;
  official?: boolean;
  category: EventCategory;
  count?: number;
  selected?: boolean;
  size?: number;
  className?: string;
};

/** React-rendered Rally pin (legend, previews). Map markers use pin-icon.ts. */
export function EventPin({
  live,
  official = false,
  category,
  count,
  selected = false,
  size = 44,
  className,
}: EventPinProps) {
  const height = Math.round((size * 48) / 44);
  return (
    <span className={cn("rally-pin relative inline-block", className)}>
      <span
        className="rally-pin-inner relative inline-block"
        data-selected={selected || undefined}
      >
        {live && <span className="rally-pulse" aria-hidden="true" />}
        <span
          dangerouslySetInnerHTML={{
            __html: pinSvgMarkup({ live, official, selected, category, width: size, height }),
          }}
        />
        {typeof count === "number" && <span className="rally-count">{count}</span>}
      </span>
    </span>
  );
}
