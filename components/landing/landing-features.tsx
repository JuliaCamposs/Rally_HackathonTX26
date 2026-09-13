import Image from "next/image";
import { MessageSquare, MapPin, Sparkles } from "lucide-react";

const FEATURES = [
  {
    id: "map",
    title: "Live campus map",
    copy: "Pins on a real map of Texas Tech — happening now vs starting later, hover bubbles with photo, time, and who already joined. Not a flyer wall.",
    image: "/photos/volleyball.jpg",
    caption: "Pickup Volleyball · Rec Center",
    icon: MapPin,
  },
  {
    id: "chat",
    title: "Join, then talk",
    copy: "Tap Join this event. The group chat stays locked until you do. Same CTA as in the app: you’re going, or you leave.",
    image: "/photos/resume.jpg",
    caption: "Group chat unlocks after you join",
    icon: MessageSquare,
  },
  {
    id: "points",
    title: "Prove you’re there. Earn points.",
    copy: "While the event is happening, tap I’m here and submit an event photo as private proof for +50 points — once per event. Your total, level, and progress bar sit under You.",
    image: "/photos/salsa.jpg",
    caption: "+50 pts with a photo check-in",
    icon: Sparkles,
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="landing-section">
      <div className="landing-wrap">
        <p className="landing-kicker">Features</p>
        <h2 className="landing-h2">What sets Rally apart</h2>
        <p className="mt-3 max-w-2xl text-[15px] text-mute">
          Three things the app actually does: show you the map, let you join the
          group, and reward you for being there.
        </p>
        <div className="mt-10 flex flex-col gap-10">
          {FEATURES.map((f, i) => (
            <article
              key={f.id}
              className={`grid items-center gap-8 overflow-hidden rounded-[24px] border border-line bg-white p-5 shadow-sm md:grid-cols-2 md:p-8 ${
                i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ground">
                <Image src={f.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-[12px] font-bold text-ink">
                  {f.caption}
                </span>
              </div>
              <div>
                <f.icon className="size-8 text-eucalyptus" strokeWidth={1.8} />
                <h3 className="mt-3 text-[22px] font-bold tracking-tight text-ink">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#33453d]">{f.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
