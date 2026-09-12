const STEPS = [
  { n: "01", title: "Find", text: "Open the live map. Filter by now, later, Texas Tech, or community." },
  { n: "02", title: "Join", text: "Pick a pin. Join this event. The group chat opens with the people already going." },
  { n: "03", title: "Show up", text: "Confirm you’re here. Take 50 points. The bar under You ticks up." },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="landing-section pt-0">
      <div className="landing-wrap">
        <p className="landing-kicker">How It Works</p>
        <h2 className="landing-h2">Find. Join. Show up.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-[20px] border border-line bg-white p-6">
              <span className="text-[13px] font-bold tracking-[0.08em] text-eucalyptus">{s.n}</span>
              <h3 className="mt-2 text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-mute">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
