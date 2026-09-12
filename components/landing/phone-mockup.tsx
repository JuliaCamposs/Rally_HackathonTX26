import Image from "next/image";

export function PhoneMockup() {
  return (
    <div className="landing-phone" aria-hidden="true">
      <div className="landing-phone-notch" />
      <div className="landing-phone-screen">
        <div className="flex items-center justify-between px-3 pt-3">
          <span className="text-[11px] font-extrabold tracking-tight text-eucalyptus">rally</span>
          <span className="rounded-full bg-pistachio px-2 py-0.5 text-[9px] font-bold uppercase text-ink">Now</span>
        </div>
        <div className="relative mx-3 mt-2 overflow-hidden rounded-xl bg-ground">
          <Image
            src="/photos/cs-study.jpg"
            alt=""
            width={320}
            height={180}
            className="h-28 w-full object-cover opacity-90"
          />
          <span className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold text-ink shadow-sm">
            CS Study Group
          </span>
        </div>
        <div className="mx-3 mt-2 rounded-xl border border-line bg-white p-2.5">
          <p className="text-[11px] font-bold text-ink">Pickup Volleyball</p>
          <p className="mt-0.5 text-[10px] text-mute">Rec Center · 7 joined</p>
          <span className="mt-2 inline-flex w-full justify-center rounded-lg bg-eucalyptus py-1.5 text-[10px] font-bold text-white">
            Join this event
          </span>
        </div>
      </div>
    </div>
  );
}
