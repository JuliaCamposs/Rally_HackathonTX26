import Image from "next/image";
import { RallyBuddy } from "@/components/rally-buddy";
import { StoreButtons } from "@/components/landing/store-buttons";

const PARTNERS = [
  "Texas Tech",
  "Rec Center",
  "Career Center",
  "ACM",
  "Photo Club",
  "Student Union",
];

export function LandingPartners() {
  return (
    <section className="border-y border-line bg-white py-10">
      <div className="landing-wrap">
        <p className="text-center text-[12px] font-bold tracking-[0.14em] text-mute uppercase">
          We are partnered with more than 50+ companies around the globe
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {PARTNERS.map((name) => (
            <li
              key={name}
              className="rounded-full border border-line bg-page px-4 py-2 text-[13px] font-bold text-eucalyptus"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LandingCta() {
  return (
    <section className="landing-cta">
      <div className="landing-wrap grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
            Open the map. Pick a pin. Be there.
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/85">
            Download Rally, see what’s live at Texas Tech, and show up with the
            people already on the lawn.
          </p>
          <div className="mt-7 [&_a]:bg-white [&_a]:text-ink">
            <StoreButtons />
          </div>
        </div>
        <div className="flex justify-center">
          <RallyBuddy animated className="h-40 w-32 brightness-110" />
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-page py-8">
      <div className="landing-wrap flex flex-wrap items-center gap-4">
        <Image src="/brand/rally-logo.svg" alt="Rally" width={90} height={46} />
        <p className="text-[13px] text-mute">Texas Tech University · Lubbock</p>
        <p className="ml-auto text-[12px] text-faint">© {new Date().getFullYear()} Rally</p>
      </div>
    </footer>
  );
}
