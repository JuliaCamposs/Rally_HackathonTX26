import { EventPin } from "@/components/map/event-pin";

export function MapLegend() {
  return (
    <div className="absolute left-3.5 bottom-7 z-[500] flex flex-col gap-1.5 rounded-[14px] border border-line bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-mute shadow-sm backdrop-blur">
      <div className="flex items-center gap-2.5">
        <span className="grid w-[18px] flex-none place-items-center">
          <EventPin live official={false} category="social" size={16} />
        </span>
        Happening now
      </div>
      <div className="flex items-center gap-2.5">
        <span className="grid w-[18px] flex-none place-items-center">
          <EventPin live={false} official={false} category="social" size={16} />
        </span>
        Starting later
      </div>
      <div className="flex items-center gap-2.5">
        <span className="grid w-[18px] flex-none place-items-center">
          <EventPin live={false} official category="clubs" size={16} />
        </span>
        Texas Tech event
      </div>
    </div>
  );
}
