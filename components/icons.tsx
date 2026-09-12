import type { SVGProps } from "react";
import type { EventCategory } from "@/lib/types";

/**
 * Icon paths carried over from the prototype (16x16, stroke-based).
 * Kept as raw path data so they can be used both in React components and
 * inside Leaflet divIcon / tooltip HTML strings.
 */
export const ICON_PATHS = {
  sports:
    '<circle cx="8" cy="8" r="6.2"/><path d="M2.2 5.4c3.4 1.7 8.2 1.7 11.6 0M2.2 10.6c3.4-1.7 8.2-1.7 11.6 0M8 1.8v12.4"/>',
  study:
    '<path d="M8 4.6C6.9 3.4 5.2 3 2.6 3v9.2c2.6 0 4.3.4 5.4 1.6 1.1-1.2 2.8-1.6 5.4-1.6V3c-2.6 0-4.3.4-5.4 1.6Z"/><path d="M8 4.6v9.2"/>',
  social:
    '<circle cx="6" cy="5.8" r="2.3"/><path d="M1.9 13.4c0-2.2 1.8-3.6 4.1-3.6s4.1 1.4 4.1 3.6"/><circle cx="11.6" cy="6.8" r="1.8"/><path d="M11.6 10c1.6 0 2.7 1 2.7 2.6"/>',
  workshops:
    '<path d="M10.4 2.3a3.4 3.4 0 0 0-3.1 4.7l-4.5 4.5a1.6 1.6 0 0 0 2.3 2.3l4.5-4.5a3.4 3.4 0 0 0 4.4-4.4l-2 2-1.7-1.7 2-2a3.4 3.4 0 0 0-1.9-.9Z"/>',
  clubs: '<path d="M3.6 14.2V2.4M3.6 3h8.8l-2.1 2.9 2.1 2.9H3.6"/>',
  pin: '<path d="M8 14.5s5-4.2 5-8a5 5 0 0 0-10 0c0 3.8 5 8 5 8Z"/><circle cx="8" cy="6.4" r="1.9"/>',
  clock: '<circle cx="8" cy="8" r="6.2"/><path d="M8 4.4V8l2.4 1.6"/>',
  shield:
    '<path d="M8 1.6 2.4 4v4c0 3.2 2.3 5.6 5.6 6.4 3.3-.8 5.6-3.2 5.6-6.4V4Z"/><path d="M5.9 8.1 7.4 9.6l3-3.2"/>',
  person: '<circle cx="8" cy="5.4" r="2.6"/><path d="M2.8 13.6c0-2.7 2.3-4.4 5.2-4.4s5.2 1.7 5.2 4.4"/>',
  lock: '<rect x="3.2" y="7" width="9.6" height="6.6" rx="2"/><path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.8 0V7"/>',
  send: '<path d="M2.4 8h10.4M8.6 3.8 12.8 8l-4.2 4.2"/>',
  plus: '<path d="M8 3.2v9.6M3.2 8h9.6"/>',
  check: '<path d="M3.5 8.2 6.4 11l6-6.4"/>',
  back: '<path d="M10 3.5 5.5 8l4.5 4.5"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name" | "strokeWidth"> & {
  name: IconName;
  strokeWidth?: number;
};

export function Icon({ name, strokeWidth = 1.7, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
      {...props}
    />
  );
}

export function CategoryIcon({
  category,
  ...props
}: { category: EventCategory } & Omit<SVGProps<SVGSVGElement>, "name" | "strokeWidth"> & {
      strokeWidth?: number;
    }) {
  return <Icon name={category} {...props} />;
}
