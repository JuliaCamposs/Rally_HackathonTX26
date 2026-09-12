"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is Rally only for Texas Tech?",
    a: "This campus is Texas Tech University in Lubbock — that’s the map you open today. The product is built so another campus can be next.",
  },
  {
    q: "Do I need to join to see the map?",
    a: "No. The live map, filters, and event cards are open. Join when you want the group chat and the I’m here button.",
  },
  {
    q: "How do points work?",
    a: "Join an event, then confirm you’re there. That’s 50 points, once per event. Leaving later doesn’t take them back. The bar under You fills toward the next 150-point level.",
  },
  {
    q: "Is the group chat public?",
    a: "No. Chat stays locked until you tap Join this event. Same as in the app: you’re in, or you’re not.",
  },
];

export function LandingFaq() {
  return (
    <section id="faqs" className="landing-section bg-white">
      <div className="landing-wrap max-w-3xl">
        <p className="landing-kicker">FAQs</p>
        <h2 className="landing-h2">Questions before you open the map</h2>
        <Accordion className="mt-8" defaultValue={[]}>
          {FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`q-${i}`} className="border-line">
              <AccordionTrigger className="py-4 text-[15px] font-bold text-ink hover:no-underline">
                + {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[14.5px] leading-relaxed text-mute">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
