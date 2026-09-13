const REVIEWS = [
  {
    name: "Maya Ruiz",
    place: "Lubbock, TX · Kinesiology",
    text: "Posted pickup volleyball, had a full 4v4 in twenty minutes. The pin is right on the sand courts — nobody asked “where?” in the chat.",
  },
  {
    name: "Devon Clark",
    place: "Lubbock, TX · Computer Science",
    text: "Study group stayed on the map all afternoon. People filtered in, joined, and the table never went empty. That’s the whole point.",
  },
  {
    name: "Ines Rojas",
    place: "Lubbock, TX · Hispanic Student Society",
    text: "Salsa Night filled from the pin, not the Instagram story. Sharing my event photo and watching the points tick felt silly until it didn’t.",
  },
];

function Stars() {
  return (
    <span className="flex gap-0.5 text-jade" aria-label="5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 16 16" className="size-4 fill-current" aria-hidden="true">
          <path d="M8 1.4 9.9 5.3l4.3.6-3.1 3 0.7 4.3L8 11.4 4.2 13.2l.7-4.3-3.1-3 4.3-.6L8 1.4Z" />
        </svg>
      ))}
    </span>
  );
}

export function LandingReviews() {
  return (
    <section id="reviews" className="landing-section">
      <div className="landing-wrap">
        <p className="landing-kicker">Reviews</p>
        <h2 className="landing-h2">Let students convince the rest</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="flex flex-col rounded-[20px] border border-line bg-white p-6">
              <Stars />
              <blockquote className="mt-3 flex-1 text-[14.5px] leading-relaxed text-[#33453d]">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-4 text-[13px] font-bold text-ink">
                {r.name}
                <span className="mt-0.5 block font-medium text-mute">{r.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
