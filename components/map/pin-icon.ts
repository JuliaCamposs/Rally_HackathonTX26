import L from "leaflet";
import { ICON_PATHS } from "@/components/icons";
import type { EventSummaryDto } from "@/lib/types";

export const PIN_GRADIENT_ID = "rally-pin-grad";

/**
 * The Rally pin, recreated as vector SVG from the shipped asset sprite
 * (public/assets/pin.png): a round body with a pointed tail at the lower
 * left, lime-to-deep diagonal gradient, white center circle (live) or solid
 * eucalyptus dot (later), dashed jade halo for official org events, and a
 * ground-shadow ellipse for the selected state. Vector form lets the
 * live/later/official/hover/selected states recolor and scale.
 *
 * Geometry: circle center (24,20) r=16, tail tip (9.5,40.5), in a 44x48 box.
 */
const BODY_PATH =
  "M 14.5 39 L 25.2 35.95 A 16 16 0 1 0 8.54 24.19 L 9.2 35.3 Q 9.5 40.5 14.5 39 Z";

export function pinSvgMarkup(opts: {
  live: boolean;
  official: boolean;
  selected?: boolean;
  category: EventSummaryDto["category"];
  width?: number;
  height?: number;
}): string {
  const { live, official, selected = false, category } = opts;

  const shadow = selected
    ? `<ellipse cx="22" cy="43.5" rx="12" ry="3.4" fill="rgba(15,92,76,0.20)"/>`
    : "";

  const halo = official
    ? `<circle cx="24" cy="20" r="20.6" fill="none" stroke="#2e8b6f" stroke-width="1.6" stroke-dasharray="3 3.4" opacity="0.55"/>`
    : "";

  const body = live
    ? `<path d="${BODY_PATH}" fill="url(#${PIN_GRADIENT_ID})" stroke="#ffffff" stroke-width="1.6"/>`
    : `<path d="${BODY_PATH}" fill="#ffffff" stroke="#1d685d" stroke-width="2"/>`;

  // Live: white circle with eucalyptus icon. Later: solid eucalyptus dot
  // with white icon (the asset's "green dot" language).
  const dot = live
    ? `<circle cx="24" cy="20" r="7.4" fill="#ffffff"/>`
    : `<circle cx="24" cy="20" r="7.4" fill="#1d685d"/>`;

  const iconStroke = live ? "#1d685d" : "#ffffff";
  const icon = `<g transform="translate(17.75 13.75) scale(0.78125)" fill="none" stroke="${iconStroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[category]}</g>`;

  const w = opts.width ?? 44;
  const h = opts.height ?? 48;

  return `<svg class="rally-pin-svg" width="${w}" height="${h}" viewBox="0 0 44 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${shadow}${halo}${body}${dot}${icon}</svg>`;
}

export function makePinIcon(
  event: EventSummaryDto,
  selected: boolean,
): L.DivIcon {
  const pulse = event.live ? '<span class="rally-pulse" aria-hidden="true"></span>' : "";
  const html = `<span class="rally-pin-inner"${selected ? ' data-selected="true"' : ""}>${pulse}${pinSvgMarkup({
    live: event.live,
    official: event.source === "official",
    selected,
    category: event.category,
  })}<span class="rally-count">${event.attendeeCount}</span></span>`;

  return L.divIcon({
    html,
    className: "rally-pin",
    iconSize: [44, 48],
    // Anchor at the tail tip — that is the point marking the location.
    iconAnchor: [10, 41],
    tooltipAnchor: [15, -30],
  });
}

export function makeClusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "rally-cluster",
    iconSize: L.point(40, 40, true),
  });
}
