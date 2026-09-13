import { MapPinned, Building2, Lock, Trophy } from "lucide-react";

const REASONS = [
  {
    icon: MapPinned,
    title: "Live, not a flyer wall",
    text: "Events sit on a real campus map with time, place, and who’s already there. You don’t hunt a spreadsheet.",
  },
  {
    icon: Building2,
    title: "Official + community",
    text: "Texas Tech org events and student-run hangouts in one feed. Filter either way in a tap.",
  },
  {
    icon: Lock,
    title: "Chat after you join",
    text: "The group stays locked until you commit. No lurkers in the thread about where the courts are.",
  },
  {
    icon: Trophy,
    title: "Points for showing up",
    text: "Submit a private event photo for 50 points, once per event. Level up under You — not for scrolling, for being there.",
  },
];

export function LandingWhy() {
  return (
    <section id="why" className="landing-section bg-white">
      <div className="landing-wrap">
        <p className="landing-kicker">Why Choose Us</p>
        <h2 className="landing-h2">Why Rally, not another group chat</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {REASONS.map((r) => (
            <div key={r.title} className="flex gap-4 rounded-[20px] border border-line bg-page p-5">
              <r.icon className="mt-0.5 size-8 shrink-0 text-eucalyptus" strokeWidth={1.75} />
              <div>
                <h3 className="text-[17px] font-bold text-ink">{r.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-mute">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
