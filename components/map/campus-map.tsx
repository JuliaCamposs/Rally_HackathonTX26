"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { makeClusterIcon, makePinIcon, pinSvgMarkup } from "@/components/map/pin-icon";
import { PinGradientDefs } from "@/components/map/event-pin";
import { MapLegend } from "@/components/map/map-legend";
import type { EventSummaryDto } from "@/lib/types";

const TTU_CENTER: [number, number] = [33.5845, -101.877];
const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ?? "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

type CampusMapProps = {
  events: EventSummaryDto[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

/** Fits bounds to the visible events and pans to the selected pin. */
function MapController({
  events,
  selected,
}: {
  events: EventSummaryDto[];
  selected: EventSummaryDto | null;
}) {
  const map = useMap();
  const fitKey = useMemo(
    () => events.map((e) => e.id).join(","),
    [events],
  );
  const lastFitKey = useRef<string | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: true }));
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  useEffect(() => {
    if (fitKey === lastFitKey.current) return;
    lastFitKey.current = fitKey;
    if (events.length === 0) return;
    if (events.length === 1) {
      map.flyTo([events[0].lat, events[0].lng], 16, { duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.6 });
      return;
    }
    const bounds = L.latLngBounds(events.map((e) => [e.lat, e.lng] as [number, number]));
    map.flyToBounds(bounds.pad(0.18), { duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.6 });
  }, [fitKey, events, map]);

  useEffect(() => {
    if (!selected) return;
    const target: [number, number] = [selected.lat, selected.lng];
    if (!map.getBounds().contains(target)) {
      map.panTo(target, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    }
  }, [selected, map]);

  return null;
}

function PinTooltip({ event }: { event: EventSummaryDto }) {
  return (
    <Tooltip
      direction="top"
      offset={[0, -46]}
      className="rally-tip"
      opacity={1}
    >
      <span className="rally-tip-card">
        {/* eslint-disable-next-line @next/next/no-img-element -- tooltip thumb is decorative-sized */}
        <img src={event.photoPath} alt="" className="rally-tip-photo" />
        <span className="rally-tip-body">
          <span className="rally-tip-title">{event.title}</span>
          <span className="rally-tip-meta">
            {event.live ? "Happening now" : `${event.dayLabel} · ${event.timeLabel}`}
          </span>
          <span className="rally-tip-meta flex items-center gap-1">
            <span
              className="inline-block flex-none"
              dangerouslySetInnerHTML={{
                __html: pinSvgMarkup({
                  live: event.live,
                  official: false,
                  category: event.category,
                  width: 11,
                  height: 12,
                }),
              }}
            />
            {event.venueName}
          </span>
          <span className="rally-tip-count">
            {event.attendeeCount} joined{event.joined ? " · you're in" : ""}
          </span>
        </span>
      </span>
    </Tooltip>
  );
}

export default function CampusMap({ events, selectedId, onSelect }: CampusMapProps) {
  const selected = events.find((e) => e.id === selectedId) ?? null;
  const markerRefs = useRef(new Map<string, L.Marker>());

  return (
    <div className="rally-map-frame relative overflow-hidden rounded-[20px] border border-line bg-ground shadow-sm">
      <PinGradientDefs />
      <MapContainer
        center={TTU_CENTER}
        zoom={15}
        minZoom={13}
        maxZoom={18}
        scrollWheelZoom
        className="rally-map-canvas w-full"
        zoomControl={false}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
        <MapController events={events} selected={selected} />
        <ZoomControl position="topright" />
        <MarkerClusterGroup
          iconCreateFunction={makeClusterIcon}
          maxClusterRadius={44}
          spiderfyOnMaxZoom
          disableClusteringAtZoom={17}
          showCoverageOnHover={false}
        >
          {events.map((event) => (
            <Marker
              key={`${event.id}-${event.live ? "live" : "later"}-${event.attendeeCount}-${selectedId === event.id}`}
              position={[event.lat, event.lng]}
              title={event.title}
              alt={`${event.title}, ${event.venueName}`}
              icon={makePinIcon(event, selectedId === event.id)}
              ref={(m) => {
                if (m) markerRefs.current.set(event.id, m);
                else markerRefs.current.delete(event.id);
              }}
              eventHandlers={{
                click: () => onSelect(selectedId === event.id ? null : event.id),
                mouseover: () => markerRefs.current.get(event.id)?.openTooltip(),
                mouseout: () => markerRefs.current.get(event.id)?.closeTooltip(),
              }}
            >
              <PinTooltip event={event} />
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <MapLegend />
    </div>
  );
}
